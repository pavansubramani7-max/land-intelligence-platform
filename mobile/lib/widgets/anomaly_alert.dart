import 'package:flutter/material.dart';

class AnomalyAlert extends StatelessWidget {
  final bool isAnomaly;
  final double fraudProbability;
  final List<String> flags;

  const AnomalyAlert({super.key, required this.isAnomaly, required this.fraudProbability, required this.flags});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isAnomaly ? Colors.red.shade50 : Colors.green.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isAnomaly ? Colors.red.shade200 : Colors.green.shade200),
      ),
      child: Column(
        children: [
          Icon(isAnomaly ? Icons.warning : Icons.check_circle,
              color: isAnomaly ? Colors.red : Colors.green, size: 40),
          Text(isAnomaly ? 'ANOMALY DETECTED' : 'CLEAN',
              style: TextStyle(fontWeight: FontWeight.bold, color: isAnomaly ? Colors.red : Colors.green)),
          Text('${(fraudProbability * 100).toStringAsFixed(1)}% fraud probability'),
          ...flags.map((f) => Text('• $f', style: const TextStyle(fontSize: 12))),
        ],
      ),
    );
  }
}
