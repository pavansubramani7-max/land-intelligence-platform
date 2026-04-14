import 'package:flutter/material.dart';
import '../services/valuation_service.dart';

class ForecastScreen extends StatefulWidget {
  const ForecastScreen({super.key});
  @override
  State<ForecastScreen> createState() => _ForecastScreenState();
}

class _ForecastScreenState extends State<ForecastScreen> {
  final _priceCtrl = TextEditingController();
  final _areaCtrl = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _forecast() async {
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
      final res = await ValuationService().getForecast(data);
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
      appBar: AppBar(title: const Text('Price Forecast')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextFormField(controller: _areaCtrl, decoration: const InputDecoration(labelText: 'Area (sqft)'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _priceCtrl, decoration: const InputDecoration(labelText: 'Current Market Price'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _forecast, child: const Text('Get Forecast'))),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Row(
                children: [
                  _ForecastCard(label: 'Current', value: _result!['current_value'], growth: null),
                  const SizedBox(width: 8),
                  _ForecastCard(label: '1 Year', value: _result!['forecast_1yr'], growth: _result!['growth_rate_1yr']),
                  const SizedBox(width: 8),
                  _ForecastCard(label: '3 Years', value: _result!['forecast_3yr'], growth: _result!['growth_rate_3yr']),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ForecastCard extends StatelessWidget {
  final String label;
  final dynamic value;
  final dynamic growth;
  const _ForecastCard({required this.label, required this.value, required this.growth});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 4),
              Text('₹${((value as num) / 1000).toStringAsFixed(0)}K',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              if (growth != null)
                Text('${(growth as num) >= 0 ? '+' : ''}${(growth as num).toStringAsFixed(1)}%',
                    style: TextStyle(fontSize: 12, color: (growth as num) >= 0 ? Colors.green : Colors.red)),
            ],
          ),
        ),
      ),
    );
  }
}
