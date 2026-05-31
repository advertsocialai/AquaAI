import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Stub Home screen. Will be replaced when the user shares the first
/// design pic. Keeps the shell launchable in the meantime so we can
/// run on both Android emulator and iOS simulator and confirm the
/// theme renders correctly.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Aqua Rudra')),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Mobile shell ready.',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: AppColors.foreground,
                ),
              ),
              SizedBox(height: 12),
              Text(
                'Send the first screen pic to start building it.',
                style: TextStyle(color: AppColors.foregroundMuted, height: 1.5),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
