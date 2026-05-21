import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../services/ai_service.dart';
import '../../utils/constants.dart';
import 'seed_scanner_screen.dart';

/// M1 — Seed Counter (F01-F08): All 8 features
class SeedCounterScreen extends StatefulWidget {
  const SeedCounterScreen({super.key});

  @override
  State<SeedCounterScreen> createState() => _SeedCounterScreenState();
}

class _SeedCounterScreenState extends State<SeedCounterScreen> {
  int _step = 0; // 0=setup, 1=capture, 2=results, 3=extrapolation
  int _ledBrightness = 3; // F05: IntensLight control
  bool _loading = false;
  Map? _result;
  Map? _extrapolation;

  final _batchIdCtrl = TextEditingController(text: '1');
  final _sampleVolCtrl = TextEditingController(text: '50');
  final _totalVolCtrl = TextEditingController(text: '5000');
  final _invoiceQtyCtrl = TextEditingController(text: '100000');

  Future<void> _runCounting() async {
    setState(() { _loading = true; });
    try {
      // F02: 3-Frame burst capture (simulated with AI service)
      final aiResult = await aiService.runSeedCounter([], _ledBrightness);

      // Submit to backend
      final session = await apiService.createCountingSession({
        'batch_id': int.parse(_batchIdCtrl.text),
        'led_brightness': _ledBrightness,
        'image_paths': [],
      });

      setState(() {
        _result = session;
        _step = 2;
      });
    } catch (e) {
      _showError(e.toString());
    } finally {
      setState(() { _loading = false; });
    }
  }

