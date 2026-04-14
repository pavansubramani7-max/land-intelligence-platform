const router = require("express").Router();
const { detect, getAlerts } = require("../controllers/fraudController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.post("/detect", authenticate, detect);
router.get("/alerts", authenticate, requireRole("admin", "analyst"), getAlerts);

module.exports = router;
