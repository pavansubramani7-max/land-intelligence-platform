/**
 * @file app.js — Express app with middleware and routes
 */
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
app.use("/api", limiter);

app.use("/api", routes);
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use(errorHandler);

module.exports = app;
