const mongoose = require("mongoose");

const disputeRecordSchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord", required: true },
    risk_score: { type: Number, min: 0, max: 100 },
    risk_category: { type: String, enum: ["Low", "Medium", "High", "Critical"] },
    factors: [{ type: String }],
    ownership_changes_count: { type: Number, default: 0 },
    survey_conflict: { type: Boolean, default: false },
    litigation_history_count: { type: Number, default: 0 },
    boundary_disputes: { type: Boolean, default: false },
    multiple_claimants: { type: Boolean, default: false },
    status: { type: String, enum: ["open", "resolved", "under_review"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DisputeRecord", disputeRecordSchema);
