import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  int _step = 0;
  bool _busy = false;
  final _email = TextEditingController();
  final _otp = TextEditingController();
  final _pw = TextEditingController();
  final _pw2 = TextEditingController();

  static const _labels = ['Email', 'Code', 'New password', 'Done'];

  @override
  void dispose() {
    _email.dispose();
    _otp.dispose();
    _pw.dispose();
    _pw2.dispose();
    super.dispose();
  }

  bool _emailValid(String s) => RegExp(r'^\S+@\S+\.\S+$').hasMatch(s.trim());
  bool get _pwOk =>
      _pw.text.length >= 8 && _pw.text.contains(RegExp(r'[A-Z]')) && _pw.text.contains(RegExp(r'\d'));
  bool get _pwMatch => _pw.text == _pw2.text;

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _next() async {
    if (_busy) return;

    // Step 0 — request OTP via email
    if (_step == 0) {
      if (!_emailValid(_email.text)) {
        _snack('Enter a valid email address');
        return;
      }
      setState(() => _busy = true);
      try {
        await apiService.forgotPassword(_email.text.trim().toLowerCase());
        if (!mounted) return;
        _snack('Code sent — check your inbox (and spam)');
        setState(() {
          _step = 1;
          _busy = false;
        });
      } catch (e) {
        if (!mounted) return;
        setState(() => _busy = false);
        _snack('Could not send code: ${e.toString().split(":").last.trim()}');
      }
      return;
    }

    // Step 1 — local-only OTP length check; verification happens with the password.
    if (_step == 1) {
      if (_otp.text.length != 6 || !RegExp(r'^[0-9]{6}$').hasMatch(_otp.text)) {
        _snack('Enter the 6-digit code');
        return;
      }
      setState(() => _step = 2);
      return;
    }

    // Step 2 — verify OTP and update password in one backend call.
    if (_step == 2) {
      if (!_pwOk) {
        _snack('Password needs 8+ chars, 1 capital, 1 digit');
        return;
      }
      if (!_pwMatch) {
        _snack('Passwords don\'t match');
        return;
      }
      setState(() => _busy = true);
      try {
        await apiService.resetPassword(
          _email.text.trim().toLowerCase(),
          _otp.text.trim(),
          _pw.text,
        );
        if (!mounted) return;
        setState(() {
          _step = 3;
          _busy = false;
        });
      } catch (e) {
        if (!mounted) return;
        setState(() => _busy = false);
        // Common case: invalid OTP — bounce back to step 1 so they re-enter it.
        final msg = e.toString();
        if (msg.contains('Invalid code') || msg.contains('No active reset')) {
          _snack('That code didn\'t work. Re-check the email.');
          setState(() => _step = 1);
        } else {
          _snack('Reset failed: ${msg.split(":").last.trim()}');
        }
      }
    }
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
                  onPressed: _busy ? null : _next,
                  icon: _busy
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.arrow_forward),
                  label: Text(_busy
                      ? 'Working…'
                      : _step == _labels.length - 2
                          ? 'Reset password'
                          : 'Continue'),
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
          const Text(
            'Enter the email you used to sign up. We\'ll send a 6-digit code to reset your password.',
            style: TextStyle(fontSize: 13),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email address',
              border: OutlineInputBorder(),
            ),
            onChanged: (_) => setState(() {}),
          ),
        ]);
      case 1:
        return _wrap([
          Text('Code sent to ${_email.text.trim()}',
              style: TextStyle(color: Colors.grey.shade700)),
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
