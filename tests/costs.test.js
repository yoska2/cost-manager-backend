// tests/costs.test.js
const request = require("supertest");

const COSTS_BASE = "https://cost-manager-costs-birh.onrender.com";

describe("Costs service", () => {

    // Check that a valid cost can be added
    test("POST /api/add adds a cost (with future createdAt)", async () => {
        const future = new Date(Date.now() + 60 * 1000).toISOString();

        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "choco",
                category: "food",
                userid: 123123,
                sum: 12,
                createdAt: future
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("description", "choco");
        expect(res.body).toHaveProperty("category", "food");
        expect(res.body).toHaveProperty("userid", 123123);
        expect(res.body).toHaveProperty("sum");
    });

    // Check that a cost with a past date is rejected
    test("POST /api/add rejects past cost", async () => {
        const past = new Date(Date.now() - 60 * 1000).toISOString();

        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "old",
                category: "food",
                userid: 123123,
                sum: 1,
                createdAt: past
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    // Check that an invalid category is rejected
    test("POST /api/add rejects invalid category", async () => {
        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "test",
                category: "invalid",
                userid: 123123,
                sum: 10
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    // Check that invalid field types are rejected
    test("POST /api/add rejects invalid fields", async () => {
        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: 123,
                category: "food",
                userid: "123123",
                sum: "12"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    // Check that a cost cannot be added for a user that does not exist
    test("POST /api/add rejects unknown user", async () => {
        const res = await request(COSTS_BASE)
            .post("/api/add")
            .send({
                description: "test",
                category: "food",
                userid: 999999999,
                sum: 10
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    // Check that the monthly report has the expected structure
    test("GET /api/report returns report JSON", async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await request(COSTS_BASE).get(
            `/api/report?id=123123&year=${year}&month=${month}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("userid", 123123);
        expect(res.body).toHaveProperty("year", year);
        expect(res.body).toHaveProperty("month", month);
        expect(res.body).toHaveProperty("costs");
        expect(Array.isArray(res.body.costs)).toBe(true);
    });

    // Check that all required categories appear in the report
    test("GET /api/report contains all categories", async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await request(COSTS_BASE).get(
            `/api/report?id=123123&year=${year}&month=${month}`
        );

        expect(res.statusCode).toBe(200);

        const categories = res.body.costs.map(
            (item) => Object.keys(item)[0]
        );

        expect(categories).toContain("food");
        expect(categories).toContain("education");
        expect(categories).toContain("health");
        expect(categories).toContain("housing");
        expect(categories).toContain("sport");
    });

    // Check that an invalid month is rejected
    test("GET /api/report rejects invalid month", async () => {
        const res = await request(COSTS_BASE)
            .get("/api/report?id=123123&year=2026&month=13");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    // Check that a report cannot be requested for an unknown user
    test("GET /api/report rejects unknown user", async () => {
        const res = await request(COSTS_BASE)
            .get("/api/report?id=999999999&year=2026&month=5");

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });
});