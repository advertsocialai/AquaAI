import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'section_header.dart';

class _Module {
  const _Module(this.icon, this.accent, this.title, this.desc);
  final IconData icon;
  final Color accent;
  final String title;
  final String desc;
}

const List<_Module> _modules = [
  _Module(
    Icons.currency_rupee,
    Color(0xFF34D399), // emerald
    'Live Pricing',
    'Live mandi + export FOB rates across 31+ species and 9 coastal states.',
  ),
  _Module(
    Icons.local_shipping,
    Color(0xFFF472B6), // pink
    'Logistics',
    'Load matching, GPS tracking, cold-chain compliance, e-way bills.',
  ),
  _Module(
    Icons.support_agent,
    Color(0xFFFACC15), // yellow
    'Crop Advisory',
    'Crop calendar, alerts within 5 km, voice assistant in 6 languages.',
  ),
  _Module(
    Icons.calculate,
    AppColors.cyan,
    'Aqua Tools',
    'Survival rate, feed/FCR and stocking calculators for every pond.',
  ),
];

/// 2-column grid of the four platform modules. Mirrors the web's
/// "Everything from pond to port" section.
class ModulesGrid extends StatelessWidget {
  const ModulesGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SectionHeader(
          eyebrow: 'One platform',
          title: 'Everything from pond to port',
        ),
        const SizedBox(height: 20),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.82,
          children: [
            for (final m in _modules) _ModuleCard(module: m),
          ],
        ),
      ],
    );
  }
}

class _ModuleCard extends StatelessWidget {
  const _ModuleCard({required this.module});
  final _Module module;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: module.accent.withValues(alpha: 0.13),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: module.accent.withValues(alpha: 0.33)),
            ),
            child: Icon(module.icon, size: 24, color: module.accent),
          ),
          const SizedBox(height: 14),
          Text(
            module.title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.foreground,
            ),
          ),
          const SizedBox(height: 6),
          Expanded(
            child: Text(
              module.desc,
              style: const TextStyle(
                fontSize: 13,
                height: 1.45,
                color: AppColors.foregroundMuted,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
