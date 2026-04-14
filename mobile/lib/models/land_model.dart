class LandModel {
  final int id;
  final String title;
  final String location;
  final double? latitude;
  final double? longitude;
  final double areaSqft;
  final String zoneType;
  final double roadProximityKm;
  final double infrastructureScore;
  final double marketPrice;
  final bool floodRisk;

  LandModel({
    required this.id,
    required this.title,
    required this.location,
    this.latitude,
    this.longitude,
    required this.areaSqft,
    required this.zoneType,
    required this.roadProximityKm,
    required this.infrastructureScore,
    required this.marketPrice,
    required this.floodRisk,
  });

  factory LandModel.fromJson(Map<String, dynamic> json) => LandModel(
    id: json['id'],
    title: json['title'],
    location: json['location'],
    latitude: json['latitude']?.toDouble(),
    longitude: json['longitude']?.toDouble(),
    areaSqft: json['area_sqft'].toDouble(),
    zoneType: json['zone_type'],
    roadProximityKm: json['road_proximity_km'].toDouble(),
    infrastructureScore: json['infrastructure_score'].toDouble(),
    marketPrice: json['market_price'].toDouble(),
    floodRisk: json['flood_risk'] ?? false,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'location': location,
    'latitude': latitude,
    'longitude': longitude,
    'area_sqft': areaSqft,
    'zone_type': zoneType,
    'road_proximity_km': roadProximityKm,
    'infrastructure_score': infrastructureScore,
    'market_price': marketPrice,
    'flood_risk': floodRisk,
  };
}
