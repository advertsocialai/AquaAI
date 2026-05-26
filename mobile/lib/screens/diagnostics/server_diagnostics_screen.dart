import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

enum DiagModel { seedCounter, diseaseDetector, qualityGrader, plStage }

extension on DiagModel {
  String get id => switch (this) {
        DiagModel.seedCounter      => 'seed-counter',
        DiagModel.diseaseDetector  => 'disease-detector',
        DiagModel.qualityGrader    => 'quality-grader',
        DiagModel.plStage          => 'pl-stage-classifier',
      };
  String get title => switch (this) {
        DiagModel.seedCounter     => 'Seed Counter',
        DiagModel.diseaseDetector => 'Disease Detector',
        DiagModel.qualityGrader   => 'Quality Grader',
        DiagModel.plStage         => 'PL Stage Classifier',
      };
  String get subtitle => switch (this) {
        DiagModel.seedCounter     => 'Count PLs, mortality %, size CV',
        DiagModel.diseaseDetector => 'EHP / WSSV / AHPND screen + Grad-CAM',
        DiagModel.qualityGrader   => 'Composite QS 0-100, grade, density',
        DiagModel.plStage         => 'PL5 / PL8 / PL10 / PL12 / PL15',
      };
  IconData get icon => switch (this) {
        DiagModel.seedCounter     => Icons.numbers,
        DiagModel.diseaseDetector => Icons.biotech,
        DiagModel.qualityGrader   => Icons.stars,
        DiagModel.plStage         => Icons.straighten,
      };
}

/// Server-side diagnostics screen. Picks a model, captures an image, posts to
/// /api/v1/models/{id}/infer, and renders the typed result.
class ServerDiagnosticsScreen extends StatefulWidget {
  const ServerDiagnosticsScreen({super.key});

  @override
  State<ServerDiagnosticsScreen> createState() => _ServerDiagnosticsScreenState();
}

class _ServerDiagnosticsScreenState extends State<ServerDiagnosticsScreen> {
  DiagModel _model = DiagModel.seedCounter;
  File? _image;
  Map<String, dynamic>? _result;
  bool _busy = false;
  String? _error;

  final _picker = ImagePicker();

  Future<void> _pick(ImageSource source) async {
    final picked = await _picker.pickImage(source: source, maxWidth: 1600, imageQuality: 85);
    if (picked == null) return;
    setState(() {
      _image = File(picked.path);
      _result = null;
      _error = null;
    });
  }

  Future<void> _run() async {
    final img = _image;
    if (img == null) return;
    setState(() { _busy = true; _error = null; _result = null; });
    try {
      final result = switch (_model) {
        DiagModel.seedCounter     => await apiService.inferSeedCount(img),
        DiagModel.diseaseDetector => await apiService.inferDisease(img),
        DiagModel.qualityGrader   => await apiService.inferQuality(img),
        DiagModel.plStage         => await apiService.inferPlStage(img),
      };
      setState(() => _result = result);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Diagnostics'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: SizedBox(
            height: 56,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: DiagModel.values.map((m) {
                final sel = m == _model;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(m.icon, size: 14),
                      const SizedBox(width: 6),
                      Text(m.title),
                    ]),
                    selected: sel,
                    onSelected: (_) => setState(() { _model = m; _result = null; }),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(AppColors.accentCyan).withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(AppColors.accentCyan).withOpacity(0.25)),
            ),
            child: Row(
              children: [
                Icon(_model.icon, color: const Color(AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_model.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                      Text(_model.subtitle, style: const TextStyle(fontSize: 11, color: Colors.black54)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          AspectRatio(
            aspectRatio: 4 / 3,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: _image == null
                  ? const Center(child: Text('Capture or pick a sample image', style: TextStyle(color: Colors.grey)))
                  : ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(_image!, fit: BoxFit.cover),
                    ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _busy ? null : () => _pick(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Camera'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _busy ? null : () => _pick(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Gallery'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          FilledButton.icon(
            onPressed: (_image == null || _busy) ? null : _run,
            icon: _busy
                ? const SizedBox(
                    width: 16, height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.auto_awesome),
            label: Text(_busy ? 'Running inference…' : 'Run AI inference'),
            style: FilledButton.styleFrom(backgroundColor: const Color(AppColors.primary)),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                border: Border.all(color: Colors.red.shade200),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(children: [
                const Icon(Icons.error_outline, color: Colors.red),
                const SizedBox(width: 8),
                Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red))),
              ]),
            ),
          ],
          if (_result != null) ...[
            const SizedBox(height: 16),
            _resultCard(),
          ],
        ],
      ),
    );
  }

  Widget _resultCard() {
    final r = _result!;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            const Icon(Icons.fact_check, color: Color(AppColors.success)),
            const SizedBox(width: 8),
            const Text('Inference result', style: TextStyle(fontWeight: FontWeight.bold)),
            const Spacer(),
            if (r['model_version'] != null)
              Text(r['model_version'].toString(),
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.grey)),
          ]),
          const Divider(height: 24),
          ..._renderResult(r),
          if (r['inference_ms'] != null) ...[
            const SizedBox(height: 12),
            Text('Inference took ${r['inference_ms']} ms',
                style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ],
      ),
    );
  }

  List<Widget> _renderResult(Map<String, dynamic> r) {
    switch (_model) {
      case DiagModel.seedCounter:
        return [
          _kv('Total count', '${r['count_total']}'),
          _kv('Alive', '${r['count_alive']}'),
          _kv('Dead', '${r['count_dead']}'),
          _kv('Debris', '${r['count_debris']}'),
          _kv('Mortality', '${r['mortality_pct']}%'),
          _kv('Size CV', '${r['size_cv_pct']}%'),
          _kv('Confidence', '${((r['confidence'] as num) * 100).toStringAsFixed(1)}%'),
        ];
      case DiagModel.diseaseDetector:
        final status = r['overall_status'] as String;
        final color = status == 'CLEAR'
            ? Colors.green
            : status == 'REJECT' ? Colors.red : Colors.orange;
        return [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Row(children: [
              Icon(status == 'CLEAR' ? Icons.check_circle : Icons.warning, color: color),
              const SizedBox(width: 8),
              Text(status, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16)),
            ]),
          ),
          const SizedBox(height: 8),
          _kv('Tissue class', r['tissue_class'] ?? '—'),
          _kv('Tissue confidence', '${((r['tissue_confidence'] as num) * 100).toStringAsFixed(1)}%'),
          _kv('Spores in field', '${r['spore_count']}'),
          _kv('Spore density', '${r['spore_density_per_mm2']} /mm²'),
          if ((r['diseases_detected'] as List).isNotEmpty) ...[
            const SizedBox(height: 8),
            const Text('Diseases detected:', style: TextStyle(fontWeight: FontWeight.w600)),
            ...((r['diseases_detected'] as List).map((d) => Text(
                '  • ${d['name']} · ${((d['confidence'] as num) * 100).toStringAsFixed(0)}% · ${d['severity']}'))),
          ],
          const SizedBox(height: 8),
          Text(r['explanation'] ?? '', style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
        ];
      case DiagModel.qualityGrader:
        return [
          Row(children: [
            Text('${r['composite_qs']}',
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Color(AppColors.primary))),
            const SizedBox(width: 8),
            const Text('/ 100', style: TextStyle(color: Colors.grey)),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(AppColors.success).withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(r['grade'] ?? '',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Color(AppColors.success))),
            ),
          ]),
          const SizedBox(height: 12),
          const Text('Sub-scores', style: TextStyle(fontWeight: FontWeight.w600)),
          ...((r['sub_scores'] as Map).entries.map((e) => _kv(e.key.toString().replaceAll('_', ' '), '${e.value}'))),
          const SizedBox(height: 8),
          _kv('Stocking density', '${r['recommended_stocking_density']} PL/m²'),
          if (r['invoice_mismatch_alert'] != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(6)),
              child: Text(r['invoice_mismatch_alert'].toString(), style: const TextStyle(color: Colors.deepOrange, fontSize: 12)),
            ),
          ],
        ];
      case DiagModel.plStage:
        return [
          Row(children: [
            Text(r['stage'] ?? '',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(AppColors.primary))),
            const Spacer(),
            Text('${((r['confidence'] as num) * 100).toStringAsFixed(1)}%',
                style: const TextStyle(color: Color(AppColors.success), fontWeight: FontWeight.bold)),
          ]),
          const SizedBox(height: 8),
          _kv('Body length estimate', '${r['body_length_mm_estimate']} mm'),
          const SizedBox(height: 8),
          const Text('Probabilities', style: TextStyle(fontWeight: FontWeight.w600)),
          ...((r['probabilities'] as Map).entries.map((e) => _kv(e.key.toString(), '${((e.value as num) * 100).toStringAsFixed(1)}%'))),
        ];
    }
  }

  Widget _kv(String k, String v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          children: [
            Expanded(child: Text(k, style: TextStyle(color: Colors.grey.shade700, fontSize: 13))),
            Text(v, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          ],
        ),
      );
}
