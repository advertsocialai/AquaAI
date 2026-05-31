import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../model/login_state.dart';
import '../viewmodel/login_viewmodel.dart';

/// Pure View — no business logic. All actions go through the ViewModel.
class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(loginViewModelProvider);
    final vm    = ref.read(loginViewModelProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 380),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.water_drop_outlined, size: 64, color: AppColors.cyan),
                  const SizedBox(height: 16),
                  const Text('Aqua Rudra',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 2,
                          color: AppColors.foreground)),
                  const SizedBox(height: 4),
                  const Text("Sign in with your mobile number",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.foregroundMuted, height: 1.4)),
                  const SizedBox(height: 32),
                  if (state.step == LoginStep.phone) _PhoneStep(state: state, vm: vm),
                  if (state.step == LoginStep.otp)   _OtpStep(state: state, vm: vm),
                  if (state.error != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.danger.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.danger.withValues(alpha: 0.3)),
                      ),
                      child: Text(state.error!,
                          style: const TextStyle(color: AppColors.danger, fontSize: 13)),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PhoneStep extends StatelessWidget {
  const _PhoneStep({required this.state, required this.vm});
  final LoginState state;
  final LoginViewModel vm;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          decoration: const InputDecoration(
            labelText: 'Mobile number',
            prefixText: '+91 ',
            hintText: '98765 43210',
          ),
          keyboardType: TextInputType.phone,
          autofocus: true,
          onChanged: vm.setPhone,
          enabled: !state.isSubmitting,
        ),
        const SizedBox(height: 16),
        FilledButton(
          onPressed: state.isSubmitting ? null : vm.sendOtp,
          child: state.isSubmitting
              ? const SizedBox(
                  height: 18, width: 18,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.background))
              : const Text('Send OTP'),
        ),
      ],
    );
  }
}

class _OtpStep extends StatelessWidget {
  const _OtpStep({required this.state, required this.vm});
  final LoginState state;
  final LoginViewModel vm;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Sent to +91 ${state.phone}',
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.foregroundMuted, fontSize: 13)),
        const SizedBox(height: 16),
        TextField(
          decoration: const InputDecoration(labelText: '6-digit OTP', counterText: ''),
          keyboardType: TextInputType.number,
          maxLength: 6,
          autofocus: true,
          onChanged: vm.setOtp,
          enabled: !state.isSubmitting,
        ),
        const SizedBox(height: 16),
        FilledButton(
          onPressed: state.isSubmitting ? null : vm.verifyOtp,
          child: state.isSubmitting
              ? const SizedBox(
                  height: 18, width: 18,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.background))
              : const Text('Verify & continue'),
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: state.isSubmitting ? null : vm.backToPhone,
          child: const Text('Change number'),
        ),
      ],
    );
  }
}
