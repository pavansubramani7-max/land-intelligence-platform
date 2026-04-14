/**
 * @file controllers/geoController.js
 */
const LandRecord = require("../models/LandRecord");
const { sendSuccess } = require("../utils/apiResponse");

const getHeatmapData = async (req, res, next) => {
  try {
    const records = await LandRecord.find({ "location.lat": { $exists: true } })
      .select("location is_disputed")
      .limit(500);
    const points = records.map((r) => ({
      lat: r.location.lat,
      lng: r.location.lng,
      intensity: r.is_disputed ? 0.9 : 0.3,
    }));
    sendSuccess(res, points);
  } catch (err) { next(err); }
};

const getLandsByDistrict = async (req, res, next) => {
  try {
    const { district } = req.params;
    const records = await LandRecord.find({ "location.district": district }).limit(100);
    sendSuccess(res, records);
  } catch (err) { next(err); }
};

module.exports = { getHeatmapData, getLandsByDistrict };
