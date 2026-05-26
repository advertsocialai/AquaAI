import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(AppColors.primary),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 84, height: 84,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(AppColors.accentCyan), Color(AppColors.accentViolet)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(AppColors.accentCyan).withOpacity(0.4),
                    blurRadius: 32,
                  ),
                ],
              ),
              child: const Icon(Icons.water_drop, color: Colors.white, size: 44),
            ),
            const SizedBox(height: 20),
            Text(
              AppInfo.appName,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              AppInfo.tagline,
              style: const TextStyle(color: Colors.white70, fontSize: 12),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 36),
            const SizedBox(
              width: 24, height: 24,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }
}
