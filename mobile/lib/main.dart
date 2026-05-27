import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/api_service.dart';
import 'services/ai_service.dart';
import 'services/sync_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'utils/constants.dart';
import 'widgets/voice_fab.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Firebase: tolerates missing google-services.json / GoogleService-Info.plist
  // so the app still boots on a clean checkout. Push + analytics activate
  // automatically once the platform config files are dropped in.
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase init skipped (no platform config): $e');
  }
  apiService.init();
  await aiService.loadModels();
  syncService.startAutoSync();
  runApp(const ProviderScope(child: AquaAIApp()));
}

class AquaAIApp extends StatelessWidget {
  const AquaAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppInfo.appName,
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(Brightness.light),
      darkTheme: _buildTheme(Brightness.dark),
      themeMode: ThemeMode.system,
      // Localisation — language strings live in lib/l10n/app_*.arb.
      // gen-l10n synthesises the delegate when `flutter pub get` runs.
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'),
        Locale('te'),
        Locale('ta'),
        Locale('hi'),
        Locale('or'),
        Locale('bn'),
      ],
      // Wrap every route with a Stack that includes the global VoiceFab.
      // The FAB hides itself when no screen has registered any readable
      // text, so the seed-counter capture screen stays clean.
      builder: (context, child) {
        return Stack(
          children: [
            child ?? const SizedBox.shrink(),
            const Positioned(
              right: 16,
              bottom: 88,           // sits above the bottom navigation bar
              child: VoiceFab(),
            ),
          ],
        );
      },
      home: const AuthGate(),
    );
  }

  static ThemeData _buildTheme(Brightness brightness) {
    final cs = ColorScheme.fromSeed(
      seedColor: const Color(AppColors.primary),
      brightness: brightness,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: cs,
      appBarTheme: AppBarTheme(
        backgroundColor:
            brightness == Brightness.dark ? Colors.black : const Color(AppColors.primary),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.3,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: const Color(AppColors.primary),
          foregroundColor: Colors.white,
          minimumSize: const Size(0, 44),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(AppColors.primary),
          minimumSize: const Size(0, 44),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      chipTheme: ChipThemeData(
        selectedColor: const Color(AppColors.primary).withOpacity(0.15),
        side: BorderSide(color: Colors.grey.shade300),
      ),
      cardTheme: const CardThemeData(elevation: 0),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  bool _checking = true;
  bool _isLoggedIn = false;
  bool _needsOnboarding = false;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final prefs = await SharedPreferences.getInstance();
    final seenOnboarding = prefs.getBool('aquaai.onboarding.seen') ?? false;
    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    setState(() {
      _needsOnboarding = !seenOnboarding;
      _isLoggedIn = false;
      _checking = false;
    });
  }

  Future<void> _finishOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('aquaai.onboarding.seen', true);
    if (!mounted) return;
    setState(() => _needsOnboarding = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_checking) return const SplashScreen();
    if (_needsOnboarding) return OnboardingScreen(onDone: _finishOnboarding);
    return _isLoggedIn ? const HomeScreen() : const LoginScreen();
  }
}
