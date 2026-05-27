import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../utils/constants.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _push = true;
  bool _sms = true;
  bool _whatsapp = true;
  bool _email = false;
  String _language = 'తెలుగు (Telugu)';
  String _theme = 'System';
  bool _ready = false;

  static const _languages = [
    'English',
    'తెలుగు (Telugu)',
    'தமிழ் (Tamil)',
    'हिन्दी (Hindi)',
    'ଓଡ଼ିଆ (Odia)',
    'বাংলা (Bengali)',
  ];

  static const _kPush = 'settings.push';
  static const _kSms = 'settings.sms';
  static const _kWa = 'settings.whatsapp';
  static const _kEmail = 'settings.email';
  static const _kLang = 'settings.language';
  static const _kTheme = 'settings.theme';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(() {
      _push = p.getBool(_kPush) ?? true;
      _sms = p.getBool(_kSms) ?? true;
      _whatsapp = p.getBool(_kWa) ?? true;
      _email = p.getBool(_kEmail) ?? false;
      final savedLang = p.getString(_kLang);
      _language = (savedLang != null && _languages.contains(savedLang))
          ? savedLang
          : _language;
      final savedTheme = p.getString(_kTheme);
      _theme = (savedTheme != null && const ['System', 'Light', 'Dark'].contains(savedTheme))
          ? savedTheme
          : _theme;
      _ready = true;
    });
  }

  Future<void> _setBool(String key, bool value, void Function(bool) apply) async {
    apply(value);
    setState(() {});
    final p = await SharedPreferences.getInstance();
    await p.setBool(key, value);
  }

  Future<void> _setString(String key, String value, void Function(String) apply) async {
    apply(value);
    setState(() {});
    final p = await SharedPreferences.getInstance();
    await p.setString(key, value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const _SectionHeader(label: 'Preferences'),
          ListTile(
            leading: const Icon(Icons.language),
            title: const Text('Language'),
            subtitle: Text(_language),
            onTap: () => _pickLanguage(),
          ),
          ListTile(
            leading: const Icon(Icons.brightness_6),
            title: const Text('Theme'),
            subtitle: Text(_theme),
            onTap: () => _pickTheme(),
          ),
          const Divider(height: 1),
          const _SectionHeader(label: 'Notifications'),
          SwitchListTile(
            value: _push,
            onChanged: (v) => _setBool(_kPush, v, (b) => _push = b),
            secondary: const Icon(Icons.notifications_outlined),
            title: const Text('Push notifications'),
          ),
          SwitchListTile(
            value: _sms,
            onChanged: (v) => _setBool(_kSms, v, (b) => _sms = b),
            secondary: const Icon(Icons.sms_outlined),
            title: const Text('SMS alerts'),
          ),
          SwitchListTile(
            value: _whatsapp,
            onChanged: (v) => _setBool(_kWa, v, (b) => _whatsapp = b),
            secondary: const Icon(Icons.chat_outlined),
            title: const Text('WhatsApp updates'),
          ),
          SwitchListTile(
            value: _email,
            onChanged: (v) => _setBool(_kEmail, v, (b) => _email = b),
            secondary: const Icon(Icons.email_outlined),
            title: const Text('Email digest'),
          ),
          const Divider(height: 1),
          const _SectionHeader(label: 'Data'),
          ListTile(
            leading: const Icon(Icons.sync),
            title: const Text('Sync now'),
            subtitle: const Text('Last synced 12 min ago'),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.download_outlined),
            title: const Text('Download offline pack'),
            subtitle: const Text('Pricing + outbreak alerts · 4.2 MB'),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.cleaning_services_outlined),
            title: const Text('Clear cached images'),
            subtitle: const Text('184 MB'),
            onTap: () {},
          ),
          const Divider(height: 1),
          const _SectionHeader(label: 'About'),
          ListTile(
            leading: const Icon(Icons.info_outline),
            title: const Text('Version'),
            subtitle: const Text('${AppInfo.appName} ${AppInfo.version} (build 142)'),
          ),
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined),
            title: const Text('Privacy policy'),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.description_outlined),
            title: const Text('Terms of service'),
            onTap: () {},
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Sign out', style: TextStyle(color: Colors.red)),
            onTap: () {},
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  void _pickLanguage() {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: _languages
              .map((l) => RadioListTile<String>(
                    value: l,
                    groupValue: _language,
                    title: Text(l),
                    onChanged: (v) {
                      if (v != null) {
                        _setString(_kLang, v, (s) => _language = s);
                      }
                      Navigator.pop(context);
                    },
                  ))
              .toList(),
        ),
      ),
    );
  }

  void _pickTheme() {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: ListView(
          shrinkWrap: true,
          children: ['System', 'Light', 'Dark']
              .map((t) => RadioListTile<String>(
                    value: t,
                    groupValue: _theme,
                    title: Text(t),
                    onChanged: (v) {
                      if (v != null) {
                        _setString(_kTheme, v, (s) => _theme = s);
                      }
                      Navigator.pop(context);
                    },
                  ))
              .toList(),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: Colors.grey.shade600,
          letterSpacing: 1.5,
        ),
      ),
    );
  }
}
