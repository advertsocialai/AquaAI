/// Compile-time env. Pass at build/run time:
///   flutter run \
///     --dart-define=API_BASE=https://api.aquarudra.com/api/v1 \
///     --dart-define=SUPABASE_URL=https://rjhysiqqwgptqiwsonvd.supabase.co \
///     --dart-define=SUPABASE_PUBLISHABLE_KEY=sb_publishable_ffKdBSjZkIBPo-MFWCgB4w_di3tqXL3
class Env {
  Env._();

  static const String apiBase = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'https://api.aquarudra.com/api/v1',
  );

  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://rjhysiqqwgptqiwsonvd.supabase.co',
  );

  static const String supabasePublishableKey = String.fromEnvironment(
    'SUPABASE_PUBLISHABLE_KEY',
    defaultValue: 'sb_publishable_ffKdBSjZkIBPo-MFWCgB4w_di3tqXL3',
  );

  /// `dev` / `preprod` / `prod` — controls log verbosity, dev-only banners, etc.
  static const String appEnv = String.fromEnvironment(
    'APP_ENV',
    defaultValue: 'dev',
  );

  static bool get isProd => appEnv == 'prod';
}
