import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../utils/constants.dart';
import '../home/home_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  String _role = 'farmer';
  String _language = 'english';
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    setState(() { _loading = true; _error = null; });
    try {
      await apiService.register({
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'password': _passCtrl.text,
        'role': _role,
        'language': _language,
      });
      // Auto-login after register
      await apiService.login(_emailCtrl.text.trim(), _passCtrl.text);
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (_) => false,
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() { _error = 'Registration failed. Email may already be in use.'; });
    } finally {
      if (!mounted) return;
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_error != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8)),
                  child: Text(_error!, style: TextStyle(color: Colors.red.shade800)),
                ),
                const SizedBox(height: 16),
              ],
              TextField(controller: _nameCtrl,
                decoration: const InputDecoration(labelText: 'Full Name',
                    prefixIcon: Icon(Icons.person), border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(labelText: 'Email',
                    prefixIcon: Icon(Icons.email), border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Phone',
                    prefixIcon: Icon(Icons.phone), border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: _passCtrl, obscureText: true,
                decoration: const InputDecoration(labelText: 'Password',
                    prefixIcon: Icon(Icons.lock), border: OutlineInputBorder())),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _role,
                decoration: const InputDecoration(labelText: 'Role', border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: 'farmer', child: Text('Farmer')),
                  DropdownMenuItem(value: 'vle', child: Text('VLE (Field Agent)')),
                  DropdownMenuItem(value: 'hatchery_manager', child: Text('Hatchery Manager')),
                  DropdownMenuItem(value: 'farm_supervisor', child: Text('Farm Supervisor')),
                  DropdownMenuItem(value: 'govt_officer', child: Text('Govt / MPEDA Officer')),
                ],
                onChanged: (v) => setState(() => _role = v!),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _language,
                decoration: const InputDecoration(labelText: 'Language', border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: 'english', child: Text('English')),
                  DropdownMenuItem(value: 'telugu', child: Text('Telugu')),
                  DropdownMenuItem(value: 'tamil', child: Text('Tamil')),
                ],
                onChanged: (v) => setState(() => _language = v!),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _register,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(AppColors.primary),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _loading
                    ? const SizedBox(height: 20, width: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Register', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
