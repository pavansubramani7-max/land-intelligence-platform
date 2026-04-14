/**
 * @file middleware/validateRequest.js — Joi schema validation
 */
const { sendError } = require("../utils/apiResponse");

/**
 * Validate req.body against a Joi schema.
 * @param {import('joi').Schema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return sendError(res, messages, 422);
  }
  next();
};

module.exports = { validate };
