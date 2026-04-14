import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_service.dart';
import '../models/user_model.dart';
import '../utils/constants.dart';

class AuthService {
  final _api = ApiService();
  final _storage = const FlutterSecureStorage();

  Future<UserModel> login(String email, String password) async {
    final res = await _api.post('/auth/login', data: {'email': email, 'password': password});
    await _storage.write(key: AppConstants.accessTokenKey, value: res.data['access_token']);
    await _storage.write(key: AppConstants.refreshTokenKey, value: res.data['refresh_token']);
    final meRes = await _api.get('/auth/me');
    return UserModel.fromJson(meRes.data);
  }

  Future<void> sendPhoneOtp(String phone) async {
    await _api.post('/auth/phone/send-otp', data: {'phone': phone});
  }

  Future<UserModel> verifyPhoneOtp(String phone, String otpCode) async {
    final res = await _api.post('/auth/phone/verify-otp',
        data: {'phone': phone, 'otp_code': otpCode});
    await _storage.write(key: AppConstants.accessTokenKey, value: res.data['access_token']);
    await _storage.write(key: AppConstants.refreshTokenKey, value: res.data['refresh_token']);
    final meRes = await _api.get('/auth/me');
    return UserModel.fromJson(meRes.data);
  }

  Future<void> register(String name, String email, String password) async {
    await _api.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
      'role': 'viewer',
    });
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: AppConstants.accessTokenKey);
    return token != null;
  }

  Future<UserModel?> getCurrentUser() async {
    try {
      final res = await _api.get('/auth/me');
      return UserModel.fromJson(res.data);
    } catch (_) {
      return null;
    }
  }
}
