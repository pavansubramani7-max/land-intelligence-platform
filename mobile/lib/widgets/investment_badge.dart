import 'package:flutter/material.dart';

class InvestmentBadge extends StatelessWidget {
  final String recommendation;
  final double score;

  const InvestmentBadge({super.key, required this.recommendation, required this.score});

  @override
  Widget build(BuildContext context) {
    final config = {
      'BUY': {'color': Colors.green, 'icon': Icons.check_circle, 'emoji': '✅'},
      'HOLD': {'color': Colors.orange, 'icon': Icons.pause_circle, 'emoji': '⏸️'},
      'AVOID': {'color': Colors.red, 'icon': Icons.cancel, 'emoji': '🚫'},
    };
    final c = config[recommendation] ?? config['HOLD']!;
    final color = c['color'] as Color;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 2),
      ),
      child: Column(
        children: [
          Text(c['emoji'] as String, style: const TextStyle(fontSize: 48)),
          const SizedBox(height: 8),
          Text(recommendation, style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: color)),
          Text('Score: ${score.toStringAsFixed(1)}/100', style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
