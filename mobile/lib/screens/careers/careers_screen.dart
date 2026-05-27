import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';

class CareersScreen extends StatefulWidget {
  const CareersScreen({super.key});

  @override
  State<CareersScreen> createState() => _CareersScreenState();
}

class _CareersScreenState extends State<CareersScreen>
    with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    final perksText = _perks.map((p) => '${p.$2}. ${p.$3}').join(' ');
    final whyText = _why.map((w) => '${w.$2}. ${w.$3}').join(' ');
    final rolesText = _openings.map((r) => '${r.$1} in ${r.$2}').join(', ');
    registerReadable(
      "We're hiring. Build the operating system for Indian aquaculture. "
      'Career Perks. $perksText '
      'Why Aqua AI. $whyText '
      'Open roles: $rolesText.',
    );
  }

  static const _perks = [
    (Icons.access_time, 'Flexible Hours',
        'Tailor your work schedule for optimal balance.'),
    (Icons.account_balance_wallet, 'Competitive Salaries',
        'Fair compensation within the aquaculture sector.'),
    (Icons.trending_up, 'Career Growth',
        'Continuous learning, mentoring and advancement.'),
    (Icons.celebration, 'Fun Environment',
        'Dynamic, enjoyable workplace culture.'),
    (Icons.volunteer_activism, 'Meaningful Projects',
        'Direct impact on India\'s aquaculture industry.'),
    (Icons.lightbulb, 'Innovative Culture',
        'Creative thinking, cutting-edge solutions.'),
    (Icons.location_on, 'Easy Location',
        'Remote-friendly. Work from anywhere.'),
  ];

  static const _why = [
    (Icons.auto_awesome, 'Innovation',
        'At the forefront of aquaculture AI — PCR-validated diagnostics, live mandi pricing, verified marketplaces.'),
    (Icons.public, 'Impact',
        'Your work directly contributes to shrimp and fish farmers across India.'),
    (Icons.handshake, 'Collaboration',
        'Diverse, passionate team. Ideas and contributions are valued.'),
    (Icons.school, 'Learning',
        'Comprehensive training. Direct access to leading industry authorities.'),
  ];

  static const _openings = [
    ('ML Engineer — Diagnostics', 'Hyderabad / Remote', 'Full-time'),
    ('Flutter Mobile Engineer', 'Hyderabad / Remote', 'Full-time'),
    ('Backend Engineer — FastAPI', 'Hyderabad / Remote', 'Full-time'),
    ('Field Operations Lead', 'Bhimavaram, AP', 'Full-time'),
    ('VLE Trainer — Telugu', 'Andhra Pradesh', 'Contract'),
    ('BD / Partnerships', 'Vizag / Chennai', 'Full-time'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Careers')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('We\'re hiring',
              style: TextStyle(fontSize: 13, color: Color(AppColors.accentCyan), fontWeight: FontWeight.w600, letterSpacing: 1.5)),
          const SizedBox(height: 6),
          const Text('Build the operating system for Indian aquaculture',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.2)),
          const SizedBox(height: 8),
          Text(
            'Join a small, focused team building AI diagnostics, live pricing, marketplace and logistics for 50,000+ farmers across five coastal states.',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade700, height: 1.5),
          ),
          const SizedBox(height: 24),
          _sectionTitle('Career Perks'),
          ..._perks.map((p) => _PerkTile(icon: p.$1, title: p.$2, body: p.$3)),
          const SizedBox(height: 16),
          _sectionTitle('Why Aqua AI'),
          ..._why.map((w) => _WhyTile(icon: w.$1, title: w.$2, body: w.$3)),
          const SizedBox(height: 16),
          _sectionTitle('Open Roles'),
          ..._openings.map((o) => _RoleTile(role: o.$1, location: o.$2, type: o.$3)),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(AppColors.primary), Color(AppColors.accentCyan)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Join us in transforming aquaculture',
                    style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text(
                  'If you\'re passionate about making a meaningful impact, Aqua AI is the place for you.',
                  style: TextStyle(color: Colors.white70, fontSize: 13),
                ),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(AppColors.primary)),
                  icon: const Icon(Icons.upload_file),
                  label: const Text('Post your resume'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String s) => Padding(
        padding: const EdgeInsets.only(top: 8, bottom: 12),
        child: Text(s.toUpperCase(),
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: Colors.grey.shade700)),
      );
}

class _PerkTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;
  const _PerkTile({required this.icon, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: const Color(AppColors.accentCyan).withOpacity(0.15),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: const Color(AppColors.primary), size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 2),
              Text(body, style: TextStyle(fontSize: 12, color: Colors.grey.shade700)),
            ],
          ),
        ),
      ]),
    );
  }
}

class _WhyTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String body;
  const _WhyTile({required this.icon, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32, height: 32,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              color: const Color(AppColors.accentViolet).withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.bolt, color: Color(AppColors.accentViolet), size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 2),
                Text(body, style: TextStyle(fontSize: 13, color: Colors.grey.shade700, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RoleTile extends StatelessWidget {
  final String role;
  final String location;
  final String type;
  const _RoleTile({required this.role, required this.location, required this.type});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(role, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 2),
                Text('$location · $type',
                    style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
              ],
            ),
          ),
          OutlinedButton(
              onPressed: () {},
              style: OutlinedButton.styleFrom(foregroundColor: const Color(AppColors.primary)),
              child: const Text('Apply')),
        ],
      ),
    );
  }
}
