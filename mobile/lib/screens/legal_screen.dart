import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';

class LegalScreen extends StatefulWidget {
  const LegalScreen({super.key});
  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  final _landIdCtrl = TextEditingController(text: '1');
  bool _isLoading = false;
  Map<String, dynamic>? _result;

  Future<void> _pickAndUpload(ImageSource source) async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: source);
    if (file == null) return;
    if (!mounted) return;

    setState(() { _isLoading = true; });
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(file.path, filename: file.name),
      });
      final res = await ApiService().postFormData('/legal/upload/${_landIdCtrl.text}', formData);
      if (mounted) setState(() { _result = res.data; });
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Upload failed: $e')));
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Legal Document Analysis')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextFormField(controller: _landIdCtrl, decoration: const InputDecoration(labelText: 'Land ID'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: ElevatedButton.icon(
                  onPressed: _isLoading ? null : () => _pickAndUpload(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Camera'),
                )),
                const SizedBox(width: 8),
                Expanded(child: ElevatedButton.icon(
                  onPressed: _isLoading ? null : () => _pickAndUpload(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Gallery'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade600),
                )),
              ],
            ),
            if (_isLoading) ...[
              const SizedBox(height: 24),
              const CircularProgressIndicator(),
              const SizedBox(height: 8),
              const Text('Analyzing document...'),
            ],
            if (_result != null) ...[
              const SizedBox(height: 24),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Integrity Score', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('${(_result!['integrity_score'] as num).toStringAsFixed(0)}/100',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: (_result!['integrity_score'] as num) >= 80 ? Colors.green : Colors.orange,
                              )),
                        ],
                      ),
                      if ((_result!['mismatches'] as List).isNotEmpty) ...[
                        const Divider(),
                        const Text('⚠️ Mismatches:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
                        ...(_result!['mismatches'] as List).map((m) => Text('• $m', style: const TextStyle(fontSize: 13))),
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
