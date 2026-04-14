import 'package:flutter/material.dart';
import '../services/valuation_service.dart';
import '../services/location_service.dart';
import '../utils/validators.dart';
import '../widgets/investment_badge.dart';

class ValuationScreen extends StatefulWidget {
  const ValuationScreen({super.key});

  @override
  State<ValuationScreen> createState() => _ValuationScreenState();
}

class _ValuationScreenState extends State<ValuationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _areaCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _locationScoreCtrl = TextEditingController(text: '70');
  final _roadCtrl = TextEditingController(text: '2.0');
  final _infraCtrl = TextEditingController(text: '60');
  final _latCtrl = TextEditingController();
  final _lngCtrl = TextEditingController();
  String _zoneType = 'residential';
  bool _floodRisk = false;
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _getLocation() async {
    final pos = await LocationService().getCurrentLocation();
    if (pos != null) {
      setState(() {
        _latCtrl.text = pos.latitude.toStringAsFixed(6);
        _lngCtrl.text = pos.longitude.toStringAsFixed(6);
      });
    }
  }

  Future<void> _predict() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _result = null; });
    try {
      final data = {
        'land_id': 1,
        'area_sqft': double.parse(_areaCtrl.text),
        'market_price': double.parse(_priceCtrl.text),
        'location_score': double.parse(_locationScoreCtrl.text),
        'zone_type': _zoneType,
        'road_proximity_km': double.parse(_roadCtrl.text),
        'infrastructure_score': double.parse(_infraCtrl.text),
        'flood_risk': _floodRisk,
        'ownership_changes': 0,
        'litigation_count': 0,
      };
      final res = await ValuationService().predict(data);
      setState(() { _result = res; });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Land Valuation')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(child: TextFormField(
                        controller: _latCtrl,
                        decoration: const InputDecoration(labelText: 'Latitude'),
                        keyboardType: TextInputType.number,
                      )),
                      const SizedBox(width: 8),
                      Expanded(child: TextFormField(
                        controller: _lngCtrl,
                        decoration: const InputDecoration(labelText: 'Longitude'),
                        keyboardType: TextInputType.number,
                      )),
                      IconButton(icon: const Icon(Icons.my_location, color: Color(0xFF2563EB)), onPressed: _getLocation),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _areaCtrl,
                    decoration: const InputDecoration(labelText: 'Area (sqft)'),
                    keyboardType: TextInputType.number,
                    validator: Validators.positiveNumber,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _priceCtrl,
                    decoration: const InputDecoration(labelText: 'Market Price (₹)'),
                    keyboardType: TextInputType.number,
                    validator: Validators.positiveNumber,
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _zoneType,
                    decoration: const InputDecoration(labelText: 'Zone Type'),
                    items: ['residential', 'commercial', 'agricultural', 'industrial']
                        .map((z) => DropdownMenuItem(value: z, child: Text(z.toUpperCase())))
                        .toList(),
                    onChanged: (v) => setState(() { _zoneType = v!; }),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: TextFormField(
                        controller: _infraCtrl,
                        decoration: const InputDecoration(labelText: 'Infrastructure Score'),
                        keyboardType: TextInputType.number,
                        validator: Validators.score,
                      )),
                      const SizedBox(width: 8),
                      Expanded(child: TextFormField(
                        controller: _roadCtrl,
                        decoration: const InputDecoration(labelText: 'Road Proximity (km)'),
                        keyboardType: TextInputType.number,
                      )),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SwitchListTile(
                    title: const Text('Flood Risk Zone'),
                    value: _floodRisk,
                    onChanged: (v) => setState(() { _floodRisk = v; }),
                    contentPadding: EdgeInsets.zero,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _predict,
                      child: _isLoading
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Run Valuation'),
                    ),
                  ),
                ],
              ),
            ),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text('Estimated Value', style: TextStyle(color: Colors.grey)),
                      Text(
                        '₹${(_result!['estimated_value'] as num).toStringAsFixed(0)}',
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF2563EB)),
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: (_result!['confidence_score'] as num).toDouble(),
                        backgroundColor: Colors.grey.shade200,
                        color: Colors.green,
                      ),
                      const SizedBox(height: 4),
                      Text('Confidence: ${((_result!['confidence_score'] as num) * 100).toStringAsFixed(1)}%',
                          style: const TextStyle(fontSize: 12, color: Colors.grey)),
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
