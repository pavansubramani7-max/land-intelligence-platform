const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "analyst").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const valuationSchema = Joi.object({
  survey_number: Joi.string().required(),
  area_sqft: Joi.number().positive().required(),
  land_type: Joi.string().valid("agricultural", "residential", "commercial", "industrial").required(),
  zone: Joi.string().valid("A", "B", "C", "D").required(),
  infrastructure_score: Joi.number().min(1).max(10).required(),
  near_water: Joi.boolean().default(false),
  near_highway: Joi.boolean().default(false),
  road_access: Joi.boolean().default(true),
  district: Joi.string().required(),
  location: Joi.object({ lat: Joi.number(), lng: Joi.number() }).optional(),
});

module.exports = { registerSchema, loginSchema, valuationSchema };
