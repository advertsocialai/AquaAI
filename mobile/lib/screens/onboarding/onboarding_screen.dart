import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onDone;
  const OnboardingScreen({super.key, required this.onDone});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _ctrl = PageController();
  int _i = 0;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  final _pages = const [
    _Slide(
      icon: Icons.biotech,
      color: Color(AppColors.accentViolet),
      title: 'PCR-grade AI diagnostics',
      body: 'EHP, WSSV, AHPND screen in 30 seconds. On-device TFLite. Works offline.',
    ),
    _Slide(
      icon: Icons.currency_rupee,
      color: Color(AppColors.success),
      title: 'Live mandi pricing',
      body: '31+ species across 9 coastal states. Sell when the price peaks, not when the buyer decides.',
    ),
    _Slide(
      icon: Icons.storefront,
      color: Color(AppColors.accentOrange),
      title: 'Verified marketplace',
      body: 'KYC-checked seed, feed, aeration, ice and diagnostic kits. Escrow protected.',
    ),
    _Slide(
      icon: Icons.language,
      color: Color(AppColors.accentCyan),
      title: 'Your language',
      body: 'English, Telugu, Tamil, Hindi, Odia, Bengali — full UI translation in progress.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: widget.onDone,
                child: const Text('Skip'),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _ctrl,
                onPageChanged: (i) => setState(() => _i = i),
                itemCount: _pages.length,
                itemBuilder: (_, i) => _pages[i],
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_pages.length, (i) {
                final sel = i == _i;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: sel ? 24 : 8,
                  height: 4,
                  decoration: BoxDecoration(
                    color: sel ? const Color(AppColors.primary) : Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                );
              }),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  if (_i > 0)
                    OutlinedButton(
                      onPressed: () => _ctrl.previousPage(
                          duration: const Duration(milliseconds: 250), curve: Curves.easeOut),
                      child: const Text('Back'),
                    ),
                  const Spacer(),
                  FilledButton.icon(
                    onPressed: () {
                      if (_i == _pages.length - 1) {
                        widget.onDone();
                      } else {
                        _ctrl.nextPage(
                            duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
                      }
                    },
                    icon: Icon(_i == _pages.length - 1 ? Icons.check : Icons.arrow_forward),
                    label: Text(_i == _pages.length - 1 ? 'Get started' : 'Next'),
                    style: FilledButton.styleFrom(backgroundColor: const Color(AppColors.primary)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Slide extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String body;
  const _Slide({required this.icon, required this.color, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120, height: 120,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
              border: Border.all(color: color.withOpacity(0.35), width: 2),
            ),
            child: Icon(icon, size: 56, color: color),
          ),
          const SizedBox(height: 32),
          Text(title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Text(body,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade700, height: 1.5)),
        ],
      ),
    );
  }
}
