import 'package:flutter/material.dart';

class RiskGauge extends StatelessWidget {
  final double score;
  final String? label;

  const RiskGauge({super.key, required this.score, this.label});

  @override
  Widget build(BuildContext context) {
    final color = score < 33 ? Colors.green : score < 66 ? Colors.orange : Colors.red;
    return Column(
      children: [
        SizedBox(
          width: 80, height: 40,
          child: CustomPaint(painter: _GaugePainter(score: score, color: color)),
        ),
        Text('${score.toStringAsFixed(0)}%', style: TextStyle(fontWeight: FontWeight.bold, color: color)),
        if (label != null) Text(label!, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }
}

class _GaugePainter extends CustomPainter {
  final double score;
  final Color color;
  _GaugePainter({required this.score, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.stroke..strokeWidth = 8..strokeCap = StrokeCap.round;
    final rect = Rect.fromLTWH(4, 4, size.width - 8, (size.height - 8) * 2);
    paint.color = Colors.grey.shade200;
    canvas.drawArc(rect, 3.14159, 3.14159, false, paint);
    paint.color = color;
    canvas.drawArc(rect, 3.14159, 3.14159 * (score / 100), false, paint);
  }

  @override
  bool shouldRepaint(_GaugePainter old) => old.score != score;
}
