/**
 * @file services/pdfService.js — PDF report generation with pdfkit
 */
const PDFDocument = require("pdfkit");

/**
 * Generate a land valuation PDF report.
 * @param {object} data - Report data
 * @returns {Buffer} PDF buffer
 */
const generateValuationPDF = (data) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(22).font("Helvetica-Bold").text("Land Intelligence Platform", { align: "center" });
    doc.fontSize(16).text("Valuation & Risk Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).font("Helvetica").text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Land Details
    doc.fontSize(14).font("Helvetica-Bold").text("Land Details");
    doc.fontSize(11).font("Helvetica");
    doc.text(`Survey Number: ${data.survey_number || "N/A"}`);
    doc.text(`District: ${data.district || "N/A"}`);
    doc.text(`Area: ${data.area_sqft?.toLocaleString() || "N/A"} sq.ft`);
    doc.text(`Land Type: ${data.land_type || "N/A"}`);
    doc.text(`Zone: ${data.zone || "N/A"}`);
    doc.moveDown();

    // Valuation
    doc.fontSize(14).font("Helvetica-Bold").text("Valuation Result");
    doc.fontSize(11).font("Helvetica");
    doc.text(`Predicted Price: ₹${data.predicted_price?.toLocaleString() || "N/A"}`);
    doc.text(`Confidence Score: ${((data.confidence_score || 0) * 100).toFixed(1)}%`);
    doc.text(`Model Used: ${data.model_used || "Ensemble"}`);
    doc.moveDown();

    // Risk
    if (data.risk_score !== undefined) {
      doc.fontSize(14).font("Helvetica-Bold").text("Risk Assessment");
      doc.fontSize(11).font("Helvetica");
      doc.text(`Dispute Risk Score: ${data.risk_score}`);
      doc.text(`Risk Category: ${data.risk_category || "N/A"}`);
      doc.moveDown();
    }

    // Recommendation
    if (data.recommendation) {
      doc.fontSize(14).font("Helvetica-Bold").text("Investment Recommendation");
      doc.fontSize(11).font("Helvetica");
      doc.text(`Action: ${data.recommendation}`);
      doc.moveDown();
    }

    doc.fontSize(9).fillColor("gray").text("Disclaimer: This report is for informational purposes only.", { align: "center" });
    doc.end();
  });

module.exports = { generateValuationPDF };