  Future<void> _runExtrapolation() async {
    if (_result == null) return;
    setState(() { _loading = true; });
    try {
      final ext = await apiService.extrapolateBatch(
        _result!['id'],
        double.parse(_sampleVolCtrl.text),
        double.parse(_totalVolCtrl.text),
        int.tryParse(_invoiceQtyCtrl.text),
      );
      setState(() { _extrapolation = ext; _step = 3; });
    } catch (e) {
      _showError(e.toString());
    } finally {
      setState(() { _loading = false; });
    }
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('M1 — Seed Counter'),
        backgroundColor: const Color(0xFF0ea5e9),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            tooltip: 'Camera Scanner',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SeedScannerScreen()),
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Running AI inference...'),
            ]))
          : _step == 0 ? _buildSetup()
          : _step == 1 ? _buildCapture()
          : _step == 2 ? _buildResults()
          : _buildExtrapolation(),
      floatingActionButton: _step == 0
          ? FloatingActionButton.extended(
              backgroundColor: const Color(0xFF0ea5e9),
              icon: const Icon(Icons.camera_alt),
              label: const Text('Scan Seeds'),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SeedScannerScreen()),
              ),
            )
          : null,
    );
  }

  Widget _buildSetup() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const Text('Session Setup', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        TextField(controller: _batchIdCtrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Batch ID', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        // F05: IntensLight LED control
        const Text('LED Brightness (F05 — IntensLight)', style: TextStyle(fontWeight: FontWeight.w600)),
        Row(children: [
          const Icon(Icons.wb_sunny_outlined, color: Colors.grey),
          Expanded(
            child: Slider(
              value: _ledBrightness.toDouble(),
              min: 1, max: 5, divisions: 4,
              label: 'Level $_ledBrightness',
              onChanged: (v) => setState(() => _ledBrightness = v.round()),
            ),
          ),
          const Icon(Icons.wb_sunny, color: Colors.orange),
        ]),
        Text('Level $_ledBrightness: ${_ledLabel(_ledBrightness)}',
            style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () => setState(() => _step = 1),
          icon: const Icon(Icons.camera_alt),
          label: const Text('Open Camera'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0ea5e9), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16)),
        ),
      ]),
    );
  }

  Widget _buildCapture() {
    // F01: Live bounding-box preview screen
    return Column(children: [
      Expanded(
        child: Container(
          color: Colors.black,
          child: Stack(alignment: Alignment.center, children: [
            const Icon(Icons.camera, color: Colors.white54, size: 80),
            const Positioned(
              top: 16, left: 16,
              child: _LiveCountOverlay(count: 0),
            ),
            Positioned(
              bottom: 0, left: 0, right: 0,
              child: Container(
                color: Colors.black54,
                padding: const EdgeInsets.all(16),
                child: Column(children: [
                  // LED brightness slider in capture mode
                  Row(children: [
                    const Icon(Icons.wb_sunny_outlined, color: Colors.white70, size: 16),
                    Expanded(child: Slider(
                      value: _ledBrightness.toDouble(),
                      min: 1, max: 5, divisions: 4,
                      onChanged: (v) => setState(() => _ledBrightness = v.round()),
                    )),
                    const Icon(Icons.wb_sunny, color: Colors.white, size: 16),
                  ]),
                  ElevatedButton.icon(
                    onPressed: _runCounting,
                    icon: const Icon(Icons.camera),
                    label: const Text('Capture (3-Frame Burst)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white, foregroundColor: Colors.black,
                      minimumSize: const Size.fromHeight(48)),
                  ),
                ]),
              ),
            ),
          ]),
        ),
      ),
    ]);
  }

  Widget _buildResults() {
    if (_result == null) return const SizedBox();
    final mortality = (_result!['mortality_pct'] ?? 0.0) as double;
    final mortalityAlert = _result!['mortality_alert'] ?? 'green';
    final cvPct = (_result!['cv_pct'] ?? 0.0) as double;
    final cvFlag = _result!['cv_flag'] ?? 'green';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // Count results
        _ResultCard(
          title: 'Count Results',
          color: Colors.blue,
          children: [
            _ResultRow('Live PLs', '${_result!['live_count'] ?? 0}', Colors.green),
            _ResultRow('Dead PLs', '${_result!['dead_count'] ?? 0}', Colors.red),
            _ResultRow('Total', '${_result!['total_count'] ?? 0}', Colors.blue),
            _ResultRow('Confidence', '±${_result!['confidence_interval'] ?? 0}', Colors.grey),
          ],
        ),
        const SizedBox(height: 12),
        // F03: Mortality alert
        _TrafficLightCard(
          title: 'Mortality Alert (F03)',
          value: '${mortality.toStringAsFixed(1)}%',
          level: mortalityAlert,
          description: mortalityAlert == 'green' ? 'Normal mortality. Proceed.'
              : mortalityAlert == 'yellow' ? 'Elevated mortality. Monitor closely.'
              : 'High mortality. Consider rejecting batch.',
        ),
        const SizedBox(height: 12),
        // F04: CV Analysis
        _TrafficLightCard(
          title: 'Size Uniformity — CV% (F04)',
          value: '${cvPct.toStringAsFixed(1)}%',
          level: cvFlag == 'red_escalate' ? 'red' : cvFlag,
          description: cvFlag == 'green' ? 'Excellent uniformity.'
              : cvFlag == 'yellow' ? 'Acceptable uniformity.'
              : cvFlag == 'red_escalate'
                  ? 'Poor uniformity. Auto-escalating to Quality Grader.'
                  : 'Poor uniformity. EHP check recommended.',
        ),
        const SizedBox(height: 24),
        // F06: Extrapolation
        const Text('Batch Extrapolation (F06)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextField(controller: _sampleVolCtrl, keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Sample Volume (ml)', border: OutlineInputBorder(),
            suffixText: 'ml')),
        const SizedBox(height: 8),
        TextField(controller: _totalVolCtrl, keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Total Batch Volume (ml)', border: OutlineInputBorder(),
            suffixText: 'ml')),
        const SizedBox(height: 8),
        TextField(controller: _invoiceQtyCtrl, keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Invoice Quantity', border: OutlineInputBorder())),
        const SizedBox(height: 16),
        ElevatedButton.icon(
          onPressed: _runExtrapolation,
          icon: const Icon(Icons.calculate),
          label: const Text('Calculate Full Batch Count'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(AppColors.primary), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
      ]),
    );
  }

  Widget _buildExtrapolation() {
    if (_extrapolation == null) return const SizedBox();
    final flag = _extrapolation!['invoice_flag'] == true;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: flag ? Colors.red.shade50 : Colors.green.shade50,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: flag ? Colors.red.shade200 : Colors.green.shade200),
          ),
          child: Column(children: [
            Text(_extrapolation!['display'] ?? '', textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            if (flag) ...[
              const SizedBox(height: 8),
              const Icon(Icons.warning_amber, color: Colors.red, size: 32),
              Text('Invoice discrepancy: ${_extrapolation!['invoice_discrepancy_pct']?.toStringAsFixed(1)}%',
                  style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
              const Text('Actual count differs >10% from invoiced quantity.',
                  style: TextStyle(color: Colors.red)),
            ],
          ]),
        ),
        const SizedBox(height: 24),
        ElevatedButton.icon(
          onPressed: () {
            // Generate certificate
          },
          icon: const Icon(Icons.picture_as_pdf),
          label: const Text('Generate QC Certificate (F25)'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(AppColors.primary), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: () => setState(() { _step = 0; _result = null; _extrapolation = null; }),
          icon: const Icon(Icons.refresh),
          label: const Text('New Session'),
        ),
      ]),
    );
  }

  String _ledLabel(int level) {
    switch (level) {
      case 1: case 2: return 'Low — shallow water / high reflection';
      case 3: return 'Medium — standard for most sessions';
      case 4: case 5: return 'High — turbid water / deeper trays';
      default: return '';
    }
  }
}

class _LiveCountOverlay extends StatelessWidget {
  final int count;
  const _LiveCountOverlay({required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(20)),
      child: Text('Live: $count PLs', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
    );
  }
}

class _ResultCard extends StatelessWidget {
  final String title;
  final Color color;
  final List<Widget> children;
  const _ResultCard({required this.title, required this.color, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: color.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), topRight: Radius.circular(12)),
            ),
            child: Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: color)),
          ),
          Padding(padding: const EdgeInsets.all(16), child: Column(children: children)),
        ],
      ),
    );
  }
}

class _ResultRow extends StatelessWidget {
  final String label, value;
  final Color color;
  const _ResultRow(this.label, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 16)),
        ],
      ),
    );
  }
}

class _TrafficLightCard extends StatelessWidget {
  final String title, value, level, description;
  const _TrafficLightCard({required this.title, required this.value,
    required this.level, required this.description});

  Color get _color => level == 'green' ? Colors.green
      : level == 'yellow' ? Colors.orange
      : Colors.red;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _color.withOpacity(0.3)),
      ),
      child: Row(children: [
        Container(width: 12, height: 48, decoration: BoxDecoration(
          color: _color, borderRadius: BorderRadius.circular(6))),
        const SizedBox(width: 16),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: _color)),
          Text(description, style: TextStyle(fontSize: 12, color: _color.withOpacity(0.8))),
        ])),
      ]),
    );
  }
}
