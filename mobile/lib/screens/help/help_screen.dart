import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> with VoiceReadableScreen {
  static const _faqs = [
    _Faq(
      q: 'Does Aqua AI work without internet?',
      a: 'Yes. All five diagnostic models run on-device via TFLite. Results are stored '
          'locally and sync when signal returns.',
    ),
    _Faq(
      q: 'How accurate is EHP detection vs PCR?',
      a: 'Sensitivity > 92%, specificity > 88%, AUC-ROC > 0.95 against PCR-confirmed '
          'test sets validated with ICAR-CIBA.',
    ),
    _Faq(
      q: 'What hardware do I need for a sampling run?',
      a: 'A ₹8,000+ Android phone, a ₹1,500 USB pen microscope with LED ring, and a '
          'white 20×20 cm counting tray. Bundle kits in the Marketplace run ₹3,000–9,150.',
    ),
    _Faq(
      q: 'Can banks rely on the QC certificate?',
      a: 'Yes. Each cert is HMAC-SHA256 signed and verifiable at aquai.in/verify/{certId}. '
          'Partner banks accept them as underwriting evidence.',
    ),
    _Faq(
      q: 'Which languages does the app support?',
      a: 'English, Telugu, Tamil, Hindi, Odia, Bengali. Voice replies in your chosen '
          "language using the phone's built-in speech engine.",
    ),
    _Faq(
      q: 'How do I report an outbreak?',
      a: 'Tap the alert icon on the Advisory tab. Reports auto-sync to NSPAAD; '
          'severity flags trigger 5 km radius alerts to nearby farmers.',
    ),
  ];

  @override
  void initState() {
    super.initState();
    final text = _faqs.map((f) => 'Question: ${f.q} Answer: ${f.a}').join(' ');
    registerReadable('Help and FAQ. $text');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Help & FAQ')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(AppColors.primary).withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(AppColors.primary).withOpacity(0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.support_agent, color: Color(AppColors.primary)),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Talk to us', style: TextStyle(fontWeight: FontWeight.bold)),
                      SizedBox(height: 2),
                      Text(AppInfo.supportEmail,
                          style: TextStyle(fontSize: 12, color: Colors.black54)),
                    ],
                  ),
                ),
                FilledButton(
                  onPressed: () {},
                  style: FilledButton.styleFrom(backgroundColor: const Color(AppColors.primary)),
                  child: const Text('Call'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._faqs.map((f) => Card(
                margin: const EdgeInsets.only(bottom: 8),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  side: BorderSide(color: Colors.grey.shade200),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: ExpansionTile(
                  title: Text(f.q,
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(f.a,
                          style: TextStyle(
                              color: Colors.grey.shade700, fontSize: 13, height: 1.5)),
                    ),
                  ],
                ),
              )),
          const SizedBox(height: 12),
          Text(
              'Still stuck? Long-press any screen for inline hints. Or open the in-app '
              'chat assistant — it speaks your language.',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
        ],
      ),
    );
  }
}

class _Faq {
  final String q;
  final String a;
  const _Faq({required this.q, required this.a});
}
