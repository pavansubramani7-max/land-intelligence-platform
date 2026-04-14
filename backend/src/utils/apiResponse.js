/**
 * @file utils/apiResponse.js — Standardized response helpers
 */

/** Send a success response */
const sendSuccess = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

/** Send an error response */
const sendError = (res, message = "Error", status = 400) =>
  res.status(status).json({ success: false, message });

module.exports = { sendSuccess, sendError };
