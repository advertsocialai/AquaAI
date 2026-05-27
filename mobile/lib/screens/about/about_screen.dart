import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    registerReadable(
      'About ${AppInfo.appName}. ${AppInfo.tagline}. '
      "${AppInfo.appName} is India's AI-powered aquaculture intelligence "
      'platform. PCR-grade AI diagnostics, live mandi pricing, verified '
      'marketplace, logistics and government surveillance — for every '
      'stakeholder in the prawn and fish supply chain, in six Indian '
      'languages, on a low-cost Android phone. '
      'Five on-device TFLite AI models. Six diseases covered: EHP, WSSV, '
      'AHPND, BGD, HPV, WFS. Inference under five hundred milliseconds. '
      'Full offline mode. MPEDA, NSPAAD, DPDPA 2023 compliant.',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(AppColors.accentCyan), Color(AppColors.accentViolet)],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.water_drop, color: Colors.white, size: 32),
                ),
                const SizedBox(height: 12),
                const Text(AppInfo.appName,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                Text(AppInfo.tagline,
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                const SizedBox(height: 4),
                Text('Version ${AppInfo.version}',
                    style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _section('Mission'),
          const _Card(child: Text(
            'Aqua AI is India\'s AI-powered aquaculture intelligence platform. PCR-grade '
            'AI diagnostics, live mandi pricing, verified marketplace, logistics and government '
            'surveillance — for every stakeholder in the prawn and fish supply chain, in six '
            'Indian languages, on a ₹8,000 Android phone.',
          )),
          const SizedBox(height: 12),
          _section('What\'s inside'),
          const _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _Row(label: 'AI models',     value: '5 on-device TFLite'),
            _Row(label: 'Diseases',      value: 'EHP · WSSV · AHPND · BGD · HPV · WFS'),
            _Row(label: 'Inference',     value: '<500 ms on mid-range Android'),
            _Row(label: 'Languages',     value: 'EN · TE · TA · HI · OD · BN'),
            _Row(label: 'Offline',       value: 'Full diagnostics + cached data'),
            _Row(label: 'Compliance',    value: 'MPEDA · NSPAAD · DPDPA 2023'),
          ])),
          const SizedBox(height: 12),
          _section('Contact'),
          _Card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.email_outlined),
              title: const Text(AppInfo.supportEmail),
              onTap: () {},
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.phone_outlined),
              title: const Text(AppInfo.supportPhone),
              onTap: () {},
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.language),
              title: const Text(AppInfo.websiteUrl),
              onTap: () {},
            ),
          ])),
          const SizedBox(height: 24),
          Center(
            child: Text('© ${DateTime.now().year} Aqua AI · Made in India',
                style: const TextStyle(color: Colors.grey, fontSize: 11)),
          ),
        ],
      ),
    );
  }

  Widget _section(String t) => Padding(
        padding: const EdgeInsets.only(left: 4, bottom: 8),
        child: Text(t.toUpperCase(),
            style: TextStyle(
                fontSize: 11,
                letterSpacing: 1.4,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700)),
      );
}

class _Card extends StatelessWidget {
  final Widget child;
  const _Card({required this.child});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  const _Row({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 100,
              child: Text(label,
                  style: TextStyle(color: Colors.grey.shade700, fontSize: 13))),
          Expanded(
              child: Text(value,
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
        ],
      ),
    );
  }
}
