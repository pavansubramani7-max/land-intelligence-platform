import 'api_service.dart';
import '../models/prediction_model.dart';

class ValuationService {
  final _api = ApiService();

  Future<Map<String, dynamic>> predict(Map<String, dynamic> data) async {
    final res = await _api.post('/valuation/predict', data: data);
    return res.data;
  }

  Future<Map<String, dynamic>> getDispute(Map<String, dynamic> data) async {
    final res = await _api.post('/dispute/predict', data: data);
    return res.data;
  }

  Future<Map<String, dynamic>> detectFraud(Map<String, dynamic> data) async {
    final res = await _api.post('/fraud/detect', data: data);
    return res.data;
  }

  Future<Map<String, dynamic>> getForecast(Map<String, dynamic> data) async {
    final res = await _api.post('/forecast/', data: data);
    return res.data;
  }

  Future<Map<String, dynamic>> getRecommendation(Map<String, dynamic> data) async {
    final res = await _api.post('/recommend/', data: data);
    return res.data;
  }
}
