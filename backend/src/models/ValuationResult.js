/**
 * @file models/ValuationResult.js
 */
const mongoose = require("mongoose");

const valuationResultSchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    predicted_price: { type: Number, required: true },
    confidence_score: { type: Number, min: 0, max: 1 },
    shap_values: { type: mongoose.Schema.Types.Mixed },
    model_used: { type: String, default: "RF+XGB+ANN Ensemble" },
    recommendation: { type: String, enum: ["BUY", "HOLD", "AVOID"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ValuationResult", valuationResultSchema);
