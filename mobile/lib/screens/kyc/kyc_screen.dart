import 'package:flutter/material.dart';

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

  static const _labels = ['Aadhaar', 'OTP', 'PAN', 'GST', 'Bank', 'Done'];

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

  void _advance() {
    setState(() => _step = (_step + 1).clamp(0, _labels.length - 1));
  }

  void _back() {
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
                    onPressed: _advance,
                    icon: const Icon(Icons.arrow_forward),
                    label: Text(_step == _labels.length - 2 ? 'Verify' : 'Next'),
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
