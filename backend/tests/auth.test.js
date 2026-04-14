/**
 * @file tests/auth.test.js
 */
const request = require("supertest");
const app = require("../src/app");

// Mock mongoose to avoid real DB connection in tests
jest.mock("../src/config/db", () => ({ connectDB: jest.fn() }));
jest.mock("../src/models/User", () => {
  const mockUser = { _id: "123", email: "test@test.com", role: "user", isVerified: true, toSafeObject: () => ({ email: "test@test.com" }), comparePassword: jest.fn().mockResolvedValue(true), save: jest.fn() };
  return { findOne: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue(mockUser), findById: jest.fn() };
});
jest.mock("../src/services/emailService", () => ({ sendOTPEmail: jest.fn() }));

describe("Auth Routes", () => {
  it("POST /api/auth/register — returns 201 on valid input", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User", email: "new@test.com", password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/auth/register — returns 422 on missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "bad" });
    expect(res.status).toBe(422);
  });

  it("GET /health — returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
