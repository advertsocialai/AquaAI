import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  int _step = 0;
  final _mobile = TextEditingController();
  final _otp = TextEditingController();
  final _pw = TextEditingController();
  final _pw2 = TextEditingController();

  static const _labels = ['Mobile', 'OTP', 'New password', 'Done'];

  @override
  void dispose() {
    _mobile.dispose();
    _otp.dispose();
    _pw.dispose();
    _pw2.dispose();
    super.dispose();
  }

  bool get _pwOk =>
      _pw.text.length >= 8 && _pw.text.contains(RegExp(r'[A-Z]')) && _pw.text.contains(RegExp(r'\d'));
  bool get _pwMatch => _pw.text == _pw2.text;

  void _next() {
    if (_step == 0 && _mobile.text.replaceAll(RegExp(r'\D'), '').length != 10) return;
    if (_step == 1 && _otp.text.length != 6) return;
    if (_step == 2 && (!_pwOk || !_pwMatch)) return;
    setState(() => _step = (_step + 1).clamp(0, _labels.length - 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset password')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: List.generate(_labels.length, (i) {
                final done = i < _step, active = i == _step;
                final color = done
                    ? Colors.green
                    : active ? const Color(AppColors.primary) : Colors.grey.shade300;
                return Expanded(
                  child: Row(children: [
                    Container(
                      width: 26, height: 26,
                      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                      child: Center(
                        child: done
                            ? const Icon(Icons.check, color: Colors.white, size: 14)
                            : Text('${i + 1}',
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    if (i < _labels.length - 1)
                      Expanded(child: Container(height: 1, color: color.withOpacity(0.3))),
                  ]),
                );
              }),
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(_labels[_step].toUpperCase(),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            ),
            const SizedBox(height: 16),
            Expanded(child: _body()),
            if (_step < _labels.length - 1)
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: _next,
                  icon: const Icon(Icons.arrow_forward),
                  label: Text(_step == _labels.length - 2 ? 'Reset password' : 'Continue'),
                ),
              )
            else
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.login),
                  label: const Text('Back to sign in'),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _body() {
    switch (_step) {
      case 0:
        return _wrap([
          TextField(
            controller: _mobile,
            keyboardType: TextInputType.phone,
            maxLength: 10,
            decoration: const InputDecoration(
              labelText: 'Mobile number',
              prefixText: '+91 ',
              border: OutlineInputBorder(),
            ),
            onChanged: (_) => setState(() {}),
          ),
        ]);
      case 1:
        return _wrap([
          Text('Code sent to +91 ${_mobile.text}', style: TextStyle(color: Colors.grey.shade700)),
          const SizedBox(height: 12),
          TextField(
            controller: _otp,
            keyboardType: TextInputType.number,
            maxLength: 6,
            decoration: const InputDecoration(labelText: '6-digit code', border: OutlineInputBorder()),
            onChanged: (_) => setState(() {}),
          ),
        ]);
      case 2:
        return _wrap([
          TextField(
            controller: _pw, obscureText: true,
            decoration: const InputDecoration(
                labelText: 'New password (8+ chars, 1 capital, 1 digit)',
                border: OutlineInputBorder()),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _pw2, obscureText: true,
            decoration: const InputDecoration(
                labelText: 'Confirm password', border: OutlineInputBorder()),
            onChanged: (_) => setState(() {}),
          ),
          if (_pw.text.isNotEmpty && !_pwOk)
            const Padding(
              padding: EdgeInsets.only(top: 8),
              child: Text('Needs 8+ chars, 1 capital, 1 digit', style: TextStyle(color: Colors.orange)),
            ),
          if (_pw2.text.isNotEmpty && !_pwMatch)
            const Padding(
              padding: EdgeInsets.only(top: 8),
              child: Text('Passwords don\'t match', style: TextStyle(color: Colors.red)),
            ),
        ]);
      default:
        return const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 64),
              SizedBox(height: 12),
              Text('Password reset', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Text('Sign in with your new password.', style: TextStyle(color: Colors.grey)),
            ],
          ),
        );
    }
  }

  Widget _wrap(List<Widget> children) =>
      ListView(children: children);
}
