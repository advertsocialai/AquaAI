import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

/// Shared centered eyebrow + title (+ optional subtitle) used across the
/// home sections to mirror the web's section heading style.
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.eyebrow,
    required this.title,
    this.subtitle,
    this.center = true,
  });

  final String eyebrow;
  final String title;
  final String? subtitle;
  final bool center;

  @override
  Widget build(BuildContext context) {
    final align = center ? CrossAxisAlignment.center : CrossAxisAlignment.start;
    final textAlign = center ? TextAlign.center : TextAlign.start;

    return Column(
      crossAxisAlignment: align,
      children: [
        Text(
          eyebrow.toUpperCase(),
          textAlign: textAlign,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            letterSpacing: 2,
            color: AppColors.cyanLight,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          textAlign: textAlign,
          style: const TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            height: 1.15,
            color: AppColors.foreground,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 10),
          Text(
            subtitle!,
            textAlign: textAlign,
            style: const TextStyle(
              fontSize: 15,
              height: 1.5,
              color: AppColors.foregroundMuted,
            ),
          ),
        ],
      ],
    );
  }
}
