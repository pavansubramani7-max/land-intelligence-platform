import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // 'phone' | 'otp'
  String _step = 'phone';
  String _countryCode = '+91';
  final _phoneCtrl = TextEditingController();
  final List<TextEditingController> _otpCtrls =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _otpFocus = List.generate(6, (_) => FocusNode());
  bool _isLoading = false;
  String? _error;
  int _resendTimer = 0;

  static const _countryCodes = ['+91', '+1', '+44', '+971', '+65'];

  String get _fullPhone => '$_countryCode${_phoneCtrl.text.trim()}';

  @override
  void dispose() {
    _phoneCtrl.dispose();
    for (final c in _otpCtrls) c.dispose();
    for (final f in _otpFocus) f.dispose();
    super.dispose();
  }

  void _startResendTimer() {
    setState(() => _resendTimer = 30);
    Future.doWhile(() async {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => _resendTimer--);
      return _resendTimer > 0;
    });
  }

  Future<void> _sendOtp() async {
    if (_phoneCtrl.text.trim().length < 7) {
      setState(() => _error = 'Enter a valid phone number');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      await AuthService().sendPhoneOtp(_fullPhone);
      setState(() { _step = 'otp'; });
      _startResendTimer();
      Future.delayed(const Duration(milliseconds: 100),
          () => _otpFocus[0].requestFocus());
    } catch (e) {
      setState(() => _error = 'Failed to send OTP. Try again.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOtp() async {
    final code = _otpCtrls.map((c) => c.text).join();
    if (code.length < 6) {
      setState(() => _error = 'Enter the 6-digit OTP');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      await AuthService().verifyPhoneOtp(_fullPhone, code);
      if (mounted) Navigator.pushReplacementNamed(context, '/home');
    } catch (e) {
      setState(() => _error = 'Invalid OTP. Please try again.');
      for (final c in _otpCtrls) c.clear();
      if (mounted) _otpFocus[0].requestFocus();
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _onOtpChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _otpFocus[index + 1].requestFocus();
    }
    final code = _otpCtrls.map((c) => c.text).join();
    if (code.length == 6) _verifyOtp();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1A1A2E),
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F3460)],
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    children: [
                      Container(
                        width: 40, height: 40,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Center(
                          child: Text('LI', style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Text('Land IQ', style: TextStyle(
                        color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                // Hero text
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 16),
                        Text('AI-Powered', style: TextStyle(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.9),
                          fontSize: 13, letterSpacing: 2, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 8),
                        const Text('Intelligent Land\nValuation &\nAnalytics',
                          style: TextStyle(color: Colors.white, fontSize: 32,
                            fontWeight: FontWeight.w900, height: 1.2)),
                        const SizedBox(height: 16),
                        Text('Predict values, detect fraud,\nassess risk — all powered by AI.',
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 14, height: 1.5)),
                        const Spacer(),
                        // Stats row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _statItem('10K+', 'Properties'),
                            _statItem('₹500Cr+', 'Value'),
                            _statItem('99%', 'Accuracy'),
                          ],
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
                // Bottom sheet
                Container(
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                  ),
                  padding: const EdgeInsets.fromLTRB(24, 28, 24, 32),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _step == 'phone' ? _buildPhoneStep() : _buildOtpStep(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _statItem(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(
          color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(
          color: Colors.white.withValues(alpha: 0.5), fontSize: 11)),
      ],
    );
  }

  Widget _buildPhoneStep() {
    return Column(
      key: const ValueKey('phone'),
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('Welcome to Land IQ',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
        const SizedBox(height: 4),
        Text('Sign in or create your account',
          style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
        const SizedBox(height: 20),
        Row(
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade200),
                borderRadius: BorderRadius.circular(12),
                color: Colors.grey.shade50,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _countryCode,
                  items: _countryCodes.map((c) => DropdownMenuItem(
                    value: c, child: Text(c, style: const TextStyle(fontSize: 14)))).toList(),
                  onChanged: (v) => setState(() => _countryCode = v!),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                autofocus: true,
                decoration: InputDecoration(
                  hintText: 'Mobile number',
                  filled: true,
                  fillColor: Colors.grey.shade50,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                ),
                onSubmitted: (_) => _sendOtp(),
              ),
            ),
          ],
        ),
        if (_error != null) ...[
          const SizedBox(height: 8),
          Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 12)),
        ],
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _sendOtp,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
            child: _isLoading
                ? const SizedBox(width: 20, height: 20,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Send OTP →', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          ),
        ),
        const SizedBox(height: 12),
        Center(
          child: Text('By continuing, you agree to our Terms & Privacy Policy',
            style: TextStyle(fontSize: 11, color: Colors.grey.shade400),
            textAlign: TextAlign.center),
        ),
      ],
    );
  }

  Widget _buildOtpStep() {
    return Column(
      key: const ValueKey('otp'),
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('Verify OTP',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
        const SizedBox(height: 4),
        Text('Sent to $_countryCode ${_phoneCtrl.text}',
          style: TextStyle(fontSize: 13, color: Colors.grey.shade500)),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(6, (i) => SizedBox(
            width: 44, height: 52,
            child: TextField(
              controller: _otpCtrls[i],
              focusNode: _otpFocus[i],
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              maxLength: 1,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              decoration: InputDecoration(
                counterText: '',
                filled: true,
                fillColor: _otpCtrls[i].text.isNotEmpty
                    ? const Color(0xFFFEF3C7) : Colors.grey.shade50,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: _otpCtrls[i].text.isNotEmpty
                        ? const Color(0xFFF59E0B) : Colors.grey.shade200, width: 2),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade200, width: 2),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 2),
                ),
                contentPadding: EdgeInsets.zero,
              ),
              onChanged: (v) {
                setState(() {});
                _onOtpChanged(i, v);
                if (v.isEmpty && i > 0) _otpFocus[i - 1].requestFocus();
              },
            ),
          )),
        ),
        if (_error != null) ...[
          const SizedBox(height: 8),
          Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 12),
            textAlign: TextAlign.center),
        ],
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            onPressed: _isLoading ? null : _verifyOtp,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF59E0B),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
            child: _isLoading
                ? const SizedBox(width: 20, height: 20,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Verify & Continue →',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            TextButton(
              onPressed: () => setState(() { _step = 'phone'; _error = null; }),
              child: const Text('← Change number',
                style: TextStyle(fontSize: 12, color: Colors.grey)),
            ),
            _resendTimer > 0
                ? Text('Resend in ${_resendTimer}s',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade400))
                : TextButton(
                    onPressed: _sendOtp,
                    child: const Text('Resend OTP',
                      style: TextStyle(fontSize: 12, color: Color(0xFFF59E0B),
                        fontWeight: FontWeight.w600)),
                  ),
          ],
        ),
      ],
    );
  }
}
