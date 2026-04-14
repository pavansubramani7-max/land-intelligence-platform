/**
 * @file controllers/legalController.js
 */
const LegalDocument = require("../models/LegalDocument");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);
    const doc = await LegalDocument.create({
      land_id: req.params.landId,
      uploaded_by: req.user.id,
      filename: req.file.originalname,
      file_path: req.file.path,
      doc_type: req.body.doc_type || "other",
      status: "pending",
    });
    // In production: trigger OCR pipeline here
    sendSuccess(res, doc, "Document uploaded. OCR processing queued.", 201);
  } catch (err) { next(err); }
};

const getDocuments = async (req, res, next) => {
  try {
    const docs = await LegalDocument.find({ land_id: req.params.landId }).sort({ createdAt: -1 });
    sendSuccess(res, docs);
  } catch (err) { next(err); }
};

module.exports = { uploadDocument, getDocuments };
