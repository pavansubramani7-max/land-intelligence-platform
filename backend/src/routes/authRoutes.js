const router = require("express").Router();
const { register, login, verifyOTP, refreshToken, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateRequest");
const { registerSchema, loginSchema } = require("../utils/validators");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/verify-otp", verifyOTP);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, getMe);

module.exports = router;
