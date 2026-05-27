import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/weather_service.dart';
import '../../utils/constants.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  String _district = 'Bhimavaram';
  WeatherSnapshot? _snap;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final s = await weatherService.fetch(_district);
      if (!mounted) return;
      setState(() { _snap = s; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  IconData _iconFor(String c) => switch (c) {
        'Clear'    => Icons.wb_sunny_outlined,
        'Cloudy'   => Icons.cloud_outlined,
        'Fog'      => Icons.foggy,
        'Rain'     => Icons.umbrella_outlined,
        'Showers'  => Icons.water_drop_outlined,
        'Thunder'  => Icons.thunderstorm_outlined,
        'Snow'     => Icons.ac_unit_outlined,
        _          => Icons.help_outline,
      };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Weather'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loading ? null : _load),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // District picker
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _district,
                isExpanded: true,
                icon: const Icon(Icons.location_on_outlined, color: Color(AppColors.primary)),
                items: WeatherService.districts.entries
                    .map((e) => DropdownMenuItem(
                          value: e.key,
                          child: Text('${e.key} · ${e.value.region}',
                              style: const TextStyle(fontWeight: FontWeight.w500)),
                        ))
                    .toList(),
                onChanged: (v) {
                  if (v == null || v == _district) return;
                  setState(() => _district = v);
                  _load();
                },
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 48),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_error != null)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                border: Border.all(color: Colors.red.shade200),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(children: [
                const Icon(Icons.cloud_off, color: Colors.red),
                const SizedBox(width: 8),
                Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red))),
              ]),
            )
          else if (_snap != null) ...[
            _CurrentCard(snap: _snap!, icon: _iconFor(_snap!.condition)),
            const SizedBox(height: 16),
            _HourlyTempChart(snap: _snap!),
            const SizedBox(height: 16),
            _PrecipChart(snap: _snap!),
            const SizedBox(height: 12),
            Text('Source: Open-Meteo · Asia/Kolkata · Updated ${TimeOfDay.now().format(context)}',
                style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ],
      ),
    );
  }
}

class _CurrentCard extends StatelessWidget {
  final WeatherSnapshot snap;
  final IconData icon;
  const _CurrentCard({required this.snap, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(AppColors.primary), Color(AppColors.accentCyan)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Icon(icon, size: 56, color: Colors.white),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${snap.tempC.toStringAsFixed(1)}°C',
                    style: const TextStyle(
                        fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white)),
                Text(snap.condition,
                    style: const TextStyle(color: Colors.white70, fontSize: 14)),
              ],
            ),
            const Spacer(),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Icon(Icons.location_on, color: Colors.white70, size: 16),
                const SizedBox(height: 4),
                Text(snap.district,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                Text(snap.region,
                    style: const TextStyle(color: Colors.white60, fontSize: 11)),
              ],
            ),
          ]),
          const SizedBox(height: 20),
          Row(
            children: [
              _stat(Icons.water_drop_outlined, 'Humidity', '${snap.humidityPct.toStringAsFixed(0)}%'),
              _stat(Icons.air, 'Wind', '${snap.windKmh.toStringAsFixed(1)} km/h'),
              _stat(Icons.umbrella_outlined, 'Rain (now)', '${snap.precipitationMm.toStringAsFixed(1)} mm'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _stat(IconData icon, String label, String value) => Expanded(
        child: Column(
          children: [
            Icon(icon, color: Colors.white70, size: 18),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(color: Colors.white60, fontSize: 11)),
          ],
        ),
      );
}

class _HourlyTempChart extends StatelessWidget {
  final WeatherSnapshot snap;
  const _HourlyTempChart({required this.snap});

  @override
  Widget build(BuildContext context) {
    final n = snap.temps.length.clamp(0, 24);
    final spots = List.generate(n, (i) => FlSpot(i.toDouble(), snap.temps[i]));
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text('Temperature · next 24h',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          ),
          SizedBox(
            height: 160,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: spots,
                    isCurved: true,
                    color: const Color(AppColors.accentCyan),
                    barWidth: 2.5,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      color: const Color(AppColors.accentCyan).withOpacity(0.15),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PrecipChart extends StatelessWidget {
  final WeatherSnapshot snap;
  const _PrecipChart({required this.snap});

  @override
  Widget build(BuildContext context) {
    final n = snap.precip.length.clamp(0, 24);
    final bars = List.generate(
      n,
      (i) => BarChartGroupData(x: i, barRods: [
        BarChartRodData(
          toY: snap.precip[i],
          color: const Color(AppColors.primary),
          width: 6,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(3)),
        ),
      ]),
    );
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 8),
            child: Text('Precipitation · next 24h (mm)',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          ),
          SizedBox(
            height: 160,
            child: BarChart(
              BarChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                barGroups: bars,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
