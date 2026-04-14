class AppConstants {
  // Android emulator: 10.0.2.2, iOS simulator: 127.0.0.1, physical device: your machine's LAN IP
  static const String baseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'http://10.0.2.2:8000');
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
}
