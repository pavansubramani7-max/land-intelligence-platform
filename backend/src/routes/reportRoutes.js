const router = require("express").Router();
const { downloadPDF } = require("../controllers/reportController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/pdf/:valuationId", authenticate, downloadPDF);

module.exports = router;
