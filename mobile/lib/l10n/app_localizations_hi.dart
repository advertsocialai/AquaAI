// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppL10nHi extends AppL10n {
  AppL10nHi([String locale = 'hi']) : super(locale);

  @override
  String get appName => 'एक्वा AI';

  @override
  String get appTagline => 'एक्वाकल्चर को डिकोड कर रहे हैं, एक तालाब के बाद एक';

  @override
  String get navHome => 'होम';

  @override
  String get navPricing => 'मूल्य';

  @override
  String get navMarketplace => 'मार्केट';

  @override
  String get navAdvisory => 'सलाह';

  @override
  String get navMore => 'अधिक';

  @override
  String get actionSignIn => 'साइन इन';

  @override
  String get actionSignUp => 'खाता बनाएं';

  @override
  String get actionContinue => 'जारी रखें';

  @override
  String get actionRetry => 'पुनः प्रयास';

  @override
  String get actionRunInference => 'AI जांच चलाएं';

  @override
  String get diagSeedCounter => 'सीड काउंटर';

  @override
  String get diagDiseaseDetector => 'रोग डिटेक्टर';

  @override
  String get diagQualityGrader => 'गुणवत्ता ग्रेडर';

  @override
  String get diagPlStage => 'PL स्टेज क्लासिफायर';

  @override
  String get diagStress => 'स्ट्रेस फोरकास्टर';

  @override
  String get captureCamera => 'कैमरा';

  @override
  String get captureGallery => 'गैलरी';

  @override
  String get settingsLanguage => 'भाषा';

  @override
  String get settingsTheme => 'थीम';

  @override
  String get settingsSignOut => 'साइन आउट';

  @override
  String get askAquaAI => 'एक्वा AI से पूछें';

  @override
  String get loading => 'लोड हो रहा है…';

  @override
  String get errorNetwork => 'नेटवर्क त्रुटि। पुनः प्रयास के लिए खींचें।';
}
