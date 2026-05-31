import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/auth/auth_viewmodel.dart';
import '../../../core/validation/validators.dart';
import '../model/login_state.dart';

/// All Login business logic lives here. The View only renders state +
/// dispatches actions through this notifier.
class LoginViewModel extends StateNotifier<LoginState> {
  LoginViewModel(this._ref) : super(const LoginState());
  final Ref _ref;

  void setPhone(String v) => state = state.copyWith(phone: v, clearError: true);
  void setOtp(String v)   => state = state.copyWith(otp: v, clearError: true);

  Future<void> sendOtp() async {
    final err = Validators.phoneIN(state.phone);
    if (err != null) { state = state.copyWith(error: err); return; }

    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final e164 = Validators.toPhoneE164(state.phone);
      await _ref.read(authActionsProvider).requestPhoneOtp(e164);
      state = state.copyWith(step: LoginStep.otp, isSubmitting: false);
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to send OTP: ${e.toString()}',
      );
    }
  }

  Future<void> verifyOtp() async {
    final err = Validators.otp6(state.otp);
    if (err != null) { state = state.copyWith(error: err); return; }

    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final e164 = Validators.toPhoneE164(state.phone);
      await _ref.read(authActionsProvider)
          .verifyPhoneOtp(phoneE164: e164, otp: state.otp);
      // authStateProvider stream fires → router redirects away from /login.
      state = state.copyWith(isSubmitting: false);
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        error: 'OTP verification failed: ${e.toString()}',
      );
    }
  }

  void backToPhone() => state = state.copyWith(step: LoginStep.phone, otp: '');
}

final loginViewModelProvider =
    StateNotifierProvider.autoDispose<LoginViewModel, LoginState>(
  LoginViewModel.new,
);
