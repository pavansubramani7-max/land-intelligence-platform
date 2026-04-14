const router = require("express").Router();
const { forecast } = require("../controllers/forecastController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, forecast);
module.exports = router;
