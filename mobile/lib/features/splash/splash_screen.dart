import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

/// Splash screen — minimal placeholder that hops to /home after a
/// short delay. Will be replaced by the real first-frame screen once
/// the user sends the design pic.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) context.go('/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // TODO: replace with the trident logo asset once we drop the SVG in.
            Icon(Icons.water_drop_outlined, size: 88, color: AppColors.cyan),
            SizedBox(height: 16),
            Text(
              'Aqua Rudra',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: AppColors.foreground,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
