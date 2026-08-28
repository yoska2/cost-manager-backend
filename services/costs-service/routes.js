/*
 * This file contains the routes for the costs service.
 * It allows users to add new cost items and get monthly reports.
 * Past monthly reports are saved using the Computed Design Pattern.
 */

// services/costs-service/routes.js
const express = require("express");
const Cost = require("../../models/Cost");
const Report = require("../../models/Report");
const User = require("../../models/User");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");
const CATEGORIES = require("../../common/categories");

const router = express.Router();
const { endpointAccessLog } = createLogger("costs-service");

// Check if the month is valid
function isValidMonth(month) {
    return Number.isInteger(month) && month >= 1 && month <= 12;
}

// Check if the year is valid
function isValidYear(year) {
    return Number.isInteger(year) && year >= 1970 && year <= 3000;
}


/*
 * This function creates a monthly report for a user.
 * Costs are grouped by category with their sum, description and day.
 * For past months, the Computed Design Pattern allows the report to be saved
 * and used again instead of calculating it every time.
 */
async function generateReport(userid, year, month) {

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const costs = await Cost.find({ userid, createdAt: { $gte: start, $lt: end } }).lean();

    // Create an empty list for every cost category
    const grouped = {
        food: [],
        health: [],
        housing: [],
        sport: [],
        education: []
    };

    // Add every cost to its category
    for (const c of costs) {
        grouped[c.category].push({
            sum: Number(c.sum),
            description: c.description,
            day: new Date(c.createdAt).getDate()
        });
    }

    // Build the final report structure
    const report = {
        userid: userid,
        year: year,
        month: month,
        costs: [
            { food: grouped.food },
            { health: grouped.health },
            { housing: grouped.housing },
            { sport: grouped.sport },
            { education: grouped.education }
        ]
    };

    return report;
}

// Add a new cost item
// POST /api/add
router.post("/add", async (req, res) => {
    await endpointAccessLog(req, res, "POST /api/add (cost)");
    const { userid, description, category, sum, createdAt } = req.body;
    
    // Check the required cost fields and their types
    if (typeof description !== "string" ||
        typeof category !== "string" ||
        typeof userid !== "number" ||
        typeof sum !== "number"
    ) {
        return res.status(400).json(errorJson(400, "Invalid cost fields"));
    }

    // Check if the category is allowed
    if (!CATEGORIES.includes(category)) {
        return res.status(400).json(errorJson(400, "Invalid category"));
    }

     // Check that the cost sum is positive
    if (sum <= 0) {
    return res.status(400).json(errorJson(400, "sum must be positive"));
    }
    
    // Use the current date if no date was provided
    let costDate = new Date();
    if (createdAt !== undefined) {
        const parsedDate = new Date(createdAt);

        // Check if the provided date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json(errorJson(400, "Invalid date"));
        }

        // Do not allow costs with a past date
        if (parsedDate < new Date()) {
            return res.status(400).json(errorJson(400, "Cannot add cost in the past"));
        }

        costDate = parsedDate;
    }

    try {
        // Check that the user exists before adding the cost
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json(errorJson(404, "User does not exist"));
        }

        // Create the new cost item
        const cost = new Cost({
            userid,
            description,
            category,
            sum,
            createdAt: costDate
        });

        // Save the cost in MongoDB
        await cost.save();

        return res.status(200).json({
            userid: cost.userid,
            description: cost.description,
            category: cost.category,
            sum: Number(cost.sum),
            createdAt: cost.createdAt
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(errorJson(500, "Internal server error"));
    }
    
});

// Get a monthly report
// GET /api/report?id=...&year=...&month=...
router.get("/report", async (req, res) => {
    await endpointAccessLog(req, res, "GET /api/report");

    // Get the report parameters from the query string
    const userid = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    // Check that all parameters are valid numbers
    if (!Number.isInteger(userid)|| !Number.isInteger(year) || !Number.isInteger(month)) {
        return res.status(400).json(errorJson(400, "Missing id/year/month"));
    }

    // Check the year and month values
    if (!isValidYear(year) || !isValidMonth(month)) {
        return res.status(400).json(errorJson(400, "Invalid year or month"));
    }


    try {
        // Check that the requested user exists
        const userExists = await User.findOne({ id: userid });
        if (!userExists) {
            return res.status(404).json(errorJson(404, "User does not exist"));
        }

        // Check if the requested month is in the past
        const now = new Date();
        const past = (year < now.getFullYear()) || (year === now.getFullYear() && month < (now.getMonth()+1));

        /*
         * Computed Design Pattern:
         * Reports for past months are saved in MongoDB after they are calculated.
         * If the report already exists, it is returned without calculating it again.
         * Reports for the current or future months are always generated again.
         */
        if (past) {
            let report = await Report.findOne({ userid, year, month }).lean();

            // Create and save the report if it does not exist
            if (!report) {
                report = await generateReport(userid, year, month);
                await Report.create(report);
            }

            return res.status(200).json(report);
        }
        else {
            return res.status(200).json(await generateReport(userid, year, month));
        }

    }
    catch (err) {
        console.error(err);
        return res.status(500).json(errorJson(500, "Internal server error"));
    }

});

// Export the router for use by the costs service
module.exports = router;