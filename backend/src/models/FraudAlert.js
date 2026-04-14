const mongoose = require("mongoose");

const fraudAlertSchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord", required: true },
    alert_type: { type: String, enum: ["price_spike", "rapid_resale", "ownership_anomaly"], required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    description: { type: String },
    anomaly_score: { type: Number },
    fraud_probability: { type: Number },
    status: { type: String, enum: ["open", "investigating", "resolved", "false_positive"], default: "open" },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FraudAlert", fraudAlertSchema);
