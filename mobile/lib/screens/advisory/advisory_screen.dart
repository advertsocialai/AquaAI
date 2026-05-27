import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class AdvisoryScreen extends StatefulWidget {
  const AdvisoryScreen({super.key});

  @override
  State<AdvisoryScreen> createState() => _AdvisoryScreenState();
}

class _AdvisoryScreenState extends State<AdvisoryScreen> {
  // District comes from the logged-in user's profile in a future iteration;
  // hardcoded to a common AP shrimp belt district for now. Stays small —
  // change with one constant edit when the user-profile flow lands.
  static const _district = 'Nellore';

  Map<String, dynamic>? _weather;
  bool _weatherLoading = true;
  String? _weatherError;

  static const _calendar = [
    _CalStage('D-0', 'Pond Prep', 'Lime, dry, fill, fertilise'),
    _CalStage('D+5', 'Stocking', 'PL acclimatisation 2-3 hrs'),
    _CalStage('D+15', 'Nursery', 'Starter feed 4×/day'),
    _CalStage('D+30', 'Early Grow', 'Aerators on, exchange 10%'),
    _CalStage('D+60', 'Mid Grow', 'Probiotics, monitor DO'),
    _CalStage('D+90', 'Late Grow', 'Lower protein, prep harvest'),
    _CalStage('D+110', 'Pre-Harvest', 'Final QC + buyer match'),
    _CalStage('D+120', 'Harvest', 'Net out, ice, ship'),
  ];

  static const _alerts = [
    _Alert('EHP cluster 3.2 km E', '2 farms confirmed · 48h', Colors.red),
    _Alert('Heavy rain alert', 'IMD: 65mm tonight', Colors.orange),
    _Alert('DO low — Pond 3', '3.1 mg/L · sensor #14', Colors.orange),
    _Alert('Vannamei 40-ct ↑ 6%', 'Krishna mandi today', Colors.green),
  ];

  @override
  void initState() {
    super.initState();
    _loadWeather();
  }

  Future<void> _loadWeather() async {
    setState(() {
      _weatherLoading = true;
      _weatherError = null;
    });
    try {
      final w = await apiService.getWeather(_district);
      if (!mounted) return;
      setState(() {
        _weather = w;
        _weatherLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _weatherError = 'Could not load weather';
        _weatherLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advisory')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Weather card — live from /advisory/weather
          GestureDetector(
            onTap: _loadWeather,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF38BDF8).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.3)),
              ),
              child: _weatherLoading
                  ? const Row(
                      children: [
                        SizedBox(
                          width: 36,
                          height: 36,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        SizedBox(width: 12),
                        Text('Loading weather…'),
                      ],
                    )
                  : _weatherError != null
                      ? Row(
                          children: [
                            const Icon(Icons.cloud_off,
                                size: 36, color: Colors.grey),
                            const SizedBox(width: 12),
                            Text(_weatherError!,
                                style: TextStyle(color: Colors.grey.shade700)),
                            const Spacer(),
                            const Icon(Icons.refresh,
                                size: 18, color: Colors.grey),
                          ],
                        )
                      : _buildWeatherRow(),
            ),
          ),
          const SizedBox(height: 16),
          // Live alerts
          const _SectionHeader(icon: Icons.notifications, title: 'Live Alerts', accent: Colors.amber),
          const SizedBox(height: 8),
          ..._alerts.map((a) => Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(color: a.color, shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(a.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                          Text(a.detail,
                              style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 16),
          // Crop Calendar
          const _SectionHeader(
              icon: Icons.calendar_month,
              title: 'Crop Calendar — 120-day Vannamei',
              accent: Color(0xFF34D399)),
          const SizedBox(height: 8),
          ..._calendar.map((s) => Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  children: [
                    SizedBox(
                      width: 56,
                      child: Text(s.day,
                          style: const TextStyle(
                              fontFamily: 'monospace',
                              color: Color(0xFF34D399),
                              fontWeight: FontWeight.w600)),
                    ),
                    SizedBox(
                      width: 110,
                      child: Text(s.stage,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                    Expanded(
                      child: Text(s.action,
                          style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 16),
          // Voice assistant card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFFA78BFA).withOpacity(0.15),
                  const Color(0xFF38BDF8).withOpacity(0.10),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFA78BFA).withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.mic, color: Color(0xFFA78BFA)),
                    SizedBox(width: 8),
                    Text('Voice Assistant',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                    'Tap & speak in Telugu, Tamil, Hindi, Odia, Bengali or English. Replies are spoken back to you.',
                    style: TextStyle(fontSize: 12)),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(backgroundColor: const Color(0xFFA78BFA)),
                  icon: const Icon(Icons.mic),
                  label: const Text('Tap to talk'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeatherRow() {
    final temp = _weather?['temp_c'];
    final cond = (_weather?['condition'] ?? 'unknown').toString();
    final rain = _weather?['rain_mm'];
    final cyclone = _weather?['cyclone_alert'] == true;
    final hasRain = rain != null && (rain is num) && rain.toDouble() > 0;
    return Row(
      children: [
        const Icon(Icons.cloud, size: 36, color: Color(0xFF38BDF8)),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${temp?.toString() ?? "--"}°',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('$_district · $cond',
                style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
          ],
        ),
        const Spacer(),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (cyclone)
              const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.warning, color: Colors.red, size: 14),
                  SizedBox(width: 4),
                  Text('cyclone alert',
                      style: TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              )
            else if (hasRain)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.warning_amber, color: Colors.orange, size: 14),
                  const SizedBox(width: 4),
                  Text('heavy rain ${rain}mm',
                      style: const TextStyle(color: Colors.orange, fontSize: 12)),
                ],
              )
            else
              const Text('all clear',
                  style: TextStyle(color: Colors.green, fontSize: 12)),
            const SizedBox(height: 2),
            if (hasRain)
              const Text('DO drop risk',
                  style: TextStyle(color: Colors.grey, fontSize: 11)),
          ],
        ),
      ],
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color accent;
  const _SectionHeader({required this.icon, required this.title, required this.accent});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: accent, size: 18),
        const SizedBox(width: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      ],
    );
  }
}

class _CalStage {
  final String day;
  final String stage;
  final String action;
  const _CalStage(this.day, this.stage, this.action);
}

class _Alert {
  final String title;
  final String detail;
  final Color color;
  const _Alert(this.title, this.detail, this.color);
}
