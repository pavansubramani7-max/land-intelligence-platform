class PredictionModel {
  final int landId;
  final double? estimatedValue;
  final double? confidenceScore;
  final String? disputeRiskLabel;
  final double? disputeRiskScore;
  final bool? isAnomaly;
  final double? fraudProbability;
  final List<String>? fraudFlags;
  final List<String>? riskFactors;

  PredictionModel({
    required this.landId,
    this.estimatedValue,
    this.confidenceScore,
    this.disputeRiskLabel,
    this.disputeRiskScore,
    this.isAnomaly,
    this.fraudProbability,
    this.fraudFlags,
    this.riskFactors,
  });

  factory PredictionModel.fromValuationJson(Map<String, dynamic> json) => PredictionModel(
    landId: json['land_id'],
    estimatedValue: json['estimated_value']?.toDouble(),
    confidenceScore: json['confidence_score']?.toDouble(),
  );

  factory PredictionModel.fromDisputeJson(Map<String, dynamic> json) => PredictionModel(
    landId: json['land_id'],
    disputeRiskLabel: json['dispute_risk_label'],
    disputeRiskScore: json['dispute_risk_score']?.toDouble(),
    riskFactors: List<String>.from(json['risk_factors'] ?? []),
  );

  factory PredictionModel.fromFraudJson(Map<String, dynamic> json) => PredictionModel(
    landId: json['land_id'],
    isAnomaly: json['is_anomaly'],
    fraudProbability: json['fraud_probability']?.toDouble(),
    fraudFlags: List<String>.from(json['fraud_flags'] ?? []),
  );
}
