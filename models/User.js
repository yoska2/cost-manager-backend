/*
 * This file defines how users are stored in MongoDB.
 * Each user has a unique id, first name, last name and birthday.
 * The user id is different from MongoDB's internal _id.
 */
// models/User.js
const mongoose = require("mongoose");

// Schema defining the structure of a user document
const UserSchema = new mongoose.Schema(
    {
        // External user identifier used by the API (not MongoDB's internal _id)
        id: { type: Number, required: true, unique: true, index: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        birthday: { type: Date, required: true }
    },
    { versionKey: false }
);

// Export the model so other files can work with the users collection
module.exports = mongoose.model("User", UserSchema, "users");
