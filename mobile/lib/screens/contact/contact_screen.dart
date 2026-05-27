import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen>
    with VoiceReadableScreen {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _msg = TextEditingController();
  bool _sent = false;

  @override
  void initState() {
    super.initState();
    registerReadable(
      "We're here to help. Get in touch. Question, feedback or "
      'partnership — our team replies within 24 hours. '
      'Call us at ${AppInfo.supportPhone}. Email ${AppInfo.supportEmail}. '
      'WhatsApp +91 90000 00000. Office: Andhra Pradesh, India.',
    );
  }

  @override
  void dispose() {
    _name.dispose(); _email.dispose(); _phone.dispose(); _msg.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_form.currentState!.validate()) return;
    setState(() => _sent = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Message sent — we\'ll reply within 24 h')),
    );
    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;
      _name.clear(); _email.clear(); _phone.clear(); _msg.clear();
      setState(() => _sent = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contact')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('We\'re here to help!',
              style: TextStyle(fontSize: 13, color: Color(AppColors.accentCyan), fontWeight: FontWeight.w600, letterSpacing: 1.5)),
          const SizedBox(height: 4),
          const Text('Get in touch',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text('Question, feedback or partnership — our team replies within 24 h.',
              style: TextStyle(fontSize: 14, color: Colors.grey.shade700)),
          const SizedBox(height: 20),
          Form(
            key: _form,
            child: Column(children: [
              _field(_name, 'Name', Icons.person_outline,
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null),
              _field(_email, 'Email', Icons.email_outlined,
                  keyboard: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Required';
                    if (!RegExp(r'\S+@\S+\.\S+').hasMatch(v)) return 'Invalid email';
                    return null;
                  }),
              _field(_phone, 'Phone (optional)', Icons.phone_outlined,
                  keyboard: TextInputType.phone),
              _field(_msg, 'Message', Icons.message_outlined,
                  maxLines: 5,
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: _sent ? null : _submit,
                  icon: Icon(_sent ? Icons.check : Icons.send),
                  label: Text(_sent ? 'Sent' : 'Send message'),
                ),
              ),
            ]),
          ),
          const SizedBox(height: 24),
          _contactTile(Icons.phone, 'Call us', AppInfo.supportPhone),
          _contactTile(Icons.email, 'Email', AppInfo.supportEmail),
          _contactTile(Icons.chat, 'WhatsApp', '+91 90000 00000'),
          _contactTile(Icons.location_on, 'Office', 'Andhra Pradesh, India'),
        ],
      ),
    );
  }

  Widget _field(TextEditingController c, String label, IconData icon,
      {int maxLines = 1, TextInputType? keyboard, String? Function(String?)? validator}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: c,
        maxLines: maxLines,
        keyboardType: keyboard,
        validator: validator,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          filled: true,
          fillColor: Colors.grey.shade50,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }

  Widget _contactTile(IconData icon, String title, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(10),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: const Color(AppColors.accentCyan).withOpacity(0.15),
          child: Icon(icon, color: const Color(AppColors.primary), size: 18),
        ),
        title: Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        subtitle: Text(value, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.w600)),
        onTap: () {},
      ),
    );
  }
}
