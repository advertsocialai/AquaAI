import 'package:flutter/material.dart';

/// Aqua Rudra brand palette — mirrors the web app's CSS tokens
/// (see src/index.css and tailwind.config.ts on the web side).
class AppColors {
  AppColors._();

  // Surfaces — deep ocean navy (web: --background 215 50% 7%)
  static const Color background = Color(0xFF0A111F);
  static const Color card       = Color(0xFF13202F);
  static const Color border     = Color(0x1AFFFFFF); // white at 10% opacity

  // Text
  static const Color foreground       = Color(0xFFFFFFFF);
  static const Color foregroundMuted  = Color(0xB3FFFFFF); // 70%
  static const Color foregroundFaint  = Color(0x80FFFFFF); // 50%

  // Brand accents
  static const Color cyan       = Color(0xFF0EA5E9); // sky-500 — primary brand
  static const Color cyanLight  = Color(0xFF38BDF8); // sky-400
  static const Color cyanDeep   = Color(0xFF0369A1); // sky-700

  // Gold — used on the trident binding
  static const Color gold       = Color(0xFFF59E0B); // amber-500
  static const Color goldLight  = Color(0xFFFBBF24); // amber-400

  // Semantic
  static const Color success = Color(0xFF10B981); // emerald-500
  static const Color warning = Color(0xFFF59E0B); // amber-500
  static const Color danger  = Color(0xFFEF4444); // red-500
}
