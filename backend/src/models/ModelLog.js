const mongoose = require("mongoose");

const modelLogSchema = new mongoose.Schema(
  {
    model_name: { type: String, required: true },
    action: { type: String, enum: ["predict", "retrain", "load", "error"] },
    input_summary: { type: mongoose.Schema.Types.Mixed },
    output_summary: { type: mongoose.Schema.Types.Mixed },
    latency_ms: { type: Number },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ModelLog", modelLogSchema);
