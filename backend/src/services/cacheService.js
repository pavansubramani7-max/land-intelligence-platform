/**
 * @file services/cacheService.js — Redis cache wrapper
 */
const { client } = require("../config/redis");
const logger = require("../utils/logger");

const DEFAULT_TTL = 3600; // 1 hour

/**
 * Get cached value by key.
 */
const get = async (key) => {
  try {
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    logger.warn("Cache get error", e.message);
    return null;
  }
};

/**
 * Set cache value with optional TTL.
 */
const set = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (e) {
    logger.warn("Cache set error", e.message);
  }
};

/**
 * Delete cache key.
 */
const del = async (key) => {
  try {
    await client.del(key);
  } catch (e) {
    logger.warn("Cache del error", e.message);
  }
};

module.exports = { get, set, del };
