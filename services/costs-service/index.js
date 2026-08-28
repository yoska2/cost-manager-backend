// services/costs-service/index.js
require("dotenv").config();
const { connectToMongo } = require("../../models/db");
const { buildCostsApp } = require("./app");

// Start the costs service and connect it to MongoDB
async function main() {
    await connectToMongo();

    const app = buildCostsApp();
    const port = Number(process.env.PORT || process.env.PORT_COSTS || 3002);

    app.listen(port, () => {
        console.log(`costs-service running on ${port}`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
