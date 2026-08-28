// tests/admin.test.js
const request = require("supertest");

const ADMIN_BASE = "http://localhost:3004";

describe("Admin service", () => {

    // Check that /api/about returns the developers team
    test("GET /api/about returns team array", async () => {
        const res = await request(ADMIN_BASE).get("/api/about");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Check that every team member contains only first_name and last_name
    test("GET /api/about returns correct team member fields", async () => {
        const res = await request(ADMIN_BASE).get("/api/about");

        expect(res.statusCode).toBe(200);

        for (const member of res.body) {
            expect(member).toHaveProperty("first_name");
            expect(member).toHaveProperty("last_name");

            expect(Object.keys(member).sort()).toEqual(
                ["first_name", "last_name"].sort()
            );
        }
    });

    // Check that first_name and last_name are strings
    test("GET /api/about returns valid names", async () => {
        const res = await request(ADMIN_BASE).get("/api/about");

        expect(res.statusCode).toBe(200);

        for (const member of res.body) {
            expect(typeof member.first_name).toBe("string");
            expect(typeof member.last_name).toBe("string");
        }
    });
});