/**
 * @file middleware/roleMiddleware.js — Role-based access control
 */
const { sendError } = require("../utils/apiResponse");

/**
 * Restrict route to specific roles.
 * @param {...string} roles - Allowed roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, "Insufficient permissions", 403);
  }
  next();
};

module.exports = { requireRole };
