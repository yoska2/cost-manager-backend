/*
 * This file contains the routes for the logs service.
 * It allows the system to return the logs stored in MongoDB.
 * These logs contain information about requests and endpoint access.
 */

// services/logs-service/routes.js
const express = require("express");
const Log = require("../../models/Log");
const { errorJson } = require("../../common/error");
const { createLogger } = require("../../common/logger");

// Initialize a logger instance scoped to the logs service
const router = express.Router();
const { endpointAccessLog } = createLogger("logs-service");

// Retrieve all log entries sorted by most recent first
// GET /api/logs -> return all logs
router.get("/logs", async (req, res) => {
    // Log explicit access to the logs endpoint
    await endpointAccessLog(req, res, "GET /api/logs");

    try {
        // Fetch logs from the database in descending order by timestamp
        const logs = await Log.find({}).sort({ time: -1 });
        return res.status(200).json(logs);
    } 
    // Handle unexpected database or server errors
    catch (e) {
        return res.status(500).json(errorJson(500, "Failed to fetch logs"));
    }
});

// Export the logs service router
module.exports = router;
