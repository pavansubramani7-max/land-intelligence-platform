/**
 * @file services/emailService.js — Nodemailer OTP email sender
 */
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

/**
 * Send OTP verification email.
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 */
const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Land Intelligence" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `<h2>Land Intelligence Platform</h2><p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
  });
  logger.info(`OTP email sent to ${to}`);
};

module.exports = { sendOTPEmail };
