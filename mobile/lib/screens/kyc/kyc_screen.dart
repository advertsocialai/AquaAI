import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class KycScreen extends StatefulWidget {
  const KycScreen({super.key});

  @override
  State<KycScreen> createState() => _KycScreenState();
}

class _KycScreenState extends State<KycScreen> {
  int _step = 0;
  final _aadhaar = TextEditingController();
  final _otp = TextEditingController();
  final _pan = TextEditingController();
  final _gst = TextEditingController();
  final _account = TextEditingController();
  final _ifsc = TextEditingController();

  String _aadhaarLast4 = '';
  bool _busy = false;

  static const _labels = ['Aadhaar', 'OTP', 'PAN', 'GST', 'Bank', 'Done'];

  // PAN: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
  static final _panRe = RegExp(r'^[A-Z]{5}[0-9]{4}[A-Z]$');
  // GSTIN: 2-digit state + 10-char PAN + 1 entity char + 1 'Z' + 1 checksum
  static final _gstRe = RegExp(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$');
  // IFSC: 4 letters + '0' + 6 alphanumeric
  static final _ifscRe = RegExp(r'^[A-Z]{4}0[A-Z0-9]{6}$');

  @override
  void dispose() {
    _aadhaar.dispose();
    _otp.dispose();
    _pan.dispose();
    _gst.dispose();
    _account.dispose();
    _ifsc.dispose();
    super.dispose();
  }

  String _maskAadhaar(String raw) {
    final d = raw.replaceAll(RegExp(r'\D'), '');
    if (d.length <= 8) return d;
    return 'XXXX XXXX ${d.substring(8)}';
  }

  void _snack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), duration: const Duration(seconds: 3)),
    );
  }

  /// Validates the current step's input. Returns a non-null error message
  /// to show via SnackBar, or null when the input is acceptable.
  String? _validateCurrent() {
    switch (_step) {
      case 0:
        final d = _aadhaar.text.replaceAll(RegExp(r'\D'), '');
        if (d.length != 12) return 'Aadhaar must be exactly 12 digits';
        return null;
      case 1:
        final o = _otp.text.trim();
        if (o.length != 6 || !RegExp(r'^[0-9]{6}$').hasMatch(o)) {
          return 'OTP must be 6 digits';
        }
        return null;
      case 2:
        final p = _pan.text.toUpperCase().trim();
        if (!_panRe.hasMatch(p)) return 'PAN must look like ABCDE1234F';
        return null;
      case 3:
        final g = _gst.text.toUpperCase().trim();
        if (g.isEmpty) return null; // skipped via "individual" button
        if (!_gstRe.hasMatch(g)) return 'GSTIN must be 15 characters in the correct format';
        return null;
      case 4:
        final a = _account.text.replaceAll(RegExp(r'\D'), '');
        if (a.length < 9 || a.length > 18) return 'Account number must be 9–18 digits';
        if (!_ifscRe.hasMatch(_ifsc.text.toUpperCase().trim())) {
          return 'IFSC must look like SBIN0001234';
        }
        return null;
    }
    return null;
  }

  Future<void> _advance() async {
    if (_busy) return;
    final err = _validateCurrent();
    if (err != null) {
      _snack(err);
      return;
    }
    setState(() => _busy = true);
    try {
      switch (_step) {
        case 0:
          final res = await apiService.sendAadhaarOtp(_aadhaar.text.replaceAll(RegExp(r'\D'), ''));
          if (res['ok'] != true) {
            _snack(res['error']?.toString() ?? 'Could not send OTP');
            return;
          }
          _aadhaarLast4 = (res['aadhaar_last4'] ?? '').toString();
          break;
        case 1:
          final res = await apiService.verifyAadhaarOtp(_aadhaarLast4, _otp.text.trim());
          if (res['ok'] != true) {
            _snack('OTP verification failed');
            return;
          }
          break;
        case 2:
          final res = await apiService.verifyPan(_pan.text.toUpperCase().trim());
          if (res['ok'] != true) {
            _snack('PAN verification failed');
            return;
          }
          break;
        case 3:
          if (_gst.text.trim().isNotEmpty) {
            final res = await apiService.verifyGst(_gst.text.toUpperCase().trim());
            if (res['ok'] != true) {
              _snack('GSTIN verification failed');
              return;
            }
          }
          break;
        case 4:
          final res = await apiService.pennyDropBank(
            _account.text.replaceAll(RegExp(r'\D'), ''),
            _ifsc.text.toUpperCase().trim(),
          );
          if (res['ok'] != true) {
            _snack('Bank verification failed');
            return;
          }
          break;
      }
      setState(() => _step = (_step + 1).clamp(0, _labels.length - 1));
    } on Object catch (e) {
      _snack('Network error: ${e.toString().split(":").last.trim()}');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _back() {
    if (_busy) return;
    setState(() => _step = (_step - 1).clamp(0, _labels.length - 1));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('KYC Verification')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: List.generate(_labels.length, (i) {
                final done = i < _step;
                final active = i == _step;
                final color = done
                    ? Colors.green
                    : active
                        ? const Color(0xFF0B5394)
                        : Colors.grey.shade300;
                return Expanded(
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                        child: Center(
                          child: done
                              ? const Icon(Icons.check, color: Colors.white, size: 14)
                              : Text('${i + 1}',
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      if (i < _labels.length - 1)
                        Expanded(child: Container(height: 1, color: color.withOpacity(0.3))),
                    ],
                  ),
                );
              }),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(_labels[_step].toUpperCase(),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(child: _body()),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                if (_step > 0 && _step < _labels.length - 1)
                  OutlinedButton.icon(
                    onPressed: _back,
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Back'),
                  ),
                const Spacer(),
                if (_step < _labels.length - 1)
                  FilledButton.icon(
                    onPressed: _busy ? null : _advance,
                    icon: _busy
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.arrow_forward),
                    label: Text(_busy
                        ? 'Verifying…'
                        : _step == _labels.length - 2
                            ? 'Verify'
                            : 'Next'),
                  ),
                if (_step == _labels.length - 1)
                  FilledButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.check),
                    label: const Text('Done'),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _body() {
    switch (_step) {
      case 0:
        return _form([
          const Text('Enter your 12-digit Aadhaar. NSDL handles e-KYC; we store only the last 4 digits.',
              style: TextStyle(fontSize: 12)),
          const SizedBox(height: 12),
          TextField(
            controller: _aadhaar,
            keyboardType: TextInputType.number,
            maxLength: 12,
            decoration: InputDecoration(
              labelText: 'Aadhaar number',
              border: const OutlineInputBorder(),
              hintText: _maskAadhaar(_aadhaar.text),
            ),
            onChanged: (_) => setState(() {}),
          ),
        ]);
      case 1:
        return _form([
          Text('OTP sent to mobile linked to ${_maskAadhaar(_aadhaar.text)}',
              style: const TextStyle(fontSize: 12)),
          const SizedBox(height: 12),
          TextField(
            controller: _otp,
            keyboardType: TextInputType.number,
            maxLength: 6,
            decoration: const InputDecoration(labelText: '6-digit OTP', border: OutlineInputBorder()),
          ),
        ]);
      case 2:
        return _form([
          TextField(
            controller: _pan,
            maxLength: 10,
            decoration: const InputDecoration(labelText: 'PAN (e.g. ABCDE1234F)', border: OutlineInputBorder()),
            textCapitalization: TextCapitalization.characters,
          ),
        ]);
      case 3:
        return _form([
          TextField(
            controller: _gst,
            maxLength: 15,
            decoration: const InputDecoration(
                labelText: 'GSTIN (skip if individual)', border: OutlineInputBorder()),
            textCapitalization: TextCapitalization.characters,
          ),
          TextButton(onPressed: _advance, child: const Text('Skip — individual')),
        ]);
      case 4:
        return _form([
          TextField(
            controller: _account,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Account number', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _ifsc,
            maxLength: 11,
            decoration: const InputDecoration(labelText: 'IFSC', border: OutlineInputBorder()),
            textCapitalization: TextCapitalization.characters,
          ),
          const SizedBox(height: 12),
          const Row(
            children: [
              Icon(Icons.security, size: 14, color: Colors.green),
              SizedBox(width: 6),
              Expanded(
                child: Text('Penny-drop verification confirms account holder name without you sharing OTPs.',
                    style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ]);
      default:
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.verified, color: Colors.green, size: 64),
              SizedBox(height: 12),
              Text('KYC complete', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 32),
                child: Text(
                  'Your identity is now linked to every Aqua AI transaction — hatchery contracts, bank underwriting and Razorpay payouts.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12),
                ),
              ),
            ],
          ),
        );
    }
  }

  Widget _form(List<Widget> children) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView(children: children),
    );
  }
}
