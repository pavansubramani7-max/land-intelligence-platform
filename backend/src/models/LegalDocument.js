const mongoose = require("mongoose");

const legalDocumentSchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord" },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filename: { type: String, required: true },
    file_path: { type: String },
    doc_type: { type: String, enum: ["title_deed", "survey_map", "court_order", "mutation", "other"] },
    ocr_text: { type: String },
    extracted_entities: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ["pending", "processed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LegalDocument", legalDocumentSchema);
