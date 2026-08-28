/*
 * This file creates error responses.
 * All services use it to return errors in the same format.
 * Every error has an id and a message.
 */

// Create an error object with an id and a message
function errorJson(id, message) {
    return { id, message };
}

// Export the function so other files can use it
module.exports = { errorJson };