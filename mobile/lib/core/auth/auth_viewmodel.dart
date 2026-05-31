import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../supabase/supabase_client.dart';

/// Live Supabase auth state. Anyone who watches this provider
/// re-renders when a user signs in / signs out / token refreshes.
final authStateProvider = StreamProvider<AuthState>((ref) {
  return sb.auth.onAuthStateChange;
});

/// True when there's a non-expired session.
final isAuthedProvider = Provider<bool>((ref) {
  ref.watch(authStateProvider);
  return sb.auth.currentSession != null;
});

final currentUserProvider = Provider<User?>((ref) {
  ref.watch(authStateProvider);
  return sb.auth.currentUser;
});

/// Thin wrapper over Supabase auth calls. Use from screens as
/// `ref.read(authActionsProvider).signInWithOtp(phone: ...)`.
final authActionsProvider = Provider<AuthActions>((ref) => AuthActions(ref));

class AuthActions {
  AuthActions(this.ref);
  final Ref ref;

  /// Send a 6-digit OTP to a +91 mobile number.
  Future<void> requestPhoneOtp(String phoneE164) async {
    await sb.auth.signInWithOtp(phone: phoneE164);
  }

  /// Verify the 6-digit OTP and obtain a session.
  Future<AuthResponse> verifyPhoneOtp({
    required String phoneE164,
    required String otp,
  }) {
    return sb.auth.verifyOTP(
      type: OtpType.sms,
      phone: phoneE164,
      token: otp,
    );
  }

  /// Send a magic-link OTP to email (fallback when SMS isn't available).
  Future<void> requestEmailOtp(String email) async {
    await sb.auth.signInWithOtp(email: email);
  }

  Future<AuthResponse> verifyEmailOtp({
    required String email,
    required String otp,
  }) {
    return sb.auth.verifyOTP(
      type: OtpType.email,
      email: email,
      token: otp,
    );
  }

  Future<void> signOut() => sb.auth.signOut();
}
