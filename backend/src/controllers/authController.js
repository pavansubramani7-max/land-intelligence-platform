/**
 * @file controllers/authController.js — Auth: register, login, OTP, refresh
 */
const crypto = require("crypto");
const User = require("../models/User");
const { signToken } = require("../config/jwt");
const { sendOTPEmail } = require("../services/emailService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/** Generate a 6-digit OTP */
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return sendError(res, "Email already registered", 409);

    const otp = generateOTP();
    const user = await User.create({
      name, email, password, role,
      otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOTPEmail(email, otp).catch(() => {});
    sendSuccess(res, { id: user._id, email }, "Registered. Check email for OTP.", 201);
  } catch (err) { next(err); }
};

/**
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, "User not found", 404);
    if (user.otp !== otp || user.otpExpiry < new Date()) return sendError(res, "Invalid or expired OTP", 400);

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    sendSuccess(res, null, "Email verified successfully");
  } catch (err) { next(err); }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return sendError(res, "Invalid credentials", 401);
    if (!user.isVerified) return sendError(res, "Please verify your email first", 403);

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id, role: user.role, email: user.email });
    const refreshToken = signToken({ id: user._id, type: "refresh" });
    sendSuccess(res, { token, refreshToken, user: user.toSafeObject() }, "Login successful");
  } catch (err) { next(err); }
};

/**
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: rt } = req.body;
    if (!rt) return sendError(res, "Refresh token required", 400);
    const { verifyToken } = require("../config/jwt");
    const payload = verifyToken(rt);
    if (payload.type !== "refresh") return sendError(res, "Invalid refresh token", 401);
    const user = await User.findById(payload.id);
    if (!user) return sendError(res, "User not found", 404);
    const token = signToken({ id: user._id, role: user.role, email: user.email });
    sendSuccess(res, { token }, "Token refreshed");
  } catch (err) { next(err); }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");
    sendSuccess(res, user);
  } catch (err) { next(err); }
};

module.exports = { register, verifyOTP, login, refreshToken, getMe };
