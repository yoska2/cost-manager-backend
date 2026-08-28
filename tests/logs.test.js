// tests/logs.test.js
const request = require("supertest");

const LOGS_BASE = "http://localhost:3003";

describe("Logs service", () => {

    // Check that /api/logs returns a successful response with an array
    test("GET /api/logs returns array", async () => {
        const res = await request(LOGS_BASE).get("/api/logs");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Check the structure of log objects when logs exist
    test("GET /api/logs returns valid log structure", async () => {
        const res = await request(LOGS_BASE).get("/api/logs");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
            const log = res.body[0];

            expect(log).toHaveProperty("time");
            expect(log).toHaveProperty("service");
            expect(log).toHaveProperty("level");
            expect(log).toHaveProperty("method");
            expect(log).toHaveProperty("path");
            expect(log).toHaveProperty("status");
            expect(log).toHaveProperty("message");
        }
    });
});