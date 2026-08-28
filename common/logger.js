/*
 * This file handles logging for all services.
 * It uses Pino and saves the logs in MongoDB.
 * It logs HTTP requests and endpoint access.
 */

// common/logger.js
const pino = require("pino");
const Log = require("../models/Log");

/*
 * Create a logger for a specific service.
 * Each service sends its name to this function.
 */
function createLogger(serviceName) {
    const logger = pino({ name: serviceName });

    // Log when a specific endpoint is used
    async function endpointAccessLog(req, res, endpointName) {
        const msg = `Endpoint accessed: ${endpointName}`;
        logger.info(msg);

        // Save the endpoint log in MongoDB
        try {
            await Log.create({
                service: serviceName,
                level: "info",
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode || 200,
                message: msg
            });
        } catch (e) {
            logger.error({ err: e }, "Failed writing endpoint log to DB");
        }
    }

    // Log every HTTP request
    function requestLogger(req, res, next) {
        const start = Date.now();

        // Wait until the response is finished
        res.on("finish", async () => {
            const ms = Date.now() - start;
            const msg = `${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`;

            logger.info(msg);

            // Save the request log in MongoDB
            try {
                await Log.create({
                    service: serviceName,
                    level: "info",
                    method: req.method,
                    path: req.originalUrl,
                    status: res.statusCode,
                    message: msg,
                    meta: { ms }
                });
            } catch (e) {
                logger.error({ err: e }, "Failed writing request log to DB");
            }
        });

        next();
    }

    // Return everything that the services need
    return {
        logger,
        endpointAccessLog,
        requestLogger
    };
}

// Export the function for use in other files
module.exports = { createLogger };