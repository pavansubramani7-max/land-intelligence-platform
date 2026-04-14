/**
 * @file tests/fraud.test.js
 */
const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/db", () => ({ connectDB: jest.fn() }));
jest.mock("../src/services/aiService", () => ({
  detectFraud: jest.fn().mockResolvedValue({ is_fraud: true, anomaly_score: 0.8, fraud_probability: 0.9, fraud_type: "price_spike", confidence: 0.9 }),
}));
jest.mock("../src/models/FraudAlert", () => ({ create: jest.fn().mockResolvedValue({ _id: "alert1", alert_type: "price_spike" }), find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), populate: jest.fn().mockResolvedValue([]) }) }));
jest.mock("../src/services/notificationService", () => ({ notifyFraudAlert: jest.fn() }));
jest.mock("../src/config/jwt", () => ({ verifyToken: jest.fn().mockReturnValue({ id: "user123", role: "analyst" }) }));

describe("Fraud Routes", () => {
  it("POST /api/fraud/detect — requires auth", async () => {
    const res = await request(app).post("/api/fraud/detect").send({ price_change_pct: 150 });
    expect(res.status).toBe(401);
  });
});
