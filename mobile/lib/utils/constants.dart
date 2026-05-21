class ApiConfig {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; // Android emulator → localhost
  // For real device on same WiFi: use your Mac's IP, e.g. http://192.168.1.x:8000/api/v1

  // AI model file names (in assets/models/)
  static const String seedCounterModel = 'seed_counter.tflite';
  static const String ehpClassifierModel = 'ehp_classifier.tflite';
  static const String sporeDetectorModel = 'spore_detector.tflite';
  static const String stageClassifierModel = 'stage_classifier.tflite';
  static const String visualHealthModel = 'visual_health.tflite';
}

class AppColors {
  static const int primary = 0xFF1e3a5f;
  static const int accent = 0xFF0ea5e9;
  static const int green = 0xFF22c55e;
  static const int yellow = 0xFFf59e0b;
  static const int red = 0xFFef4444;
  static const int grey = 0xFF94a3b8;
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
