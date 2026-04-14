/**
 * @file middleware/auditLogger.js — Log all mutating requests
 */
const logger = require("../utils/logger");

const auditLogger = (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    logger.info("AUDIT", {
      method: req.method,
      path: req.path,
      user: req.user?.id || "anonymous",
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

module.exports = { auditLogger };
