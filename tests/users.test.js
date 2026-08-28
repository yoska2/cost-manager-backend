// tests/users.test.js
const request = require("supertest");

const USERS_BASE = "http://localhost:3001";

describe("Users service", () => {

    // Check that a new user can be added
    test("POST /api/users adds a user", async () => {
        const res = await request(USERS_BASE)
            .post("/api/users")
            .send({
                id: 900001,
                first_name: "Test",
                last_name: "User",
                birthday: "2000-01-01"
            });

        expect([200, 409]).toContain(res.statusCode);

        if (res.statusCode === 200) {
            expect(res.body).toHaveProperty("id", 900001);
            expect(res.body).toHaveProperty("first_name", "Test");
            expect(res.body).toHaveProperty("last_name", "User");
        }
    });

    // Check that /api/users returns an array
    test("GET /api/users returns array", async () => {
        const res = await request(USERS_BASE).get("/api/users");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Check that the predefined user returns details and total costs
    test("GET /api/users/:id returns user details with total", async () => {
        const res = await request(USERS_BASE).get("/api/users/123123");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("first_name", "mosh");
        expect(res.body).toHaveProperty("last_name", "israeli");
        expect(res.body).toHaveProperty("id", 123123);
        expect(res.body).toHaveProperty("total");
    });

    // Check validation of an invalid user id
    test("GET /api/users/:id rejects invalid id", async () => {
        const res = await request(USERS_BASE).get("/api/users/abc");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });
});