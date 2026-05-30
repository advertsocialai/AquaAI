/// Aqua AI mobile app constants.

class ApiConfig {
  /// Base URL for the Aqua AI backend.
  /// Default points at the live prod backend so any APK works out of the box.
  /// Local dev override:
  ///   --dart-define=API_BASE=http://10.0.2.2:8000/api/v1     (Android emulator)
  ///   --dart-define=API_BASE=http://192.168.x.y:8000/api/v1  (real device on Wi-Fi)
  static const String baseUrl = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'https://api.aquarudra.com/api/v1',
  );

  // Local TFLite asset paths (bundled with the app for offline inference).
  static const String seedCounterModel = 'seed_counter.tflite';
  static const String ehpClassifierModel = 'ehp_classifier.tflite';
  static const String sporeDetectorModel = 'spore_detector.tflite';
  static const String stageClassifierModel = 'stage_classifier.tflite';
  static const String visualHealthModel = 'visual_health.tflite';
}

/// Aqua AI brand colors — matches the web dashboard.
class AppColors {
  static const int primary       = 0xFF0B5394;  // deep blue
  static const int primarySoft   = 0xFF2E75B6;  // primary lighter
  static const int accentCyan    = 0xFF38BDF8;
  static const int accentViolet  = 0xFFA78BFA;
  static const int accentOrange  = 0xFFFB923C;
  static const int success       = 0xFF22C55E;
  static const int warning       = 0xFFF59E0B;
  static const int danger        = 0xFFEF4444;
  static const int grey          = 0xFF94A3B8;

  // legacy aliases used by existing screens — keep working
  static const int accent = accentCyan;
  static const int green  = success;
  static const int yellow = warning;
  static const int red    = danger;
}

class MortalityThresholds {
  static const double greenMax = 3.0;
  static const double yellowMax = 5.0;
}

class CVThresholds {
  static const double excellent = 10.0;
  static const double acceptable = 20.0;
  static const double escalate = 25.0;
}

class EHPThresholds {
  static const double hardFail = 0.85;
  static const double suspected = 0.55;
}

class QualityGradeThresholds {
  static const double premium = 85.0;
  static const double good = 70.0;
  static const double conditional = 55.0;
  static const double caution = 40.0;
}

class AppInfo {
  static const String appName = 'Aqua Rudra';
  static const String tagline = 'Decoding aquaculture, one pond at a time';
  static const String supportEmail = 'info@aquarudra.com';
  static const String supportPhone = '+91 95532 82325';
  static const String websiteUrl = 'https://aquarudra.com';
  static const String version = '1.0.0';
}
