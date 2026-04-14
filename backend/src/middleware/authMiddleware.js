/**
 * @file middleware/authMiddleware.js — JWT verification
 */
const { verifyToken } = require("../config/jwt");
const { sendError } = require("../utils/apiResponse");

/**
 * Verify JWT from Authorization header and attach user to req.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, "No token provided", 401);
  }
  try {
    const token = header.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return sendError(res, "Invalid or expired token", 401);
  }
};

module.exports = { authenticate };
