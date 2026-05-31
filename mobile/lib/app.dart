import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

class AquaRudraApp extends ConsumerWidget {
  const AquaRudraApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'Aqua Rudra',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      routerConfig: appRouter,

      // 6 Indian languages — mirrors the web /src/locales/* set.
      // Strings live in lib/l10n/*.arb and get codegen'd at build time
      // (pubspec.yaml has `generate: true`).
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'),
        Locale('hi'),
        Locale('ta'),
        Locale('te'),
        Locale('or'),   // Odia
        Locale('bn'),
      ],
    );
  }
}
