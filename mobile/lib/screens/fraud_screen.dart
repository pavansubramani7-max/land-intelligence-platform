import 'package:flutter/material.dart';
import '../services/valuation_service.dart';

class FraudScreen extends StatefulWidget {
  const FraudScreen({super.key});
  @override
  State<FraudScreen> createState() => _FraudScreenState();
}

class _FraudScreenState extends State<FraudScreen> {
  final _areaCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _ownershipCtrl = TextEditingController(text: '1');
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _detect() async {
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
        'ownership_changes': int.tryParse(_ownershipCtrl.text) ?? 1,
        'litigation_count': 0,
      };
      final res = await ValuationService().detectFraud(data);
      setState(() { _result = res; });
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isAnomaly = _result?['is_anomaly'] == true;

    return Scaffold(
      appBar: AppBar(title: const Text('Fraud Detection')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextFormField(controller: _areaCtrl, decoration: const InputDecoration(labelText: 'Area (sqft)'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _priceCtrl, decoration: const InputDecoration(labelText: 'Market Price'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _ownershipCtrl, decoration: const InputDecoration(labelText: 'Ownership Changes'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _detect, child: const Text('Detect Fraud'))),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isAnomaly ? Colors.red.shade50 : Colors.green.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isAnomaly ? Colors.red.shade200 : Colors.green.shade200),
                ),
                child: Column(
                  children: [
                    Icon(isAnomaly ? Icons.warning : Icons.check_circle,
                        color: isAnomaly ? Colors.red : Colors.green, size: 48),
                    const SizedBox(height: 8),
                    Text(isAnomaly ? 'ANOMALY DETECTED' : 'NO FRAUD DETECTED',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold,
                            color: isAnomaly ? Colors.red : Colors.green)),
                    Text('Fraud Probability: ${((_result!['fraud_probability'] as num) * 100).toStringAsFixed(1)}%'),
                    if ((_result!['fraud_flags'] as List).isNotEmpty) ...[
                      const Divider(),
                      ...(_result!['fraud_flags'] as List).map((f) => Text('• $f', style: const TextStyle(fontSize: 13))),
                    ],
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
