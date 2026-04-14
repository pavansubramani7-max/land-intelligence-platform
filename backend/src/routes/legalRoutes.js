const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { uploadDocument, getDocuments } = require("../controllers/legalController");
const { authenticate } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "uploads/legal/",
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/:landId/upload", authenticate, upload.single("document"), uploadDocument);
router.get("/:landId/documents", authenticate, getDocuments);

module.exports = router;
