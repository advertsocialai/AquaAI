import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

/// Closing CTA card + a simple footer line, mirroring the web FinalCta
/// and Footer at the bottom of /home.
class HomeCta extends StatelessWidget {
  const HomeCta({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0x1A14B8A6),
                AppColors.card,
                Color(0x1A8B5CF6),
              ],
            ),
          ),
          child: Column(
            children: [
              const Text(
                'Get started with Aqua Rudra',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  height: 1.2,
                  color: AppColors.foreground,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Join farmers and traders building a smarter, more '
                'transparent aquaculture supply chain.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: AppColors.foregroundMuted,
                ),
              ),
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: () => context.go('/login'),
                icon: const Text('Get started free'),
                label: const Icon(Icons.arrow_forward, size: 18),
              ),
            ],
          ),
        ),
        const SizedBox(height: 28),
        const Text(
          "Aqua Rudra for India's Aquaculture",
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.foreground,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          '© 2026 Aqua Rudra. All rights reserved.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: AppColors.foregroundFaint,
          ),
        ),
      ],
    );
  }
}
