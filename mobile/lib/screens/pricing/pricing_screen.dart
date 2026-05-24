import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math' as math;

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

  final List<_PriceRow> _prawn = const [
    _PriceRow('L. vannamei', '30 ct', 480, 550, 'up'),
    _PriceRow('L. vannamei', '40 ct', 380, 450, 'up'),
    _PriceRow('L. vannamei', '50 ct', 320, 380, 'flat'),
    _PriceRow('L. vannamei', '60 ct', 280, 330, 'flat'),
    _PriceRow('L. vannamei', '70 ct', 240, 290, 'down'),
    _PriceRow('L. vannamei', '80 ct', 210, 260, 'down'),
    _PriceRow('L. vannamei', '100 ct', 180, 220, 'down'),
    _PriceRow('P. monodon (Tiger)', '20 ct', 750, 900, 'up'),
    _PriceRow('P. monodon (Tiger)', '30 ct', 600, 720, 'up'),
    _PriceRow('Scampi', '6-10 ct', 550, 700, 'up'),
  ];

  final List<_PriceRow> _fresh = const [
    _PriceRow('Rohu', '1-2 kg', 140, 180, 'flat'),
    _PriceRow('Catla', '1.5-3 kg', 130, 170, 'flat'),
    _PriceRow('Mrigal', '1-2 kg', 110, 150, 'down'),
    _PriceRow('Pangasius', '1-2 kg', 110, 140, 'flat'),
    _PriceRow('Tilapia (GIFT)', '500g-1 kg', 120, 160, 'up'),
    _PriceRow('Murrel', '500g-1 kg', 350, 500, 'up'),
    _PriceRow('Pearl Spot', '200-400 g', 280, 400, 'up'),
  ];

  final List<_PriceRow> _marine = const [
    _PriceRow('Asian Seabass', '1-2 kg', 350, 450, 'up'),
    _PriceRow('Milkfish', '500g-1 kg', 180, 240, 'flat'),
    _PriceRow('Pompano', '400-600 g', 300, 400, 'up'),
    _PriceRow('Cobia', '2-5 kg', 350, 500, 'up'),
    _PriceRow('Grouper', '1-3 kg', 550, 800, 'up'),
    _PriceRow('Mud Crab', '300g-1.5 kg', 450, 1200, 'up'),
  ];

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
          // Tables
          Expanded(
            child: TabBarView(
              controller: _tab,
              children: [
                _PriceList(rows: _prawn),
                _PriceList(rows: _fresh),
                _PriceList(rows: _marine),
              ],
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
