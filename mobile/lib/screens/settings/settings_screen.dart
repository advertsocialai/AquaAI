import 'package:flutter/material.dart';
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

  static const _languages = [
    'English',
    'తెలుగు (Telugu)',
    'தமிழ் (Tamil)',
    'हिन्दी (Hindi)',
    'ଓଡ଼ିଆ (Odia)',
    'বাংলা (Bengali)',
  ];

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
            onChanged: (v) => setState(() => _push = v),
            secondary: const Icon(Icons.notifications_outlined),
            title: const Text('Push notifications'),
          ),
          SwitchListTile(
            value: _sms,
            onChanged: (v) => setState(() => _sms = v),
            secondary: const Icon(Icons.sms_outlined),
            title: const Text('SMS alerts'),
          ),
          SwitchListTile(
            value: _whatsapp,
            onChanged: (v) => setState(() => _whatsapp = v),
            secondary: const Icon(Icons.chat_outlined),
            title: const Text('WhatsApp updates'),
          ),
          SwitchListTile(
            value: _email,
            onChanged: (v) => setState(() => _email = v),
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
                      setState(() => _language = v ?? _language);
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
                      setState(() => _theme = v ?? _theme);
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
