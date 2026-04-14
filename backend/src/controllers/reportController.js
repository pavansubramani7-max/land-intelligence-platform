/**
 * @file controllers/reportController.js
 */
const ValuationResult = require("../models/ValuationResult");
const DisputeRecord = require("../models/DisputeRecord");
const { generateValuationPDF } = require("../services/pdfService");
const { sendError } = require("../utils/apiResponse");

const downloadPDF = async (req, res, next) => {
  try {
    const { valuationId } = req.params;
    const valuation = await ValuationResult.findById(valuationId).populate("land_id");
    if (!valuation) return sendError(res, "Valuation not found", 404);

    const dispute = await DisputeRecord.findOne({ land_id: valuation.land_id }).sort({ createdAt: -1 });
    const land = valuation.land_id;

    const pdfBuffer = await generateValuationPDF({
      survey_number: land?.survey_number,
      district: land?.location?.district,
      area_sqft: land?.area_sqft,
      land_type: land?.land_type,
      zone: land?.zone,
      predicted_price: valuation.predicted_price,
      confidence_score: valuation.confidence_score,
      model_used: valuation.model_used,
      risk_score: dispute?.risk_score,
      risk_category: dispute?.risk_category,
      recommendation: valuation.recommendation,
    });

    res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=report-${valuationId}.pdf` });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

module.exports = { downloadPDF };
