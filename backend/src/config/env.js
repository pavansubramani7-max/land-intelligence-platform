/**
 * @file config/env.js — Validate required env variables
 */
const required = ["MONGODB_URI", "JWT_SECRET", "AI_SERVICE_URL"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: env variable ${key} is not set`);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
