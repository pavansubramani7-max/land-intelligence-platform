/**
 * @file routes/index.js — Mount all route modules
 */
const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/valuation", require("./valuationRoutes"));
router.use("/risk", require("./riskRoutes"));
router.use("/fraud", require("./fraudRoutes"));
router.use("/forecast", require("./forecastRoutes"));
router.use("/legal", require("./legalRoutes"));
router.use("/ownership", require("./ownershipRoutes"));
router.use("/geo", require("./geoRoutes"));
router.use("/report", require("./reportRoutes"));
router.use("/admin", require("./adminRoutes"));

module.exports = router;
