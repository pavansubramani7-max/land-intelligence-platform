const router = require("express").Router();
const { getOwnershipGraph, addOwnershipRecord } = require("../controllers/ownershipController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/:landId/graph", authenticate, getOwnershipGraph);
router.post("/:landId/record", authenticate, addOwnershipRecord);

module.exports = router;
