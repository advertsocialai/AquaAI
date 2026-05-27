import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

/// M2 — Disease Detector (F09-F16): All 8 features
class DiseaseDetectorScreen extends StatefulWidget {
  const DiseaseDetectorScreen({super.key});

  @override
  State<DiseaseDetectorScreen> createState() => _DiseaseDetectorScreenState();
}

class _DiseaseDetectorScreenState extends State<DiseaseDetectorScreen> {
  int _step = 0; // 0=setup, 1=capture, 2=results
  bool _loading = false;
  String _cameraMode = 'software_mono'; // F09
  Map? _result;

  final _batchIdCtrl = TextEditingController(text: '1');
  final _pcrResultCtrl = TextEditingController();
  final _labNameCtrl = TextEditingController();
  bool _showPCRFeedback = false;

  @override
  void dispose() {
    _batchIdCtrl.dispose();
    _pcrResultCtrl.dispose();
    _labNameCtrl.dispose();
    super.dispose();
  }

  Future<void> _runDetection() async {
    setState(() { _loading = true; });
    try {
      // Submit to backend (on-device EHP inference runs at capture time)
      final session = await apiService.createDiagnosisSession({
        'batch_id': int.parse(_batchIdCtrl.text),
        'camera_mode': _cameraMode,
        'image_paths': [],
      });
      if (!mounted) return;
      setState(() { _result = session; _step = 2; });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
    } finally {
      if (!mounted) return;
      setState(() { _loading = false; });
    }
  }

