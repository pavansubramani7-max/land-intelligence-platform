const router = require("express").Router();
const { getHeatmapData, getLandsByDistrict } = require("../controllers/geoController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/heatmap", authenticate, getHeatmapData);
router.get("/district/:district", authenticate, getLandsByDistrict);

module.exports = router;
