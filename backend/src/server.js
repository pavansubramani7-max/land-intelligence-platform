/**
 * @file server.js — Express server entry point
 */
require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
