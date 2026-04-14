/**
 * @file models/LandRecord.js — Land parcel schema
 */
const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  transaction_type: { type: String, enum: ["sale", "valuation", "auction"] },
});

const landRecordSchema = new mongoose.Schema(
  {
    survey_number: { type: String, required: true, unique: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      district: { type: String, required: true },
      state: { type: String, default: "Maharashtra" },
      address: { type: String },
    },
    area_sqft: { type: Number, required: true, min: 1 },
    land_type: { type: String, enum: ["agricultural", "residential", "commercial", "industrial"], required: true },
    zone: { type: String, enum: ["A", "B", "C", "D"], required: true },
    infrastructure_score: { type: Number, min: 1, max: 10, default: 5 },
    near_water: { type: Boolean, default: false },
    near_highway: { type: Boolean, default: false },
    road_access: { type: Boolean, default: true },
    price_history: [priceHistorySchema],
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    is_disputed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LandRecord", landRecordSchema);
