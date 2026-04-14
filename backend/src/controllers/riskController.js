/**
 * @file controllers/riskController.js
 */
const DisputeRecord = require("../models/DisputeRecord");
const { predictDispute } = require("../services/aiService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const assessRisk = async (req, res, next) => {
  try {
    const result = await predictDispute(req.body);
    const record = await DisputeRecord.create({ land_id: req.body.land_id, ...result, ...req.body });
    sendSuccess(res, { ...result, record_id: record._id });
  } catch (err) { next(err); }
};

const getRiskHistory = async (req, res, next) => {
  try {
    const records = await DisputeRecord.find({ land_id: req.params.landId }).sort({ createdAt: -1 });
    sendSuccess(res, records);
  } catch (err) { next(err); }
};

module.exports = { assessRisk, getRiskHistory };
