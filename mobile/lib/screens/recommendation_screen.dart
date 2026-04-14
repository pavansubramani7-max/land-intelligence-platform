import 'package:flutter/material.dart';
import '../services/valuation_service.dart';
import '../widgets/investment_badge.dart';

class RecommendationScreen extends StatefulWidget {
  const RecommendationScreen({super.key});
  @override
  State<RecommendationScreen> createState() => _RecommendationScreenState();
}

class _RecommendationScreenState extends State<RecommendationScreen> {
  final _areaCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _getRecommendation() async {
    setState(() { _isLoading = true; });
    try {
      final data = {
        'land_id': 1,
        'area_sqft': double.tryParse(_areaCtrl.text) ?? 1000,
        'market_price': double.tryParse(_priceCtrl.text) ?? 500000,
        'location_score': 70.0,
        'zone_type': 'residential',
        'road_proximity_km': 2.0,
        'infrastructure_score': 60.0,
        'flood_risk': false,
        'ownership_changes': 0,
        'litigation_count': 0,
      };
      final res = await ValuationService().getRecommendation(data);
      setState(() { _result = res; });
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Investment Recommendation')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextFormField(controller: _areaCtrl, decoration: const InputDecoration(labelText: 'Area (sqft)'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _priceCtrl, decoration: const InputDecoration(labelText: 'Market Price'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _getRecommendation, child: const Text('Get Recommendation'))),
            if (_result != null) ...[
              const SizedBox(height: 24),
              InvestmentBadge(recommendation: _result!['recommendation'], score: (_result!['score'] as num).toDouble()),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(_result!['reasoning'] ?? '', style: const TextStyle(fontSize: 14)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
