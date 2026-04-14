import 'package:flutter/material.dart';

class ForecastChart extends StatelessWidget {
  final List<Map<String, dynamic>> data;
  const ForecastChart({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const SizedBox.shrink();
    final values = data.map((d) => (d['value'] as num).toDouble()).toList();
    final maxVal = values.reduce((a, b) => a > b ? a : b);
    final minVal = values.reduce((a, b) => a < b ? a : b);

    return SizedBox(
      height: 150,
      child: CustomPaint(
        painter: _ChartPainter(values: values, maxVal: maxVal, minVal: minVal),
        size: Size.infinite,
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<double> values;
  final double maxVal;
  final double minVal;

  _ChartPainter({required this.values, required this.maxVal, required this.minVal});

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;
    final paint = Paint()
      ..color = const Color(0xFF2563EB)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();
    for (int i = 0; i < values.length; i++) {
      final x = i / (values.length - 1) * size.width;
      final y = size.height - (values[i] - minVal) / (maxVal - minVal + 1) * size.height;
      if (i == 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_ChartPainter old) => old.values != values;
}
