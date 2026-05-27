import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../seed_counter/seed_counter_screen.dart';
import '../disease_detector/disease_detector_screen.dart';
import '../quality_grader/quality_grader_screen.dart';
import '../reports/reports_screen.dart';
import '../pricing/pricing_screen.dart';
import '../marketplace/marketplace_screen.dart';
import '../advisory/advisory_screen.dart';
import '../chat/chat_screen.dart';
import '../settings/settings_screen.dart';
import '../profile/profile_screen.dart';
import '../kyc/kyc_screen.dart';
import '../diagnostics/server_diagnostics_screen.dart';
import '../about/about_screen.dart';
import '../help/help_screen.dart';
import '../knowledge/knowledge_screen.dart';
import '../careers/careers_screen.dart';
import '../contact/contact_screen.dart';
import '../founders/founders_screen.dart';
import '../legal/legal_screen.dart';
import '../verify/verify_screen.dart';
import '../calculators/calculators_screen.dart';
import '../weather/weather_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  final _screens = const [
    _HomeTab(),
    PricingScreen(),
    MarketplaceScreen(),
    AdvisoryScreen(),
    _MoreTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (i) => setState(() => _selectedIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.currency_rupee_outlined),
              selectedIcon: Icon(Icons.currency_rupee), label: 'Pricing'),
          NavigationDestination(icon: Icon(Icons.storefront_outlined),
              selectedIcon: Icon(Icons.storefront), label: 'Market'),
          NavigationDestination(icon: Icon(Icons.tips_and_updates_outlined),
              selectedIcon: Icon(Icons.tips_and_updates), label: 'Advisory'),
          NavigationDestination(icon: Icon(Icons.apps_outlined),
              selectedIcon: Icon(Icons.apps), label: 'More'),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ChatScreen()),
          );
        },
        backgroundColor: const Color(0xFF2E75B6),
        icon: const Icon(Icons.chat_bubble_outline),
        label: const Text('Ask Aqua AI'),
      ),
    );
  }
}

class _MoreTab extends StatelessWidget {
  const _MoreTab();

  static const _items = [
    _MoreItem('AI Diagnostics (server)', Icons.auto_awesome, 'Backend inference · all models', 8),
    _MoreItem('Seed Counter', Icons.numbers, 'YOLOv8n PL counting · on-device', 0),
    _MoreItem('Disease Detector', Icons.biotech, 'EHP / WSSV / AHPND', 1),
    _MoreItem('Quality Grader', Icons.stars, 'Composite QS score', 2),
    _MoreItem('Reports', Icons.description, 'QC cert archive', 3),
    _MoreItem('Knowledge Hub', Icons.menu_book, 'Articles, guides, case studies', 11),
    _MoreItem('Calculators', Icons.calculate, 'Feed · aeration · pond volume · P&L', 12),
    _MoreItem('Verify QC Cert', Icons.qr_code_scanner, 'Scan certificate QR codes', 13),
    _MoreItem('Live Weather', Icons.wb_cloudy_outlined, 'IMD + Open-Meteo · 16 districts', 14),
    _MoreItem('Aqua AI Chat', Icons.chat_bubble_outline, 'Multilingual assistant', 4),
    _MoreItem('Profile', Icons.person_outline, 'Role + farm details', 5),
    _MoreItem('KYC', Icons.security_outlined, 'Aadhaar · PAN · GST · Bank', 6),
    _MoreItem('Settings', Icons.settings_outlined, 'Language, theme, alerts', 7),
    _MoreItem('Careers', Icons.work_outline, 'Open roles, perks, why Aqua AI', 15),
    _MoreItem('Contact', Icons.mail_outline, 'Get in touch · response in 24h', 16),
    _MoreItem('Founders', Icons.groups_outlined, 'Team behind Aqua AI', 17),
    _MoreItem('Privacy', Icons.privacy_tip_outlined, 'How we handle your data', 18),
    _MoreItem('Terms', Icons.gavel_outlined, 'Terms of service', 19),
    _MoreItem('Help & FAQ', Icons.help_outline, 'Questions, support contact', 9),
    _MoreItem('About', Icons.info_outline, 'App info, contact, version', 10),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('More')),
      body: ListView.separated(
        padding: const EdgeInsets.all(12),
        itemCount: _items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 8),
        itemBuilder: (_, i) {
          final it = _items[i];
          return Card(
            elevation: 0,
            shape: RoundedRectangleBorder(
              side: BorderSide(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: const Color(0xFF2E75B6).withOpacity(0.15),
                child: Icon(it.icon, color: const Color(0xFF0B5394)),
              ),
              title: Text(it.title,
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(it.subtitle, style: const TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Widget screen;
                switch (it.target) {
                  case 0:  screen = const SeedCounterScreen();        break;
                  case 1:  screen = const DiseaseDetectorScreen();    break;
                  case 2:  screen = const QualityGraderScreen();      break;
                  case 3:  screen = const ReportsScreen();            break;
                  case 4:  screen = const ChatScreen();               break;
                  case 5:  screen = const ProfileScreen();            break;
                  case 6:  screen = const KycScreen();                break;
                  case 7:  screen = const SettingsScreen();           break;
                  case 8:  screen = const ServerDiagnosticsScreen();  break;
                  case 9:  screen = const HelpScreen();               break;
                  case 10: screen = const AboutScreen();              break;
                  case 11: screen = const KnowledgeScreen();          break;
                  case 12: screen = const CalculatorsScreen();        break;
                  case 13: screen = const VerifyScreen();             break;
                  case 14: screen = const WeatherScreen();            break;
                  case 15: screen = const CareersScreen();            break;
                  case 16: screen = const ContactScreen();            break;
                  case 17: screen = const FoundersScreen();           break;
                  case 18: screen = const PrivacyScreen();            break;
                  case 19:
                  default: screen = const TermsScreen();
                }
                Navigator.push(
                    context, MaterialPageRoute(builder: (_) => screen));
              },
            ),
          );
        },
      ),
    );
  }
}

