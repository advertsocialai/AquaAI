// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Tamil (`ta`).
class AppL10nTa extends AppL10n {
  AppL10nTa([String locale = 'ta']) : super(locale);

  @override
  String get appName => 'அக்வா AI';

  @override
  String get appTagline =>
      'ஒரு குளம் தோறும் நீர்வாழ் வேளாண்மையை டிகோட் செய்கிறோம்';

  @override
  String get navHome => 'முகப்பு';

  @override
  String get navPricing => 'விலை';

  @override
  String get navMarketplace => 'சந்தை';

  @override
  String get navAdvisory => 'ஆலோசனை';

  @override
  String get navMore => 'மேலும்';

  @override
  String get actionSignIn => 'உள்நுழைய';

  @override
  String get actionSignUp => 'கணக்கை உருவாக்கு';

  @override
  String get actionContinue => 'தொடரவும்';

  @override
  String get actionRetry => 'மீண்டும் முயற்சி';

  @override
  String get actionRunInference => 'AI முடிவை இயக்கு';

  @override
  String get diagSeedCounter => 'விதை எண்ணி';

  @override
  String get diagDiseaseDetector => 'நோய் கண்டறிதல்';

  @override
  String get diagQualityGrader => 'தர மதிப்பீடு';

  @override
  String get diagPlStage => 'PL நிலை வகைப்படுத்தி';

  @override
  String get diagStress => 'மன அழுத்த முன்னறிவிப்பு';

  @override
  String get captureCamera => 'கேமரா';

  @override
  String get captureGallery => 'கேலரி';

  @override
  String get settingsLanguage => 'மொழி';

  @override
  String get settingsTheme => 'தீம்';

  @override
  String get settingsSignOut => 'வெளியேறு';

  @override
  String get askAquaAI => 'அக்வா AI யிடம் கேள்';

  @override
  String get loading => 'ஏற்றப்படுகிறது…';

  @override
  String get errorNetwork => 'பிணைய பிழை. மீண்டும் முயற்சிக்க இழுக்கவும்.';
}
