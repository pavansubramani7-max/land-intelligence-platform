import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = const FlutterSecureStorage();
  late final Dio _dio = Dio(BaseOptions(
    baseUrl: AppConstants.baseUrl,
    connectTimeout: const Duration(milliseconds: AppConstants.connectTimeout),
    receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
    headers: {'Content-Type': 'application/json'},
  ))..interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) async {
      final token = await _storage.read(key: AppConstants.accessTokenKey);
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      handler.next(options);
    },
    onError: (error, handler) async {
      if (error.response?.statusCode == 401) {
        final refreshToken = await _storage.read(key: AppConstants.refreshTokenKey);
        if (refreshToken != null) {
          try {
            final res = await Dio().post(
              '${AppConstants.baseUrl}/auth/refresh',
              data: {'refresh_token': refreshToken},
            );
            final newToken = res.data['access_token'];
            await _storage.write(key: AppConstants.accessTokenKey, value: newToken);
            error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            final retryRes = await _dio.fetch(error.requestOptions);
            handler.resolve(retryRes);
            return;
          } catch (_) {
            await _storage.deleteAll();
          }
        }
      }
      handler.next(error);
    },
  ));

  Future<Response> get(String path, {Map<String, dynamic>? params}) =>
      _dio.get(path, queryParameters: params);

  Future<Response> post(String path, {dynamic data}) =>
      _dio.post(path, data: data);

  Future<Response> put(String path, {dynamic data}) =>
      _dio.put(path, data: data);

  Future<Response> delete(String path) => _dio.delete(path);

  Future<Response> postFormData(String path, FormData formData) =>
      _dio.post(path, data: formData);
}
