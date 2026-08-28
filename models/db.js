/*
 /*
 * This file handles the connection to MongoDB.
 * All services use this file to connect to the database.
 * using the connection string provided via the MONGODB_URI environment variable.
 * It is imported and used by each service at startup.
 */
const mongoose = require("mongoose");

// Establish a connection to MongoDB using Mongoose
async function connectToMongo() {
    // Enforce strict query filtering to avoid unintended query behavior
    mongoose.set("strictQuery", true);
    // Connect to MongoDB using the URI supplied through environment configuration
    await mongoose.connect(process.env.MONGODB_URI);
}

// Export the function so other services can connect to MongoDB
module.exports = { connectToMongo };
