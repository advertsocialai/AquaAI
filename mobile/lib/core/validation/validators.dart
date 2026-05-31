/// Form validators — pure functions returning `null` when the value
/// is valid, or a user-facing message string when it isn't. They
/// drop straight into `TextFormField.validator: Validators.email`.
class Validators {
  Validators._();

  static String? required(String? v, {String field = 'This field'}) {
    if (v == null || v.trim().isEmpty) return '$field is required';
    return null;
  }

  // Matches the DB-level CHECK on newsletter_subscribers + signup tables.
  static final _emailRe = RegExp(r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
  static String? email(String? v) {
    final t = (v ?? '').trim().toLowerCase();
    if (t.isEmpty) return 'Email is required';
    if (t.length > 254) return 'Email is too long';
    if (!_emailRe.hasMatch(t)) return 'Enter a valid email';
    return null;
  }

  /// Accepts +91 9876543210, 09876543210, or just 9876543210 — normalises.
  static final _phoneDigits = RegExp(r'[^0-9]');
  static String? phoneIN(String? v) {
    final digits = (v ?? '').replaceAll(_phoneDigits, '');
    final national = digits.startsWith('91') && digits.length == 12
        ? digits.substring(2)
        : digits.startsWith('0') ? digits.substring(1) : digits;
    if (national.length != 10) return 'Enter a 10-digit Indian mobile';
    if (!RegExp(r'^[6-9]').hasMatch(national)) return 'Must start with 6-9';
    return null;
  }

  /// Returns +91XXXXXXXXXX from any of the above input forms; throws
  /// if the input is invalid. Pair with `phoneIN` validator first.
  static String toPhoneE164(String input) {
    final digits = input.replaceAll(_phoneDigits, '');
    final national = digits.startsWith('91') && digits.length == 12
        ? digits.substring(2)
        : digits.startsWith('0') ? digits.substring(1) : digits;
    if (national.length != 10) {
      throw ArgumentError('phone must be 10 digits, got "$input"');
    }
    return '+91$national';
  }

  static String? otp6(String? v) {
    final t = (v ?? '').trim();
    if (t.isEmpty) return 'OTP is required';
    if (!RegExp(r'^\d{6}$').hasMatch(t)) return '6-digit code';
    return null;
  }

  static String? minLength(String? v, int n, {String field = 'Value'}) {
    if ((v ?? '').length < n) return '$field needs at least $n characters';
    return null;
  }
}
