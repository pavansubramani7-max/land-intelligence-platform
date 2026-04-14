/**
 * @file config/redis.js — Redis client
 */
const { createClient } = require("redis");
const logger = require("../utils/logger");

const client = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });

client.on("error", (err) => logger.error("Redis error", err));
client.on("connect", () => logger.info("Redis connected"));

async function connectRedis() {
  await client.connect();
}

module.exports = { client, connectRedis };
