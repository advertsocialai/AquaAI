import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'widgets/hero_section.dart';
import 'widgets/weather_card.dart';
import 'widgets/market_rates.dart';
import 'widgets/modules_grid.dart';
import 'widgets/roles_section.dart';
import 'widgets/service_providers.dart';
import 'widgets/home_cta.dart';

/// Aqua Rudra mobile home — mirrors the web `/home` page (Index.tsx)
/// section-for-section in a single scrolling view.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: AppBar(
              backgroundColor: AppColors.background.withValues(alpha: 0.55),
              elevation: 0,
              scrolledUnderElevation: 0,
              title: const Text(
                'Aqua Rudra',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top + kToolbarHeight),
          const HeroSection(),
          const _Section(child: WeatherCard()),
          const _Divider(),
          const _Section(child: MarketRates()),
          const _Divider(),
          const _Section(child: ModulesGrid()),
          const _Divider(),
          const _Section(child: RolesSection()),
          const _Divider(),
          const _Section(child: ServiceProviders()),
          const _Divider(),
          const _Section(child: HomeCta()),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

/// Standard horizontal + vertical padding wrapper for a home section.
class _Section extends StatelessWidget {
  const _Section({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 28),
      child: child,
    );
  }
}

/// Subtle full-width divider matching the web's `border-t border-border`.
class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) {
    return const Divider(height: 1, thickness: 1, color: AppColors.border);
  }
}
