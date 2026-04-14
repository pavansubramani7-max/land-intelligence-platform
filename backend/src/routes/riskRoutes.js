const router = require("express").Router();
const { assessRisk, getRiskHistory } = require("../controllers/riskController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/assess", authenticate, assessRisk);
router.get("/:landId/history", authenticate, getRiskHistory);

module.exports = router;
