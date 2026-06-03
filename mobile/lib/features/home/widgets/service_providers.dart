import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'section_header.dart';

class _Provider {
  const _Provider(this.icon, this.accent, this.title, this.desc);
  final IconData icon;
  final Color accent;
  final String title;
  final String desc;
}

const List<_Provider> _providers = [
  _Provider(
    Icons.local_shipping_outlined,
    Color(0xFFF97316), // orange
    'Transporters',
    'Move live seed, broodstock and harvest safely — on time, in the '
        'right conditions.',
  ),
  _Provider(
    Icons.science_outlined,
    AppColors.cyan, // sky
    'Lab & Equipment',
    'PCR/EHP screening, water tests, kit rentals and equipment to buy.',
  ),
  _Provider(
    Icons.air,
    Color(0xFF8B5CF6), // violet
    'Oxygen Supply',
    'Liquid oxygen, cylinders, aerators and emergency oxygen for your ponds.',
  ),
  _Provider(
    Icons.inventory_2_outlined,
    Color(0xFFF59E0B), // amber
    'Resources / Inputs',
    'Feed, probiotics, lime & minerals, liners and other pond inputs.',
  ),
];

/// Service providers section — four cards each with a "Submit request"
/// button that posts a SnackBar (request flow not wired into mobile yet).
class ServiceProviders extends StatelessWidget {
  const ServiceProviders({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SectionHeader(
          eyebrow: 'Supply chain',
          title: 'Service providers that keep the chain moving',
        ),
        const SizedBox(height: 20),
        for (var i = 0; i < _providers.length; i++) ...[
          _ProviderCard(provider: _providers[i]),
          if (i != _providers.length - 1) const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class _ProviderCard extends StatelessWidget {
  const _ProviderCard({required this.provider});
  final _Provider provider;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: provider.accent.withValues(alpha: 0.13),
                  borderRadius: BorderRadius.circular(12),
                  border:
                      Border.all(color: provider.accent.withValues(alpha: 0.33)),
                ),
                child: Icon(provider.icon, size: 22, color: provider.accent),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  provider.title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.foreground,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            provider.desc,
            style: const TextStyle(
              fontSize: 13,
              height: 1.45,
              color: AppColors.foregroundMuted,
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                ScaffoldMessenger.of(context)
                  ..hideCurrentSnackBar()
                  ..showSnackBar(
                    const SnackBar(content: Text('Request sent')),
                  );
              },
              style: FilledButton.styleFrom(
                backgroundColor: provider.accent,
                foregroundColor: Colors.white,
              ),
              child: const Text('Submit request'),
            ),
          ),
        ],
      ),
    );
  }
}
