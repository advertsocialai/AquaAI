import 'package:flutter/material.dart';
import '../../widgets/voice_fab.dart';

const _privacySections = [
  ('Data we collect',
      'Aadhaar (last 4 digits only), mobile, email, farm GPS, QC session images, payment confirmations. PII fields are encrypted at column level.'),
  ('How we use it',
      'Diagnostics, QC certificates, fraud prevention, regulatory reporting (NSPAAD), and personalising your dashboard.'),
  ('Sharing',
      'Aggregated anonymised data with MPEDA, ICAR-CIBA, partner banks. Never sold to advertisers.'),
  ('Your rights',
      'Access, correct or delete your personal data. Mail support@aquai.in.'),
  ('Data residency',
      'All data hosted in India (AWS Mumbai ap-south-1). DPDPA 2023 compliant.'),
];

const _termsSections = [
  ('Acceptance',
      'By using Aqua AI you agree to these terms. If you disagree, please do not use our services.'),
  ('Use of services',
      'Aqua AI provides AI diagnostics, pricing, marketplace, logistics, advisory and government surveillance tools.'),
  ('IP',
      'All content, research, data and models are the property of Aqua AI or its licensors.'),
  ('Liability',
      'Aqua AI shall not be liable for indirect, incidental, special or consequential damages.'),
  ('Contact',
      'For questions email support@aquai.in.'),
];

class PrivacyScreen extends StatefulWidget {
  const PrivacyScreen({super.key});
  @override
  State<PrivacyScreen> createState() => _PrivacyScreenState();
}

class _PrivacyScreenState extends State<PrivacyScreen>
    with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    registerReadable(
        'Privacy Policy. ${_privacySections.map((s) => '${s.$1}. ${s.$2}').join(' ')}');
  }

  @override
  Widget build(BuildContext context) =>
      _LegalScaffold(title: 'Privacy Policy', sections: _privacySections);
}

class TermsScreen extends StatefulWidget {
  const TermsScreen({super.key});
  @override
  State<TermsScreen> createState() => _TermsScreenState();
}

class _TermsScreenState extends State<TermsScreen>
    with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    registerReadable(
        'Terms of Service. ${_termsSections.map((s) => '${s.$1}. ${s.$2}').join(' ')}');
  }

  @override
  Widget build(BuildContext context) =>
      _LegalScaffold(title: 'Terms of Service', sections: _termsSections);
}

class _LegalScaffold extends StatelessWidget {
  final String title;
  final List<(String, String)> sections;
  const _LegalScaffold({required this.title, required this.sections});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: sections
            .map((s) => Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s.$1,
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Text(s.$2,
                          style: TextStyle(
                              fontSize: 14, color: Colors.grey.shade800, height: 1.5)),
                    ],
                  ),
                ))
            .toList(),
      ),
    );
  }
}
