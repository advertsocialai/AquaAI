import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_viewmodel.dart';
import '../supabase/supabase_client.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/auth/view/login_screen.dart';

/// Single source of truth for navigation. Paths mirror the web routes
/// (1:1 with /src/App.tsx) so deep-links round-trip across surfaces.
///
/// Listens to authStateProvider so when the user signs in we kick
/// them off /login automatically (and vice-versa).
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: AuthRefresh(ref),
    redirect: (context, state) {
      final loggedIn = sb.auth.currentSession != null;
      final path = state.matchedLocation;

      // Routes that don't need auth
      const publicPaths = {'/', '/login', '/signup', '/forgot-password'};
      final goingPublic = publicPaths.contains(path);

      // Bounce unauthenticated users back to /login when they hit a
      // protected route. We let /home through as a public landing.
      if (!loggedIn && !goingPublic && path.startsWith('/farmer')) {
        return '/login?redirect=$path';
      }

      // If they're already signed in, don't show them /login.
      if (loggedIn && path == '/login') {
        return '/home';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/',      builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/home',  builder: (_, _) => const HomeScreen()),
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      // Add more here per design pic:
      // GoRoute(path: '/signup',    builder: (_, _) => const SignupScreen()),
      // GoRoute(path: '/farmer',    builder: (_, _) => const FarmerDashboardScreen()),
      // GoRoute(path: '/aquaai',    builder: (_, _) => const PlatformScreen()),
      // GoRoute(path: '/knowledge', builder: (_, _) => const KnowledgeScreen()),
      // GoRoute(path: '/about',     builder: (_, _) => const AboutScreen()),
      // GoRoute(path: '/careers',   builder: (_, _) => const CareersScreen()),
      // GoRoute(path: '/contact',   builder: (_, _) => const ContactScreen()),
      // GoRoute(path: '/privacy',   builder: (_, _) => const PrivacyScreen()),
      // GoRoute(path: '/terms',     builder: (_, _) => const TermsScreen()),
      // GoRoute(path: '/kyc',       builder: (_, _) => const KycScreen()),
      // GoRoute(path: '/settings',  builder: (_, _) => const SettingsScreen()),
      // GoRoute(path: '/verify/:certId',
      //   builder: (_, s) => VerifyScreen(certificateId: s.pathParameters['certId']!)),
    ],
  );
});

/// Bridges Riverpod's authStateProvider into GoRouter's refreshListenable
/// so changes in auth state trigger a route re-evaluation.
class AuthRefresh extends ChangeNotifier {
  AuthRefresh(Ref ref) {
    ref.listen(authStateProvider, (_, _) => notifyListeners());
  }
}
