import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../widgets/stat_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic>? _stats;

  final List<Map<String, dynamic>> _menuItems = [
    {'icon': Icons.trending_up, 'label': 'Valuation', 'route': '/valuation'},
    {'icon': Icons.warning_amber, 'label': 'Dispute', 'route': '/dispute'},
    {'icon': Icons.security, 'label': 'Fraud', 'route': '/fraud'},
    {'icon': Icons.show_chart, 'label': 'Forecast', 'route': '/forecast'},
    {'icon': Icons.map, 'label': 'Geo Map', 'route': '/geo'},
    {'icon': Icons.description, 'label': 'Legal', 'route': '/legal'},
    {'icon': Icons.star, 'label': 'Recommend', 'route': '/recommendation'},
    {'icon': Icons.download, 'label': 'Reports', 'route': '/report'},
  ];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final res = await ApiService().get('/admin/stats');
      if (mounted) setState(() => _stats = res.data);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Land Intelligence'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await AuthService().logout();
              if (mounted) Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Dashboard', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
              children: [
                StatCard(title: 'Valuations', value: '${_stats?['valuation_predictions'] ?? '—'}', icon: Icons.trending_up, color: Colors.blue),
                StatCard(title: 'Fraud Alerts', value: '${_stats?['fraud_detections'] ?? '—'}', icon: Icons.security, color: Colors.red),
                StatCard(title: 'Disputes', value: '${_stats?['dispute_assessments'] ?? '—'}', icon: Icons.warning_amber, color: Colors.orange),
                StatCard(title: 'Land Records', value: '${_stats?['total_land_records'] ?? '—'}', icon: Icons.map, color: Colors.green),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4, crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 0.9,
              ),
              itemCount: _menuItems.length,
              itemBuilder: (ctx, i) {
                final item = _menuItems[i];
                return GestureDetector(
                  onTap: () => Navigator.pushNamed(context, item['route']),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(item['icon'] as IconData, color: const Color(0xFF2563EB), size: 28),
                        const SizedBox(height: 6),
                        Text(item['label'] as String, style: const TextStyle(fontSize: 11), textAlign: TextAlign.center),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
