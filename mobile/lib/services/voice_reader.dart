/// Global text-to-speech voice reader. Matches the web `VoiceReader`.
///
/// Pattern: each screen calls `voiceReader.setActive(text)` in initState
/// (or whenever its content changes). The global `VoiceFab` reads
/// `voiceReader.activeText.value` in the user's chosen language.
///
/// BCP-47 mapping:
///   en → en-IN   te → te-IN   ta → ta-IN
///   hi → hi-IN   od → or-IN   bn → bn-IN
///
/// On Android: Google TTS handles en-IN, hi-IN out of the box; te/ta/bn
/// need the Indic voice pack (Settings → Accessibility → TTS output).
/// On iOS: Siri voices cover en-IN, hi-IN. Other Indic locales fall back
/// to en-IN with a console warning rather than failing silently.
import 'package:flutter/foundation.dart';
import 'package:flutter_tts/flutter_tts.dart';

enum VoiceState { idle, speaking, paused }

class VoiceReader {
  VoiceReader._();
  static final VoiceReader instance = VoiceReader._();

  final FlutterTts _tts = FlutterTts();
  final ValueNotifier<VoiceState> state = ValueNotifier(VoiceState.idle);
  final ValueNotifier<String> activeText = ValueNotifier('');
  String _lang = 'en';

  static const Map<String, String> _langMap = {
    'en': 'en-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'hi': 'hi-IN',
    'od': 'or-IN',
    'bn': 'bn-IN',
  };

  bool _initialized = false;

  Future<void> _ensureInit() async {
    if (_initialized) return;
    _initialized = true;
    _tts.setStartHandler(() => state.value = VoiceState.speaking);
    _tts.setCompletionHandler(() => state.value = VoiceState.idle);
    _tts.setCancelHandler(() => state.value = VoiceState.idle);
    _tts.setPauseHandler(() => state.value = VoiceState.paused);
    _tts.setContinueHandler(() => state.value = VoiceState.speaking);
    _tts.setErrorHandler((msg) {
      debugPrint('VoiceReader error: $msg');
      state.value = VoiceState.idle;
    });
    await _tts.awaitSpeakCompletion(true);
  }

  /// Register the text the current screen wants read aloud.
  /// Called from each screen's initState / didChangeDependencies.
  void setActive(String text) {
    activeText.value = text.trim();
  }

  /// Set the active language code (en/te/ta/hi/od/bn).
  void setLanguage(String code) {
    _lang = _langMap.containsKey(code) ? code : 'en';
  }

  String get currentLanguage => _lang;

  Future<void> start() async {
    if (activeText.value.isEmpty) return;
    await _ensureInit();
    await _tts.stop();
    final locale = _langMap[_lang] ?? 'en-IN';
    try {
      await _tts.setLanguage(locale);
    } catch (_) {
      debugPrint('VoiceReader: locale $locale not installed, falling back to en-IN');
      await _tts.setLanguage('en-IN');
    }
    await _tts.setSpeechRate(0.45);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
    await _tts.speak(activeText.value);
  }

  Future<void> pause() async {
    await _ensureInit();
    await _tts.pause();
    state.value = VoiceState.paused;
  }

  Future<void> resume() async {
    await _ensureInit();
    // flutter_tts can't always resume reliably — restart from the active text.
    await _tts.speak(activeText.value);
  }

  Future<void> stop() async {
    await _ensureInit();
    await _tts.stop();
    state.value = VoiceState.idle;
  }

  /// Convenience for one-shot speech (existing article screen, chat replies).
  Future<void> speak(String text, {String langCode = 'en'}) async {
    setActive(text);
    setLanguage(langCode);
    await start();
  }

  bool get isSpeaking => state.value == VoiceState.speaking;
}

final voiceReader = VoiceReader.instance;
