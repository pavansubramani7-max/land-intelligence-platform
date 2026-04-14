/**
 * @file controllers/ownershipController.js
 */
const OwnershipHistory = require("../models/OwnershipHistory");
const { sendSuccess } = require("../utils/apiResponse");

const getOwnershipGraph = async (req, res, next) => {
  try {
    const history = await OwnershipHistory.find({ land_id: req.params.landId }).sort({ transfer_date: 1 });
    const nodes = [...new Set(history.flatMap((h) => [h.previous_owner, h.new_owner].filter(Boolean)))].map((name) => ({ id: name, label: name }));
    const edges = history.map((h) => ({ from: h.previous_owner, to: h.new_owner, label: h.transfer_type, date: h.transfer_date }));
    sendSuccess(res, { nodes, edges, total_transfers: history.length });
  } catch (err) { next(err); }
};

const addOwnershipRecord = async (req, res, next) => {
  try {
    const record = await OwnershipHistory.create({ land_id: req.params.landId, ...req.body });
    sendSuccess(res, record, "Ownership record added", 201);
  } catch (err) { next(err); }
};

module.exports = { getOwnershipGraph, addOwnershipRecord };
