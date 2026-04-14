/**
 * @file services/notificationService.js — In-app and push notifications
 */
const logger = require("../utils/logger");

/**
 * Send a fraud alert notification to admin users.
 */
const notifyFraudAlert = async (alert) => {
  // In production: integrate with WebSocket or push notification service
  logger.info("FRAUD ALERT NOTIFICATION", { alert_type: alert.alert_type, land_id: alert.land_id });
};

/**
 * Send valuation complete notification.
 */
const notifyValuationComplete = async (userId, result) => {
  logger.info("VALUATION COMPLETE", { userId, price: result.predicted_price });
};

module.exports = { notifyFraudAlert, notifyValuationComplete };