class _MoreItem {
  final String title;
  final IconData icon;
  final String subtitle;
  final int target;
  const _MoreItem(this.title, this.icon, this.subtitle, this.target);
}

class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppInfo.appName),
        actions: [
          IconButton(icon: const Icon(Icons.sync), onPressed: () {}),
          IconButton(icon: const Icon(Icons.person_outline), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Platform banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(AppColors.primary), Color(0xFF2d6a9f)],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Aqua AI',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Decoding aquaculture, one pond at a time',
                      style: TextStyle(color: Colors.white70, fontSize: 13)),
                  SizedBox(height: 12),
                  Row(children: [
                    _StatChip(label: '32 Features', icon: Icons.star),
                    SizedBox(width: 8),
                    _StatChip(label: '4 AI Models', icon: Icons.psychology),
                    SizedBox(width: 8),
                    _StatChip(label: '100% Offline', icon: Icons.wifi_off),
                  ]),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Modules', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.1,
              children: [
                _ModuleCard(
                  title: 'Seed Counter',
                  subtitle: 'Count & extrapolate PL batches',
                  icon: Icons.numbers,
                  color: const Color(0xFF0ea5e9),
                  badge: 'M1 · 8 Features',
                  onTap: () {},
                ),
                _ModuleCard(
                  title: 'Disease Detector',
                  subtitle: 'EHP, WSSV & 4 more diseases',
                  icon: Icons.biotech,
                  color: const Color(0xFFef4444),
                  badge: 'M2 · 8 Features',
                  onTap: () {},
                ),
                _ModuleCard(
                  title: 'Quality Grader',
                  subtitle: 'Composite QS 0-100 score',
                  icon: Icons.stars,
                  color: const Color(AppColors.primary),
                  badge: 'M3 · 8 Features',
                  onTap: () {},
                ),
                _ModuleCard(
                  title: 'Reports',
                  subtitle: 'PDF certs & analytics',
                  icon: Icons.description,
                  color: const Color(0xFF8b5cf6),
                  badge: 'M4 · 8 Features',
                  onTap: () {},
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Quick Stats', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _QuickStatCard(label: 'Sessions Today', value: '0', icon: Icons.today)),
              const SizedBox(width: 12),
              Expanded(child: _QuickStatCard(label: 'Pending Sync', value: '0', icon: Icons.cloud_upload)),
            ]),
          ],
        ),
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final IconData icon;
  const _StatChip({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, color: Colors.white, size: 12),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(color: Colors.white, fontSize: 10)),
      ]),
    );
  }
}

class _ModuleCard extends StatelessWidget {
  final String title, subtitle, badge;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;
  const _ModuleCard({required this.title, required this.subtitle,
    required this.icon, required this.color, required this.badge, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: color, size: 32),
          const Spacer(),
          Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 14)),
          Text(subtitle, style: TextStyle(fontSize: 11, color: color.withOpacity(0.7)),
              maxLines: 2, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(4)),
            child: Text(badge, style: TextStyle(fontSize: 9, color: color, fontWeight: FontWeight.bold)),
          ),
        ]),
      ),
    );
  }
}

class _QuickStatCard extends StatelessWidget {
  final String label, value;
  final IconData icon;
  const _QuickStatCard({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(children: [
        Icon(icon, color: Colors.grey.shade600),
        const SizedBox(width: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
        ]),
      ]),
    );
  }
}
