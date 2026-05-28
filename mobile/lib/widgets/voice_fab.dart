import 'package:flutter/material.dart';
import '../services/voice_reader.dart';
import '../utils/constants.dart';

/// Floating bubble that reads the active screen's text in the active
/// language. Hidden when no screen has registered any text.
class VoiceFab extends StatelessWidget {
  const VoiceFab({super.key});

  static const _langs = [
    ('en', 'English'),
    ('te', 'తెలుగు'),
    ('ta', 'தமிழ்'),
    ('hi', 'हिन्दी'),
    ('od', 'ଓଡ଼ିଆ'),
    ('bn', 'বাংলা'),
  ];

  void _pickLanguage(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('Read in language',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
            ..._langs.map((l) => RadioListTile<String>(
              value: l.$1,
              groupValue: voiceReader.currentLanguage,
              title: Text(l.$2),
              onChanged: (v) {
                if (v != null) voiceReader.setLanguage(v);
                Navigator.pop(context);
              },
            )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String>(
      valueListenable: voiceReader.activeText,
      builder: (_, text, __) {
        if (text.isEmpty) return const SizedBox.shrink();
        return ValueListenableBuilder<VoiceState>(
          valueListenable: voiceReader.state,
          builder: (_, state, __) => _bubble(context, state),
        );
      },
    );
  }

  Widget _bubble(BuildContext context, VoiceState state) {
    if (state == VoiceState.idle) {
      return GestureDetector(
        onLongPress: () => _pickLanguage(context),
        child: FloatingActionButton.extended(
          heroTag: 'voice-fab',
          backgroundColor: const Color(AppColors.accentCyan),
          foregroundColor: Colors.black,
          onPressed: voiceReader.start,
          icon: const Icon(Icons.volume_up),
          label: const Text('Read aloud'),
        ),
      );
    }
    return Material(
      color: const Color(AppColors.accentCyan),
      borderRadius: BorderRadius.circular(32),
      elevation: 6,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(
            tooltip: state == VoiceState.paused ? 'Resume' : 'Pause',
            icon: Icon(state == VoiceState.paused ? Icons.play_arrow : Icons.pause),
            onPressed: state == VoiceState.paused ? voiceReader.resume : voiceReader.pause,
          ),
          IconButton(
            tooltip: 'Stop',
            icon: const Icon(Icons.stop),
            onPressed: voiceReader.stop,
          ),
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: Text(
              state == VoiceState.paused ? 'Paused' : 'Reading',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ]),
      ),
    );
  }
}

/// Per-screen mixin: call `registerReadable(text)` in initState (or
/// whenever the content changes) so the global `VoiceFab` knows what to
/// read.
mixin VoiceReadableScreen<T extends StatefulWidget> on State<T> {
  void registerReadable(String text) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      voiceReader.setActive(text);
    });
  }

  @override
  void deactivate() {
    voiceReader.setActive('');
    voiceReader.stop();
    super.deactivate();
  }
}
