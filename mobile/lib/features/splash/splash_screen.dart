import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

/// Aqua Rudra launch splash.
///
/// Style note: this screen intentionally uses a WHITE background even
/// though the rest of the app is deep-ocean-navy dark — splash screens
/// across both Play Store and App Store conventionally render on a
/// neutral, high-contrast surface so the brand mark reads on every
/// device wallpaper while the engine warms up.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (mounted) context.go('/home');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Trident mark — sized for ~96px tall, the comfortable
              // mid-zone of the screen.
              SvgPicture.asset(
                'assets/icons/trident.svg',
                width: 120,
                height: 120,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 20),
              const Text(
                'Aqua Rudra',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0A111F), // matches app dark navy
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "India's aquaculture intelligence platform",
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF64748B), // slate-500
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
