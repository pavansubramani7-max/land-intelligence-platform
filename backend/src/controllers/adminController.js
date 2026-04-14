/**
 * @file controllers/adminController.js
 */
const User = require("../models/User");
const LandRecord = require("../models/LandRecord");
const ValuationResult = require("../models/ValuationResult");
const FraudAlert = require("../models/FraudAlert");
const { sendSuccess } = require("../utils/apiResponse");

const getStats = async (req, res, next) => {
  try {
    const [users, lands, valuations, fraudAlerts] = await Promise.all([
      User.countDocuments(),
      LandRecord.countDocuments(),
      ValuationResult.countDocuments(),
      FraudAlert.countDocuments({ status: "open" }),
    ]);
    sendSuccess(res, { users, lands, valuations, open_fraud_alerts: fraudAlerts });
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -otp").sort({ createdAt: -1 }).limit(100);
    sendSuccess(res, users);
  } catch (err) { next(err); }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { role: req.body.role }, { new: true }).select("-password");
    sendSuccess(res, user, "Role updated");
  } catch (err) { next(err); }
};

module.exports = { getStats, getAllUsers, updateUserRole };
