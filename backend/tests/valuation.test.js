/**
 * @file tests/valuation.test.js
 */
const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/db", () => ({ connectDB: jest.fn() }));
jest.mock("../src/services/aiService", () => ({
  predictValuation: jest.fn().mockResolvedValue({ predicted_price: 5000000, confidence_score: 0.85, model_used: "Ensemble", shap_values: {}, breakdown: {} }),
  getRecommendation: jest.fn().mockResolvedValue({ action: "BUY" }),
}));
jest.mock("../src/models/LandRecord", () => ({ findOne: jest.fn().mockResolvedValue(null), create: jest.fn().mockResolvedValue({ _id: "land123" }) }));
jest.mock("../src/models/ValuationResult", () => ({ create: jest.fn().mockResolvedValue({ _id: "val123" }), find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([]) }) }));
jest.mock("../src/services/notificationService", () => ({ notifyValuationComplete: jest.fn() }));
jest.mock("../src/config/jwt", () => ({ signToken: jest.fn(), verifyToken: jest.fn().mockReturnValue({ id: "user123", role: "user", email: "t@t.com" }) }));

describe("Valuation Routes", () => {
  it("GET /api/valuation/history — requires auth", async () => {
    const res = await request(app).get("/api/valuation/history");
    expect(res.status).toBe(401);
  });
});
