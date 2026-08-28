/*
 * This file defines how logs are stored in MongoDB.
 * Each log contains information about an HTTP request or endpoint access.
 * The logs help us track what happens in each service.
 */

// models/Log.js
const mongoose = require("mongoose");

// Schema defining the structure of a log document
const LogSchema = new mongoose.Schema(
    {
        // Timestamp indicating when the log event occurred
        time: { type: Date, required: true, default: Date.now },
        service: { type: String, required: true },

        // Log severity level (e.g., info, error)
        level: { type: String, required: true }, // info / error

        method: { type: String, required: true },
        path: { type: String, required: true },
        status: { type: Number, required: true },
        message: { type: String, required: true },

        // Optional metadata for additional context (e.g., error details)
        meta: { type: Object }
    },
    { versionKey: false }
);

// Export the model so the application can work with the logs collection
module.exports = mongoose.model("Log", LogSchema, "logs");