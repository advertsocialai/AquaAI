import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

/// M3 — Quality Grader (F17-F24): All 8 features
class QualityGraderScreen extends StatefulWidget {
  const QualityGraderScreen({super.key});

  @override
  State<QualityGraderScreen> createState() => _QualityGraderScreenState();
}

class _QualityGraderScreenState extends State<QualityGraderScreen> {
  bool _loading = false;
  Map? _result;
  final _batchIdCtrl = TextEditingController(text: '1');
  final _densityCtrl = TextEditingController(text: '20');

  // F24: Multi-Camera Session step tracking
  int _captureStep = 0;
  final List<String> _captureSteps = [
    'Step 1: Colour overhead (size + visual health)',
    'Step 2: Monochrome HP smear (disease)',
    'Step 3: Fecal string (WFS check)',
    'Step 4: Side-view macro (PL stage)',
  ];

  @override
  void dispose() {
    _batchIdCtrl.dispose();
    _densityCtrl.dispose();
    super.dispose();
  }

  Future<void> _runGrading() async {
    setState(() { _loading = true; });
    try {
      final session = await apiService.createGradingSession({
        'batch_id': int.parse(_batchIdCtrl.text),
        'planned_density_per_sqm': double.tryParse(_densityCtrl.text),
        'image_paths': [],
      });
      if (!mounted) return;
      setState(() { _result = session; });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
    } finally {
      if (!mounted) return;
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('M3 — Quality Grader'),
          backgroundColor: const Color(AppColors.primary)),
      body: _loading
          ? const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Running multi-model fusion...'),
              Text('Visual Health + Disease + Size + Stage', style: TextStyle(color: Colors.grey)),
            ]))
          : _result == null ? _buildSetup() : _buildResults(),
    );
  }

  Widget _buildSetup() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // F24: Multi-Camera Session Orchestration steps
        const Text('4-Step Grading Session (F24)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...List.generate(_captureSteps.length, (i) {
          final done = i < _captureStep;
          final active = i == _captureStep;
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: done ? Colors.green.shade50
                  : active ? Colors.blue.shade50
                  : Colors.grey.shade50,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: done ? Colors.green.shade200
                    : active ? Colors.blue.shade300
                    : Colors.grey.shade200),
            ),
            child: Row(children: [
              Icon(done ? Icons.check_circle : active ? Icons.camera_alt : Icons.radio_button_unchecked,
                  color: done ? Colors.green : active ? Colors.blue : Colors.grey),
              const SizedBox(width: 12),
              Expanded(child: Text(_captureSteps[i],
                  style: TextStyle(
                    fontWeight: active ? FontWeight.bold : FontWeight.normal,
                    color: done ? Colors.green.shade700 : Colors.black87))),
              if (active) TextButton(
                onPressed: () => setState(() => _captureStep++),
                child: const Text('Capture'),
              ),
            ]),
          );
        }),

        const SizedBox(height: 16),
        TextField(controller: _batchIdCtrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Batch ID', border: OutlineInputBorder())),
        const SizedBox(height: 8),
        TextField(controller: _densityCtrl,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Planned Density (PLs/m²)', border: OutlineInputBorder(),
            suffixText: 'PLs/m²')),
        const SizedBox(height: 24),

        ElevatedButton.icon(
          onPressed: _runGrading,
          icon: const Icon(Icons.analytics),
          label: const Text('Run Full Quality Assessment'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(AppColors.primary), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16)),
        ),
        const SizedBox(height: 8),
        Text('Estimated session time: 4-7 minutes',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
      ]),
    );
  }

  Widget _buildResults() {
    if (_result == null) return const SizedBox();
    final score = (_result!['composite_score'] as num?)?.toDouble() ?? 0.0;
    final grade = _result!['composite_grade'] ?? 'REJECT';
    final isHardFail = _result!['is_hard_fail'] == true;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // F17: Composite Quality Score hero
        _buildScoreCard(score, grade, isHardFail),
        const SizedBox(height: 16),

        // Score breakdown
        const Text('Score Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 8),
        _buildScoreBar('Visual Health (F18)', _result!['visual_health_score'], 30, Colors.blue),
        _buildScoreBar('Disease (F10-F12)', _result!['disease_score'], 25, Colors.red),
        _buildScoreBar('Size Uniformity (F04)', _result!['size_uniformity_score'], 20, Colors.green),
        _buildScoreBar('PL Stage (F19)', _result!['stage_score'], 15, Colors.orange),
        _buildScoreBar('Activity', _result!['activity_score'], 10, Colors.purple),

        const SizedBox(height: 16),

        // F19: Stage identification
        if (_result!['detected_pl_stage'] != null)
          _buildStageCard(),

        const SizedBox(height: 16),

        // F21: Stocking recommendation
        _buildStockingCard(score, grade),

        const SizedBox(height: 16),

        // F22: Mismatch alert
        if (_result!['count_mismatch'] == true)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.red.shade50, borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.red.shade300)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Row(children: [
                Icon(Icons.warning, color: Colors.red),
                SizedBox(width: 8),
                Text('Quantity Mismatch Alert (F22)', style: TextStyle(fontWeight: FontWeight.bold)),
              ]),
              const SizedBox(height: 4),
              Text('Actual count differs ${_result!['count_discrepancy_pct']?.toStringAsFixed(1)}% from invoice.',
                  style: const TextStyle(color: Colors.red)),
            ]),
          ),

        const SizedBox(height: 24),

        // F23: QC Certificate
        ElevatedButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.verified),
          label: const Text('Generate QC Certificate (F23)'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(AppColors.primary), foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14)),
        ),
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: () => setState(() => _result = null),
          icon: const Icon(Icons.refresh),
          label: const Text('New Session'),
        ),
      ]),
    );
  }

  Widget _buildScoreCard(double score, String grade, bool isHardFail) {
    final Color gradeColor;
    if (isHardFail) {
      gradeColor = Colors.red;
    } else if (score >= 85) {
      gradeColor = Colors.green;
    } else if (score >= 70) {
      gradeColor = const Color(0xFF84cc16);
    } else if (score >= 55) {
      gradeColor = Colors.orange;
    } else if (score >= 40) {
      gradeColor = Colors.deepOrange;
    } else {
      gradeColor = Colors.red;
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: gradeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: gradeColor.withOpacity(0.3), width: 2),
      ),
      child: Column(children: [
        Text(isHardFail ? 'REJECT' : grade,
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: gradeColor)),
        if (!isHardFail) ...[
          Text('${score.toStringAsFixed(1)} / 100',
              style: TextStyle(fontSize: 18, color: gradeColor)),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: score / 100, color: gradeColor, backgroundColor: Colors.grey.shade200,
            minHeight: 12, borderRadius: BorderRadius.circular(6)),
        ] else
          const Text('Disease detected. Do not stock.',
              style: TextStyle(color: Colors.red)),
      ]),
    );
  }

  Widget _buildScoreBar(String label, dynamic score, int maxScore, Color color) {
    final s = (score as num?)?.toDouble() ?? 0.0;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(children: [
        SizedBox(width: 150, child: Text(label, style: const TextStyle(fontSize: 12))),
        Expanded(child: LinearProgressIndicator(
          value: s / maxScore, color: color, backgroundColor: Colors.grey.shade200,
          minHeight: 8, borderRadius: BorderRadius.circular(4))),
        const SizedBox(width: 8),
        Text('${s.toStringAsFixed(0)}/$maxScore',
            style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildStageCard() {
    final stageMismatch = _result!['stage_mismatch'] == true;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: stageMismatch ? Colors.orange.shade50 : Colors.blue.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: stageMismatch ? Colors.orange.shade300 : Colors.blue.shade200)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(stageMismatch ? Icons.warning_amber : Icons.check_circle,
              color: stageMismatch ? Colors.orange : Colors.blue),
          const SizedBox(width: 8),
          const Text('PL Stage (F19)', style: TextStyle(fontWeight: FontWeight.bold)),
        ]),
        const SizedBox(height: 8),
        Text('Detected: ${_result!['detected_pl_stage']}',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        Text('Confidence: ${((_result!['stage_confidence'] ?? 0.0) * 100).toStringAsFixed(0)}%'),
        if (stageMismatch)
          const Text('Stage mismatch with ordered batch!',
              style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
      ]),
    );
  }

  Widget _buildStockingCard(double score, String grade) {
    final rec = _result!['stocking_recommendation'] ?? '';
    final densityPct = (_result!['recommended_density_pct'] as num?)?.toDouble() ?? 0.0;
    final densityPerSqm = _result!['recommended_density_per_sqm'];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.green.shade200)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Row(children: [
          Icon(Icons.water, color: Colors.green),
          SizedBox(width: 8),
          Text('Stocking Recommendation (F21)', style: TextStyle(fontWeight: FontWeight.bold)),
        ]),
        const SizedBox(height: 8),
        if (densityPerSqm != null)
          Text('Recommended: ${densityPerSqm} PLs/m² (${densityPct.toStringAsFixed(0)}% of planned)',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 4),
        Text(rec, style: const TextStyle(fontSize: 13)),
      ]),
    );
  }
}
