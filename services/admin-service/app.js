// services/admin-service/app.js
const express = require("express");
const { createLogger } = require("../../common/logger");
const routes = require("./routes");

// Create and configure the Express application for the admin service
function buildAdminApp() {
    const app = express();
    app.use(express.json());

    const { requestLogger } = createLogger("admin-service");
    app.use(requestLogger);

    app.use("/api", routes);

    return app;
}

module.exports = { buildAdminApp };
