/**
 * @file controllers/valuationController.js
 */
const LandRecord = require("../models/LandRecord");
const ValuationResult = require("../models/ValuationResult");
const { predictValuation, getRecommendation } = require("../services/aiService");
const { notifyValuationComplete } = require("../services/notificationService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * POST /api/valuation/predict
 */
const predict = async (req, res, next) => {
  try {
    const { survey_number, area_sqft, land_type, zone, infrastructure_score,
      near_water, near_highway, road_access, district, location } = req.body;

    // Upsert land record
    let land = await LandRecord.findOne({ survey_number });
    if (!land) {
      land = await LandRecord.create({
        survey_number, area_sqft, land_type, zone, infrastructure_score,
        near_water, near_highway, road_access,
        location: { district, ...location },
        owner_id: req.user.id,
      });
    }

    // Call AI engine
    const aiResult = await predictValuation({ area_sqft, land_type, zone, infrastructure_score, near_water, near_highway, road_access, district });

    // Get recommendation
    const rec = await getRecommendation({ risk_score: 30, forecast_growth_pct: aiResult.confidence_score * 20, confidence_score: aiResult.confidence_score }).catch(() => ({ action: "HOLD" }));

    // Save result
    const saved = await ValuationResult.create({
      land_id: land._id,
      user_id: req.user.id,
      predicted_price: aiResult.predicted_price,
      confidence_score: aiResult.confidence_score,
      shap_values: aiResult.shap_values,
      model_used: aiResult.model_used,
      recommendation: rec.action,
    });

    await notifyValuationComplete(req.user.id, aiResult);
    sendSuccess(res, { ...aiResult, recommendation: rec, valuation_id: saved._id, land_id: land._id }, "Valuation complete");
  } catch (err) { next(err); }
};

/**
 * GET /api/valuation/history
 */
const getHistory = async (req, res, next) => {
  try {
    const results = await ValuationResult.find({ user_id: req.user.id })
      .populate("land_id", "survey_number district area_sqft")
      .sort({ createdAt: -1 })
      .limit(20);
    sendSuccess(res, results);
  } catch (err) { next(err); }
};

module.exports = { predict, getHistory };
