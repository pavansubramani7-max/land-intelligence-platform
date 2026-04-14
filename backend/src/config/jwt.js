/**
 * @file config/jwt.js — JWT sign/verify helpers
 */
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "changeme";
const EXPIRY = process.env.JWT_EXPIRY || "7d";

/** Sign a JWT token */
const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRY });

/** Verify a JWT token */
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };
