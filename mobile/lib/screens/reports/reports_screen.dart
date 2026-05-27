import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';

/// M4 — Reports, Certificates, Analytics, OTA
class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _loading = true;
  List _certificates = [];
  Map? _dashboard;
  List _models = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        apiService.getCertificates(),
        apiService.getDashboard(),
        apiService.getLatestModels(),
      ]);
      if (!mounted) return;
      setState(() {
        _certificates = results[0] as List;
        _dashboard = results[1] as Map;
        _models = results[2] as List;
      });
    } catch (_) {}
    if (!mounted) return;
    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('M4 — Reports & Analytics'),
        backgroundColor: const Color(0xFF8b5cf6),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Certificates'),
            Tab(text: 'Analytics'),
            Tab(text: 'Models'),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadData),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildCertificates(),
                _buildAnalytics(),
                _buildModelUpdates(),
              ],
            ),
    );
  }

  Widget _buildCertificates() {
    if (_certificates.isEmpty) {
      return const Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.description_outlined, size: 64, color: Colors.grey),
        Text('No certificates yet', style: TextStyle(color: Colors.grey)),
      ]));
    }
    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _certificates.length,
        itemBuilder: (_, i) {
          final cert = _certificates[i];
          final grade = cert['grade'] as String?;
          final isHardFail = cert['is_hard_fail'] == true;
          final Color gradeColor = isHardFail ? Colors.red
              : grade == 'PREMIUM' ? Colors.green
              : grade == 'GOOD' ? const Color(0xFF84cc16)
              : grade == 'CONDITIONAL' ? Colors.orange
              : Colors.red;

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  color: gradeColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8)),
                child: Icon(isHardFail ? Icons.dangerous : Icons.verified,
                    color: gradeColor),
              ),
              title: Text(cert['certificate_id'].toString().substring(0, 8).toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'monospace')),
              subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${cert['session_type']} · ${cert['farm_name'] ?? 'Unknown'}'),
                if (cert['composite_score'] != null)
                  Text('Score: ${(cert['composite_score'] as num).toDouble().toStringAsFixed(1)}/100'),
              ]),
              trailing: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: gradeColor,
                    borderRadius: BorderRadius.circular(4)),
                  child: Text(isHardFail ? 'REJECT' : grade ?? '—',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                ),
              ]),
              onTap: () {
                // Open PDF or verification screen
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildAnalytics() {
    if (_dashboard == null) return const Center(child: Text('No data'));
    final seed = _dashboard!['seed_counter'] as Map;
    final quality = _dashboard!['quality_grader'] as Map;
    final disease = _dashboard!['disease_detector'] as Map;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const Text('Farm Analytics (F27)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(child: _StatTile('Sessions', '${seed['total_sessions']}', Icons.numbers, Colors.blue)),
          const SizedBox(width: 12),
          Expanded(child: _StatTile('Avg Mortality', '${seed['avg_mortality_pct']}%', Icons.warning_amber, Colors.orange)),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: _StatTile('Graded Batches', '${quality['total_graded']}', Icons.stars, Colors.purple)),
          const SizedBox(width: 12),
          Expanded(child: _StatTile('Avg QS Score', '${quality['avg_quality_score']}/100', Icons.bar_chart, Colors.green)),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: _StatTile('Diagnoses', '${disease['total_diagnoses']}', Icons.biotech, Colors.teal)),
          const SizedBox(width: 12),
          Expanded(child: _StatTile('Hard Fails', '${disease['critical_detections']}', Icons.dangerous, Colors.red)),
        ]),
        const SizedBox(height: 24),
        // Grade distribution
        if (quality['grade_distribution'] != null) ...[
          const Text('Grade Distribution', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ...(quality['grade_distribution'] as Map).entries.map((e) {
            final colors = {'PREMIUM': Colors.green, 'GOOD': Colors.lightGreen,
                'CONDITIONAL': Colors.orange, 'CAUTION': Colors.deepOrange, 'REJECT': Colors.red};
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 3),
              child: Row(children: [
                SizedBox(width: 100, child: Text(e.key.toString(), style: const TextStyle(fontSize: 12))),
                Container(
                  width: (e.value as int).toDouble() * 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: colors[e.key] ?? Colors.grey,
                    borderRadius: BorderRadius.circular(4)),
                ),
                const SizedBox(width: 8),
                Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.bold)),
              ]),
            );
          }),
        ],
      ]),
    );
  }

  Widget _buildModelUpdates() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('AI Model Versions (F29 — OTA)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Models update automatically in background.',
            style: TextStyle(color: Colors.grey, fontSize: 12)),
        const SizedBox(height: 16),
        ..._models.map((m) => Card(
          child: ListTile(
            leading: const Icon(Icons.psychology, color: Color(AppColors.primary)),
            title: Text(m['model_name'].toString().replaceAll('_', ' ').toUpperCase(),
                style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('v${m['version']} · ${m['file_size_mb']}MB'),
            trailing: const Icon(Icons.check_circle, color: Colors.green),
          ),
        )),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;
  const _StatTile(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 8),
        Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ]),
    );
  }
}