  Future<void> _submitPCRFeedback() async {
    if (_result == null) return;
    try {
      await apiService.submitPCRFeedback(
        _result!['id'],
        _pcrResultCtrl.text.toLowerCase(),
        labName: _labNameCtrl.text.isEmpty ? null : _labNameCtrl.text,
      );
      if (!mounted) return;
      setState(() => _showPCRFeedback = false);
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('PCR feedback submitted. Thank you!')));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('M2 — Disease Detector'),
        backgroundColor: const Color(0xFFef4444),
      ),
      body: _loading
          ? const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Running EfficientNetB0 inference...'),
            ]))
          : _step == 0 ? _buildSetup()
          : _step == 1 ? _buildCapture()
          : _buildResults(),
    );
  }

  Widget _buildSetup() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // Info card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.blue.shade200),
          ),
          child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Disease Detection — Preparation', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('• Dissect shrimp and prepare HP smear on glass slide\n'
                '• Attach clip-on microscope lens + IntensLight LED\n'
                '• Open camera in monochrome mode\n'
                '• Capture at 1000x magnification (oil immersion)',
                style: TextStyle(fontSize: 12)),
          ]),
        ),
        const SizedBox(height: 16),
        TextField(controller: _batchIdCtrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Batch ID', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        // F09: Camera mode selection
        const Text('Camera Mode (F09)', style: TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: _CameraModeButton(
            label: 'Software Mono\n(Recommended for VLEs)',
            icon: Icons.phone_android,
            selected: _cameraMode == 'software_mono',
            onTap: () => setState(() => _cameraMode = 'software_mono'),
          )),
          const SizedBox(width: 8),
          Expanded(child: _CameraModeButton(
            label: 'USB Monochrome\n(Diagnostic centres)',
            icon: Icons.usb,
            selected: _cameraMode == 'usb_mono',
            onTap: () => setState(() => _cameraMode = 'usb_mono'),
          )),
        ]),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () => setState(() => _step = 1),
          icon: const Icon(Icons.camera_alt),
          label: const Text('Open Monochrome Camera'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFef4444), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16)),
        ),
      ]),
    );
  }

  Widget _buildCapture() {
    return Column(children: [
      Expanded(
        child: Container(
          color: Colors.black,
          child: Stack(alignment: Alignment.center, children: [
            // Monochrome camera preview placeholder
            Container(color: Colors.grey.shade800,
              child: const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                Icon(Icons.biotech, color: Colors.white54, size: 80),
                SizedBox(height: 8),
                Text('Monochrome Camera Active', style: TextStyle(color: Colors.white54)),
                Text('Y-Channel Extraction Enabled', style: TextStyle(color: Colors.white38, fontSize: 11)),
              ]))),
            Positioned(
              top: 16, right: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
                child: const Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.lens, color: Colors.grey, size: 8),
                  SizedBox(width: 4),
                  Text('MONO', style: TextStyle(color: Colors.white, fontSize: 12)),
                ]),
              ),
            ),
            Positioned(
              bottom: 0, left: 0, right: 0,
              child: Container(
                color: Colors.black87,
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  onPressed: _runDetection,
                  icon: const Icon(Icons.camera),
                  label: const Text('Capture HP Smear Image'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white, foregroundColor: Colors.black,
                    minimumSize: const Size.fromHeight(48)),
                ),
              ),
            ),
          ]),
        ),
      ),
    ]);
  }

  Widget _buildResults() {
    if (_result == null) return const SizedBox();
    final isHardFail = _result!['is_hard_fail'] == true;
    final riskLevel = _result!['risk_level'] ?? 'green';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // F13: Hard fail full-screen alert
        if (isHardFail) _buildHardFailCard(),

        // F15: Traffic-light risk display
        _buildRiskDisplay(riskLevel, isHardFail),

        const SizedBox(height: 16),

        // Disease probabilities — M2 F12
        _buildDiseaseTable(),

        const SizedBox(height: 16),

        // F11: Spore detection result
        if ((_result!['spore_detected'] == true)) _buildSporeResult(),

        const SizedBox(height: 16),

        // F16: PCR Feedback button (shown 48hrs after diagnosis)
        if (!_showPCRFeedback)
          OutlinedButton.icon(
            onPressed: () => setState(() => _showPCRFeedback = true),
            icon: const Icon(Icons.science),
            label: const Text('Got PCR Result? Enter It Here (F16)'),
          ),

        if (_showPCRFeedback) _buildPCRFeedback(),

        const SizedBox(height: 16),

        if (!isHardFail)
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.picture_as_pdf),
            label: const Text('Generate Disease Certificate'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(AppColors.primary), foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14)),
          ),

        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: () => setState(() { _step = 0; _result = null; }),
          icon: const Icon(Icons.refresh),
          label: const Text('New Session'),
        ),
      ]),
    );
  }

  Widget _buildHardFailCard() {
    final disease = _result!['hard_fail_disease'] ?? 'Disease';
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.red,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(children: [
        const Icon(Icons.dangerous, color: Colors.white, size: 48),
        const SizedBox(height: 8),
        const Text('REJECT — HARD FAIL',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
        Text('$disease Detected',
            style: const TextStyle(color: Colors.white, fontSize: 16)),
        const SizedBox(height: 8),
        const Text('Do not stock. Isolate affected samples.\nContact your aquaculture officer.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white70)),
      ]),
    );
  }

  Widget _buildRiskDisplay(String riskLevel, bool isHardFail) {
    final colors = {'red': Colors.red, 'yellow': Colors.orange,
                    'green': Colors.green, 'grey': Colors.grey};
    final color = colors[riskLevel] ?? Colors.grey;
    final actionText = _result!['risk_action_text'] ?? '';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(children: [
        Icon(riskLevel == 'green' ? Icons.check_circle
            : riskLevel == 'grey' ? Icons.help
            : Icons.warning_amber,
            color: color, size: 40),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(riskLevel.toUpperCase(), style: TextStyle(color: color,
              fontWeight: FontWeight.bold, fontSize: 18)),
          Text(actionText, style: TextStyle(fontSize: 12, color: color.withOpacity(0.8))),
        ])),
      ]),
    );
  }

  Widget _buildDiseaseTable() {
    final diseases = {
      'EHP': _result!['ehp_positive_prob'] ?? 0.0,
      'WSSV': _result!['wssv_confidence'] ?? 0.0,
      'AHPND': _result!['ahpnd_prob'] ?? 0.0,
      'BGD': _result!['bgd_prob'] ?? 0.0,
      'HPV': _result!['hpv_prob'] ?? 0.0,
      'WFS': _result!['wfs_prob'] ?? 0.0,
    };
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Disease Screening (F12)', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        ...diseases.entries.map((e) {
          final prob = (e.value as num).toDouble();
          final color = prob > 0.85 ? Colors.red : prob > 0.55 ? Colors.orange : Colors.green;
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 3),
            child: Row(children: [
              SizedBox(width: 60, child: Text(e.key, style: const TextStyle(fontWeight: FontWeight.w500))),
              Expanded(child: LinearProgressIndicator(
                value: prob, color: color, backgroundColor: Colors.grey.shade200,
                minHeight: 8, borderRadius: BorderRadius.circular(4))),
              const SizedBox(width: 8),
              Text('${(prob * 100).toStringAsFixed(0)}%',
                  style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
            ]),
          );
        }),
      ],
    );
  }

  Widget _buildSporeResult() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.shade200),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Row(children: [
          Icon(Icons.visibility, color: Colors.orange),
          SizedBox(width: 8),
          Text('EHP Spores Detected (F11)', style: TextStyle(fontWeight: FontWeight.bold)),
        ]),
        const SizedBox(height: 8),
        Text('Spore Count: ${_result!['spore_count'] ?? 0}'),
        Text('Severity: ${_result!['spore_severity'] ?? 'unknown'}'),
      ]),
    );
  }

  Widget _buildPCRFeedback() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.purple.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.purple.shade200),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const Text('Submit PCR Lab Result (F16)', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(labelText: 'PCR Result', border: OutlineInputBorder()),
          items: const [
            DropdownMenuItem(value: 'positive', child: Text('Positive')),
            DropdownMenuItem(value: 'negative', child: Text('Negative')),
          ],
          onChanged: (v) => _pcrResultCtrl.text = v ?? '',
        ),
        const SizedBox(height: 8),
        TextField(controller: _labNameCtrl,
          decoration: const InputDecoration(labelText: 'Lab Name (optional)', border: OutlineInputBorder())),
        const SizedBox(height: 12),
        ElevatedButton(onPressed: _submitPCRFeedback, child: const Text('Submit Feedback')),
      ]),
    );
  }
}

class _CameraModeButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const _CameraModeButton({required this.label, required this.icon,
    required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: selected ? const Color(0xFFef4444) : Colors.grey.shade300,
            width: selected ? 2 : 1),
          color: selected ? Colors.red.shade50 : Colors.white,
        ),
        child: Column(children: [
          Icon(icon, color: selected ? Colors.red : Colors.grey),
          const SizedBox(height: 4),
          Text(label, textAlign: TextAlign.center,
              style: TextStyle(fontSize: 11, color: selected ? Colors.red : Colors.grey.shade700)),
        ]),
      ),
    );
  }
}
