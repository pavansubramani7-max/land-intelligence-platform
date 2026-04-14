/**
 * @file config/db.js — MongoDB connection with retry
 */
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

/**
 * Connect to MongoDB with exponential retry.
 */
async function connectDB(retries = MAX_RETRIES) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("MongoDB connected");

    mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
    mongoose.connection.on("error", (err) => logger.error("MongoDB error", err));
  } catch (err) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY}ms... (${retries} left)`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return connectDB(retries - 1);
    }
    logger.error("MongoDB connection exhausted", err);
    throw err;
  }
}

module.exports = { connectDB };
