import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'section_header.dart';

/// "Built for roles" — Farmer / Trader cards. Tapping shows a SnackBar
/// since the role dashboards aren't wired into the mobile shell yet.
class RolesSection extends StatelessWidget {
  const RolesSection({super.key});

  void _tap(BuildContext context, String role) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('$role — coming soon')));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SectionHeader(
          eyebrow: 'Built for you',
          title: 'Built for every role in the chain',
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            Expanded(
              child: _RoleCard(
                icon: Icons.agriculture_outlined,
                title: 'Farmer',
                line: 'Diagnose disease, track ponds, sell at the best rate.',
                accent: AppColors.success,
                onTap: () => _tap(context, 'Farmer'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _RoleCard(
                icon: Icons.storefront_outlined,
                title: 'Trader',
                line: 'Source verified stock, manage logistics, grow exports.',
                accent: AppColors.cyan,
                onTap: () => _tap(context, 'Trader'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.icon,
    required this.title,
    required this.line,
    required this.accent,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String line;
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
            color: AppColors.card,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.13),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: accent.withValues(alpha: 0.33)),
                ),
                child: Icon(icon, size: 22, color: accent),
              ),
              const SizedBox(height: 14),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.foreground,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                line,
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.45,
                  color: AppColors.foregroundMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
