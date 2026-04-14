import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/valuation_screen.dart';
import 'screens/dispute_screen.dart';
import 'screens/fraud_screen.dart';
import 'screens/forecast_screen.dart';
import 'screens/geo_screen.dart';
import 'screens/legal_screen.dart';
import 'screens/recommendation_screen.dart';
import 'screens/report_screen.dart';

class LandIntelligenceApp extends StatelessWidget {
  const LandIntelligenceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Land Intelligence',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E3A8A),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF2563EB),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
      initialRoute: '/splash',
      routes: {
        '/splash': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),
        '/valuation': (_) => const ValuationScreen(),
        '/dispute': (_) => const DisputeScreen(),
        '/fraud': (_) => const FraudScreen(),
        '/forecast': (_) => const ForecastScreen(),
        '/geo': (_) => const GeoScreen(),
        '/legal': (_) => const LegalScreen(),
        '/recommendation': (_) => const RecommendationScreen(),
        '/report': (_) => const ReportScreen(),
      },
    );
  }
}
