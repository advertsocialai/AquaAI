import 'package:go_router/go_router.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/home/home_screen.dart';

/// Single source of truth for navigation. Add a `GoRoute` per feature
/// as new screens are built. Path strings mirror the web routes
/// (1:1 mapping with /src/App.tsx) so deep-links round-trip.
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (_, __) => const SplashScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (_, __) => const HomeScreen(),
    ),
    // Future routes (one per pic the user sends):
    // GoRoute(path: '/login',     builder: (_, __) => const LoginScreen()),
    // GoRoute(path: '/signup',    builder: (_, __) => const SignupScreen()),
    // GoRoute(path: '/farmer',    builder: (_, __) => const FarmerDashboardScreen()),
    // GoRoute(path: '/aquaai',    builder: (_, __) => const PlatformScreen()),
    // GoRoute(path: '/knowledge', builder: (_, __) => const KnowledgeScreen()),
    // GoRoute(path: '/about',     builder: (_, __) => const AboutScreen()),
    // GoRoute(path: '/careers',   builder: (_, __) => const CareersScreen()),
    // GoRoute(path: '/contact',   builder: (_, __) => const ContactScreen()),
    // GoRoute(path: '/privacy',   builder: (_, __) => const PrivacyScreen()),
    // GoRoute(path: '/terms',     builder: (_, __) => const TermsScreen()),
    // GoRoute(path: '/kyc',       builder: (_, __) => const KycScreen()),
    // GoRoute(path: '/settings',  builder: (_, __) => const SettingsScreen()),
    // GoRoute(path: '/verify/:certId',
    //         builder: (_, s) => VerifyScreen(certificateId: s.pathParameters['certId']!)),
  ],
);
