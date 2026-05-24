import 'package:flutter/material.dart';

class AdvisoryScreen extends StatelessWidget {
  const AdvisoryScreen({super.key});

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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advisory')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Weather card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF38BDF8).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.cloud, size: 36, color: Color(0xFF38BDF8)),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('29°',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    Text('Bhimavaram · partly cloudy',
                        style: TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                  ],
                ),
                const Spacer(),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: const [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.warning_amber, color: Colors.orange, size: 14),
                        SizedBox(width: 4),
                        Text('heavy rain 65mm',
                            style: TextStyle(color: Colors.orange, fontSize: 12)),
                      ],
                    ),
                    SizedBox(height: 2),
                    Text('DO drop risk',
                        style: TextStyle(color: Colors.grey, fontSize: 11)),
                  ],
                ),
              ],
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
