import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'section_header.dart';

/// Two tappable market-rate cards (Shrimp / Fish). Tapping shows a
/// SnackBar since the /rates screen doesn't exist yet.
class MarketRates extends StatelessWidget {
  const MarketRates({super.key});

  void _openRates(BuildContext context) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(const SnackBar(content: Text('Opening rates…')));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SectionHeader(
          eyebrow: 'Market rates',
          title: "Today's farm-gate rates",
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            Expanded(
              child: _RateCard(
                icon: Icons.set_meal_outlined,
                label: 'Shrimp Rates',
                accent: const Color(0xFF14B8A6), // teal-500
                onTap: () => _openRates(context),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _RateCard(
                icon: Icons.phishing,
                label: 'Fish Rates',
                accent: AppColors.cyan, // sky
                onTap: () => _openRates(context),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _RateCard extends StatelessWidget {
  const _RateCard({
    required this.icon,
    required this.label,
    required this.accent,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color accent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: accent.withValues(alpha: 0.30)),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                accent.withValues(alpha: 0.16),
                accent.withValues(alpha: 0.04),
              ],
            ),
          ),
          child: Row(
            children: [
              Icon(icon, size: 34, color: accent),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.foreground,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
