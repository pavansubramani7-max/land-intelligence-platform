/**
 * @file services/aiService.js — HTTP client for Python AI engine
 */
const axios = require("axios");
const logger = require("../utils/logger");

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const aiClient = axios.create({ baseURL: AI_URL, timeout: 30000 });

/**
 * Call valuation prediction endpoint.
 * @param {object} features - Land features
 */
const predictValuation = async (features) => {
  const { data } = await aiClient.post("/api/v1/valuation/predict", features);
  return data;
};

/**
 * Call dispute risk prediction endpoint.
 */
const predictDispute = async (features) => {
  const { data } = await aiClient.post("/api/v1/dispute/predict", features);
  return data;
};

/**
 * Call fraud detection endpoint.
 */
const detectFraud = async (features) => {
  const { data } = await aiClient.post("/api/v1/fraud/detect", features);
  return data;
};

/**
 * Call price forecast endpoint.
 */
const predictForecast = async (payload) => {
  const { data } = await aiClient.post("/api/v1/forecast/predict", payload);
  return data;
};

/**
 * Call recommendation endpoint.
 */
const getRecommendation = async (payload) => {
  const { data } = await aiClient.post("/api/v1/recommendation", payload);
  return data;
};

module.exports = { predictValuation, predictDispute, detectFraud, predictForecast, getRecommendation };
