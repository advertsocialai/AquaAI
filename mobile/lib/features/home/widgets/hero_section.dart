import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

/// Hero section — mirrors the web `/home` hero with a teal→background→violet
/// gradient wash, a two-line headline, subtitle, and the two CTAs.
class HeroSection extends StatelessWidget {
  const HeroSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0x1A14B8A6), // teal-500/10
            AppColors.background,
            Color(0x1A8B5CF6), // violet-500/10
          ],
          stops: [0.0, 0.5, 1.0],
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 48, 20, 48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: const TextSpan(
              style: TextStyle(
                fontSize: 38,
                fontWeight: FontWeight.w800,
                height: 1.08,
                color: AppColors.foreground,
              ),
              children: [
                TextSpan(text: 'Decoding aquaculture,\n'),
                TextSpan(
                  text: 'one pond at a time.',
                  style: TextStyle(color: AppColors.cyanLight),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'AI-powered disease detection, live market prices, a verified '
            'marketplace, and logistics support — backed by expert guidance '
            'and official outbreak alerts.',
            style: TextStyle(
              fontSize: 16,
              height: 1.55,
              color: AppColors.foregroundMuted,
            ),
          ),
          const SizedBox(height: 28),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              FilledButton.icon(
                onPressed: () => context.go('/login'),
                icon: const Text('Get started free'),
                label: const Icon(Icons.arrow_forward, size: 18),
              ),
              OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context)
                    ..hideCurrentSnackBar()
                    ..showSnackBar(
                      const SnackBar(content: Text('Coming soon…')),
                    );
                },
                icon: const Icon(Icons.play_circle_outline, size: 18),
                label: const Text('See the platform'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.foreground,
                  side: const BorderSide(color: AppColors.border),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
