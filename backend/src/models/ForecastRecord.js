const mongoose = require("mongoose");

const forecastRecordSchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord" },
    current_price: { type: Number, required: true },
    forecast_1yr: { type: Number },
    forecast_3yr: { type: Number },
    growth_rate_1yr_pct: { type: Number },
    growth_rate_3yr_pct: { type: Number },
    trend_direction: { type: String, enum: ["upward", "downward", "stable"] },
    monthly_forecast: [{ type: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForecastRecord", forecastRecordSchema);
