/// Pure data class — what the View renders for the Login screen.
class LoginState {
  const LoginState({
    this.step = LoginStep.phone,
    this.phone = '',
    this.otp = '',
    this.isSubmitting = false,
    this.error,
  });

  final LoginStep step;
  final String phone;
  final String otp;
  final bool isSubmitting;
  final String? error;

  LoginState copyWith({
    LoginStep? step,
    String? phone,
    String? otp,
    bool? isSubmitting,
    String? error,
    bool clearError = false,
  }) {
    return LoginState(
      step: step ?? this.step,
      phone: phone ?? this.phone,
      otp: otp ?? this.otp,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

enum LoginStep { phone, otp }
