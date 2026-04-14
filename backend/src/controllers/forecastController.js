/**
 * @file controllers/forecastController.js
 */
const ForecastRecord = require("../models/ForecastRecord");
const { predictForecast } = require("../services/aiService");
const { sendSuccess } = require("../utils/apiResponse");

const forecast = async (req, res, next) => {
  try {
    const { land_id, current_price, months_history } = req.body;
    const result = await predictForecast({ current_price, months_history });
    const record = await ForecastRecord.create({ land_id, current_price, ...result });
    sendSuccess(res, { ...result, record_id: record._id });
  } catch (err) { next(err); }
};

module.exports = { forecast };
