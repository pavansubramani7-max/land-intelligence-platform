import 'package:flutter/material.dart';
import '../services/valuation_service.dart';

class DisputeScreen extends StatefulWidget {
  const DisputeScreen({super.key});
  @override
  State<DisputeScreen> createState() => _DisputeScreenState();
}

class _DisputeScreenState extends State<DisputeScreen> {
  final _ownershipCtrl = TextEditingController(text: '0');
  final _litigationCtrl = TextEditingController(text: '0');
  final _priceCtrl = TextEditingController();
  final _areaCtrl = TextEditingController();
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _predict() async {
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
        'ownership_changes': int.tryParse(_ownershipCtrl.text) ?? 0,
        'litigation_count': int.tryParse(_litigationCtrl.text) ?? 0,
      };
      final res = await ValuationService().getDispute(data);
      setState(() { _result = res; });
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final riskColor = _result == null ? Colors.grey
        : _result!['dispute_risk_label'] == 'low' ? Colors.green
        : _result!['dispute_risk_label'] == 'medium' ? Colors.orange
        : Colors.red;

    return Scaffold(
      appBar: AppBar(title: const Text('Dispute Risk')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextFormField(controller: _areaCtrl, decoration: const InputDecoration(labelText: 'Area (sqft)'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _priceCtrl, decoration: const InputDecoration(labelText: 'Market Price'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _ownershipCtrl, decoration: const InputDecoration(labelText: 'Ownership Changes'), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextFormField(controller: _litigationCtrl, decoration: const InputDecoration(labelText: 'Litigation Count'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _isLoading ? null : _predict, child: const Text('Assess Dispute Risk'))),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Text(_result!['dispute_risk_label'].toString().toUpperCase(),
                          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: riskColor)),
                      Text('Score: ${((_result!['dispute_risk_score'] as num) * 100).toStringAsFixed(1)}%'),
                      if ((_result!['risk_factors'] as List).isNotEmpty) ...[
                        const Divider(),
                        ...(_result!['risk_factors'] as List).map((f) => ListTile(
                          leading: const Icon(Icons.warning, color: Colors.orange, size: 18),
                          title: Text(f.toString(), style: const TextStyle(fontSize: 13)),
                          dense: true,
                        )),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
