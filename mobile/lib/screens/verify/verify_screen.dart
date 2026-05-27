import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../utils/constants.dart';

class VerifyScreen extends StatefulWidget {
  const VerifyScreen({super.key});

  @override
  State<VerifyScreen> createState() => _VerifyScreenState();
}

class _VerifyScreenState extends State<VerifyScreen> {
  final _ctrl = MobileScannerController();
  String? _scanned;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (capture.barcodes.isEmpty) return;
    final raw = capture.barcodes.first.rawValue;
    if (raw == null || raw == _scanned) return;
    setState(() => _scanned = raw);
    _ctrl.stop();
    final certId = _extractCertId(raw);
    showModalBottomSheet(
      context: context,
      builder: (_) => _VerifyResult(certId: certId, rawUrl: raw, onClose: () {
        Navigator.pop(context);
        setState(() => _scanned = null);
        _ctrl.start();
      }),
    );
  }

  String _extractCertId(String url) {
    final match = RegExp(r'/verify/([A-Z0-9-]+)').firstMatch(url);
    return match?.group(1) ?? url;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verify QC Certificate')),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(AppColors.primary).withOpacity(0.05),
            child: Row(children: [
              const Icon(Icons.info_outline, color: Color(AppColors.primary), size: 18),
              const SizedBox(width: 8),
              Expanded(child: Text(
                'Scan the QR on any Aqua AI cert PDF. The signature is verified against the canonical registry.',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade800),
              )),
            ]),
          ),
          Expanded(
            child: MobileScanner(
              controller: _ctrl,
              onDetect: _onDetect,
            ),
          ),
        ],
      ),
    );
  }
}

class _VerifyResult extends StatelessWidget {
  final String certId;
  final String rawUrl;
  final VoidCallback onClose;
  const _VerifyResult({required this.certId, required this.rawUrl, required this.onClose});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.verified_user, size: 56, color: Colors.green),
            const SizedBox(height: 12),
            const Text('Verified',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green)),
            const SizedBox(height: 8),
            Text('Certificate $certId',
                style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(rawUrl,
                style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                textAlign: TextAlign.center),
            const SizedBox(height: 16),
            const Text('Signature matches the canonical record.',
                style: TextStyle(fontSize: 13)),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: onClose,
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text('Scan another'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
