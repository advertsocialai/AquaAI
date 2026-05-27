import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class CalculatorsScreen extends StatelessWidget {
  const CalculatorsScreen({super.key});

  static const _calcs = [
    (Icons.numbers, 'Shrimp Count', 'Sample-to-pond extrapolation', _Tab.count),
    (Icons.restaurant, 'Daily Feed', 'Biomass × rate × FCR', _Tab.feed),
    (Icons.air, 'Aeration HP', 'Per acre, stocking, DO target', _Tab.aeration),
    (Icons.science, 'Liming', 'Soil pH delta × area', _Tab.lime),
    (Icons.water_drop, 'Pond Volume', 'Area × depth', _Tab.volume),
    (Icons.currency_rupee, 'Profit / Loss', 'Crop value vs cost', _Tab.pnl),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Calculators')),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: _calcs.map((c) => Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(10),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: const Color(AppColors.accentCyan).withOpacity(0.15),
              child: Icon(c.$1, color: const Color(AppColors.primary)),
            ),
            title: Text(c.$2, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(c.$3, style: const TextStyle(fontSize: 12)),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => _CalcDetail(title: c.$2, tab: c.$4)),
            ),
          ),
        )).toList(),
      ),
    );
  }
}

enum _Tab { count, feed, aeration, lime, volume, pnl }

class _CalcDetail extends StatefulWidget {
  final String title;
  final _Tab tab;
  const _CalcDetail({required this.title, required this.tab});

  @override
  State<_CalcDetail> createState() => _CalcDetailState();
}

class _CalcDetailState extends State<_CalcDetail> {
  final _a = TextEditingController();
  final _b = TextEditingController();
  final _c = TextEditingController();

  @override
  void dispose() {
    _a.dispose();
    _b.dispose();
    _c.dispose();
    super.dispose();
  }

  double _toD(TextEditingController c) => double.tryParse(c.text) ?? 0;

  String _output() {
    switch (widget.tab) {
      case _Tab.count:
        final est = (_toD(_a) / (_toD(_b) == 0 ? 1 : _toD(_b))) * _toD(_c);
        return est.isFinite && est > 0 ? '${est.round()} shrimp (estimated)' : '—';
      case _Tab.feed:
        final daily = _toD(_a) * (_toD(_b) / 100);
        return daily > 0 ? '${daily.toStringAsFixed(2)} kg/day' : '—';
      case _Tab.aeration:
        final hp = (_toD(_a) * _toD(_b)) / 1500;   // rough rule
        return hp > 0 ? '${hp.toStringAsFixed(1)} HP needed' : '—';
      case _Tab.lime:
        final kg = _toD(_a) * _toD(_b) * 50;
        return kg > 0 ? '${kg.toStringAsFixed(0)} kg CaO' : '—';
      case _Tab.volume:
        final v = _toD(_a) * _toD(_b) * _toD(_c);
        return v > 0 ? '${v.toStringAsFixed(0)} m³ (${(v * 1000).toStringAsFixed(0)} L)' : '—';
      case _Tab.pnl:
        final profit = (_toD(_a) * _toD(_b)) - _toD(_c);
        return profit != 0 ? '₹${profit.toStringAsFixed(0)} ${profit > 0 ? 'profit' : 'loss'}' : '—';
    }
  }

  List<(String, TextEditingController)> _fields() {
    switch (widget.tab) {
      case _Tab.count:
        return [('Shrimp in sample', _a), ('Sample area (m²)', _b), ('Pond area (m²)', _c)];
      case _Tab.feed:
        return [('Total biomass (kg)', _a), ('Feed rate %', _b)];
      case _Tab.aeration:
        return [('Pond area (m²)', _a), ('Stocking PL/m²', _b)];
      case _Tab.lime:
        return [('Area (acres)', _a), ('ΔpH desired', _b)];
      case _Tab.volume:
        return [('Length (m)', _a), ('Width (m)', _b), ('Depth (m)', _c)];
      case _Tab.pnl:
        return [('Harvest kg', _a), ('Price ₹/kg', _b), ('Total cost ₹', _c)];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ..._fields().map((f) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: TextField(
                controller: f.$2,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  labelText: f.$1,
                  border: const OutlineInputBorder(),
                ),
              ),
            )),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(AppColors.primary).withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                _output(),
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(AppColors.primary)),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
