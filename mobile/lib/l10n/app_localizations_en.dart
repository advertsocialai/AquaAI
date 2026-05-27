// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppL10nEn extends AppL10n {
  AppL10nEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Aqua AI';

  @override
  String get appTagline => 'Decoding aquaculture, one pond at a time';

  @override
  String get navHome => 'Home';

  @override
  String get navPricing => 'Pricing';

  @override
  String get navMarketplace => 'Market';

  @override
  String get navAdvisory => 'Advisory';

  @override
  String get navMore => 'More';

  @override
  String get actionSignIn => 'Sign in';

  @override
  String get actionSignUp => 'Create account';

  @override
  String get actionContinue => 'Continue';

  @override
  String get actionRetry => 'Retry';

  @override
  String get actionRunInference => 'Run AI inference';

  @override
  String get diagSeedCounter => 'Seed Counter';

  @override
  String get diagDiseaseDetector => 'Disease Detector';

  @override
  String get diagQualityGrader => 'Quality Grader';

  @override
  String get diagPlStage => 'PL Stage Classifier';

  @override
  String get diagStress => 'Stress Forecaster';

  @override
  String get captureCamera => 'Camera';

  @override
  String get captureGallery => 'Gallery';

  @override
  String get settingsLanguage => 'Language';

  @override
  String get settingsTheme => 'Theme';

  @override
  String get settingsSignOut => 'Sign out';

  @override
  String get askAquaAI => 'Ask Aqua AI';

  @override
  String get loading => 'Loading…';

  @override
  String get errorNetwork => 'Network error. Pull to retry.';
}
