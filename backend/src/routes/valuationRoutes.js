const router = require("express").Router();
const { predict, getHistory } = require("../controllers/valuationController");
const { authenticate } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateRequest");
const { valuationSchema } = require("../utils/validators");
const { auditLogger } = require("../middleware/auditLogger");

router.post("/predict", authenticate, auditLogger, validate(valuationSchema), predict);
router.get("/history", authenticate, getHistory);

module.exports = router;
