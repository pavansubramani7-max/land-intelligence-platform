const mongoose = require("mongoose");

const ownershipHistorySchema = new mongoose.Schema(
  {
    land_id: { type: mongoose.Schema.Types.ObjectId, ref: "LandRecord", required: true },
    previous_owner: { type: String },
    new_owner: { type: String },
    transfer_date: { type: Date },
    transfer_price: { type: Number },
    transfer_type: { type: String, enum: ["sale", "inheritance", "gift", "court_order"] },
    document_ref: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnershipHistory", ownershipHistorySchema);
