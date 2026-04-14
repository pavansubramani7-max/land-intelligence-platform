const router = require("express").Router();
const { getStats, getAllUsers, updateUserRole } = require("../controllers/adminController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(authenticate, requireRole("admin"));
router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);

module.exports = router;
