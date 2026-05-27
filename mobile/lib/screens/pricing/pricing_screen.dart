import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math' as math;
import '../../services/api_service.dart';

class PricingScreen extends StatefulWidget {
  const PricingScreen({super.key});

  @override
  State<PricingScreen> createState() => _PricingScreenState();
}

class _PricingScreenState extends State<PricingScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;
  int _speciesIdx = 0;
  String _range = '30d';

  // Loaded live from /api/v1/pricing/{category}. Empty until first fetch
  // completes; the table shows a skeleton instead of bogus hardcoded values.
  List<_PriceRow> _prawn = const [];
  List<_PriceRow> _fresh = const [];
  List<_PriceRow> _marine = const [];
  bool _loading = true;
  String? _error;

  final List<_Species> _featured = const [
    _Species('Vannamei 40-ct', 420, Color(0xFF38BDF8)),
    _Species('Tiger 30-ct', 660, Color(0xFFF87171)),
    _Species('Rohu 1-2 kg', 160, Color(0xFF34D399)),
    _Species('Seabass 1-2 kg', 400, Color(0xFFA78BFA)),
  ];

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
    _loadPrices();
  }

  Future<void> _loadPrices() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      // Fetch all three categories in parallel.
      final results = await Future.wait([
        apiService.getPricing('prawn'),
        apiService.getPricing('freshwater'),
        apiService.getPricing('marine'),
      ]);
      if (!mounted) return;
      setState(() {
        _prawn = results[0].map(_rowFromJson).toList();
        _fresh = results[1].map(_rowFromJson).toList();
        _marine = results[2].map(_rowFromJson).toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Could not load live prices. Pull down to retry.';
        _loading = false;
      });
    }
  }

  _PriceRow _rowFromJson(Map<String, dynamic> j) => _PriceRow(
        (j['species'] ?? '').toString(),
        (j['size'] ?? '').toString(),
        _asInt(j['low']),
        _asInt(j['high']),
        (j['trend'] ?? 'flat').toString(),
      );

  int _asInt(dynamic v) {
    if (v is int) return v;
    if (v is num) return v.toInt();
    return int.tryParse(v?.toString() ?? '') ?? 0;
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  List<FlSpot> _series(double current, int seed) {
    final n = _range == '7d'
        ? 7
        : _range == '30d'
            ? 30
            : _range == '90d'
                ? 90
                : 52;
    final rand = math.Random(seed);
    var val = current * (0.85 + rand.nextDouble() * 0.15);
    final spots = <FlSpot>[];
    for (var i = 0; i < n; i++) {
      final drift = math.sin(i / 5 + seed) * 4 + (rand.nextDouble() - 0.5) * 6;
      val = math.max(current * 0.7, math.min(current * 1.15, val + drift));
      spots.add(FlSpot(i.toDouble(), val));
    }
    spots[spots.length - 1] = FlSpot((n - 1).toDouble(), current);
    return spots;
  }

  @override
  Widget build(BuildContext context) {
    final species = _featured[_speciesIdx];
    final spots = _series(species.current.toDouble(), _speciesIdx + 1);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Pricing'),
        bottom: TabBar(
          controller: _tab,
          tabs: const [
            Tab(text: 'Prawn'),
            Tab(text: 'Freshwater'),
            Tab(text: 'Marine'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Chart
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _featured.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (_, i) {
                      final s = _featured[i];
                      final selected = i == _speciesIdx;
                      return GestureDetector(
                        onTap: () => setState(() => _speciesIdx = i),
                        child: Container(
                          padding:
                              const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: selected ? s.color.withOpacity(0.15) : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: selected ? s.color : Colors.grey.shade300,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: s.color,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(s.label,
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight:
                                          selected ? FontWeight.w600 : FontWeight.w400)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text('₹${species.current}',
                        style: const TextStyle(
                            fontSize: 28, fontWeight: FontWeight.bold)),
                    const Text('/kg', style: TextStyle(color: Colors.grey)),
                    const Spacer(),
                    ...['7d', '30d', '90d', '1y'].map(
                      (r) => Padding(
                        padding: const EdgeInsets.only(left: 6),
                        child: GestureDetector(
                          onTap: () => setState(() => _range = r),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color:
                                  _range == r ? species.color : Colors.transparent,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              r.toUpperCase(),
                              style: TextStyle(
                                  fontSize: 10,
                                  color: _range == r
                                      ? Colors.white
                                      : Colors.grey.shade600,
                                  fontWeight: FontWeight.w600),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 140,
                  child: LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      borderData: FlBorderData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          spots: spots,
                          isCurved: true,
                          color: species.color,
                          barWidth: 2.5,
                          dotData: const FlDotData(show: false),
                          belowBarData: BarAreaData(
                            show: true,
                            color: species.color.withOpacity(0.15),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Tables — show spinner while loading; error tile if fetch failed.
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? RefreshIndicator(
                        onRefresh: _loadPrices,
                        child: ListView(
                          children: [
                            const SizedBox(height: 60),
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  children: [
                                    const Icon(Icons.cloud_off,
                                        size: 48, color: Colors.grey),
                                    const SizedBox(height: 12),
                                    Text(_error!,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(color: Colors.grey)),
                                    const SizedBox(height: 12),
                                    FilledButton.tonal(
                                      onPressed: _loadPrices,
                                      child: const Text('Retry'),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadPrices,
                        child: TabBarView(
                          controller: _tab,
                          children: [
                            _PriceList(rows: _prawn),
                            _PriceList(rows: _fresh),
                            _PriceList(rows: _marine),
                          ],
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class _PriceRow {
  final String species;
  final String size;
  final int low;
  final int high;
  final String trend;
  const _PriceRow(this.species, this.size, this.low, this.high, this.trend);
}

class _Species {
  final String label;
  final int current;
  final Color color;
  const _Species(this.label, this.current, this.color);
}

class _PriceList extends StatelessWidget {
  final List<_PriceRow> rows;
  const _PriceList({required this.rows});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      itemCount: rows.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (_, i) {
        final r = rows[i];
        final mid = ((r.low + r.high) / 2).round();
        IconData icon;
        Color color;
        switch (r.trend) {
          case 'up':
            icon = Icons.trending_up;
            color = Colors.green;
            break;
          case 'down':
            icon = Icons.trending_down;
            color = Colors.red;
            break;
          default:
            icon = Icons.trending_flat;
            color = Colors.grey;
        }
        return ListTile(
          title: Text(r.species, style: const TextStyle(fontWeight: FontWeight.w600)),
          subtitle: Text('${r.size} · ₹${r.low}-${r.high}/kg'),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('₹$mid',
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, color: Color(0xFF0B5394))),
              const SizedBox(width: 8),
              Icon(icon, color: color, size: 18),
            ],
          ),
        );
      },
    );
  }
}
