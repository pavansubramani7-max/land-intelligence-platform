/**
 * @file controllers/fraudController.js
 */
const FraudAlert = require("../models/FraudAlert");
const { detectFraud } = require("../services/aiService");
const { notifyFraudAlert } = require("../services/notificationService");
const { sendSuccess } = require("../utils/apiResponse");

const detect = async (req, res, next) => {
  try {
    const result = await detectFraud(req.body);
    if (result.is_fraud) {
      const alert = await FraudAlert.create({
        land_id: req.body.land_id,
        alert_type: result.fraud_type || "price_spike",
        severity: result.fraud_probability > 0.8 ? "critical" : "high",
        description: `Anomaly score: ${result.anomaly_score}`,
        anomaly_score: result.anomaly_score,
        fraud_probability: result.fraud_probability,
      });
      await notifyFraudAlert(alert);
    }
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await FraudAlert.find().sort({ createdAt: -1 }).limit(50).populate("land_id", "survey_number district");
    sendSuccess(res, alerts);
  } catch (err) { next(err); }
};

module.exports = { detect, getAlerts };
