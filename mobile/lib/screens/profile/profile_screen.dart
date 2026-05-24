import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  static const _activeRole = 'Farmer';
  static const _roles = ['Farmer', 'VLE / Agent'];

  static const _kyc = [
    _KycRow('Aadhaar e-KYC',     'verified'),
    _KycRow('Mobile (+91 ••• ••43210)', 'verified'),
    _KycRow('PAN',                'verified'),
    _KycRow('GST',                'pending'),
    _KycRow('Bank penny-drop',    'verified'),
    _KycRow('MPEDA license',      'missing'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: const Color(0xFF2E75B6).withOpacity(0.2),
                child: const Text('V',
                    style: TextStyle(
                        fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0B5394))),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('V. Ramana',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text('Bhimavaram, AP · Farm F-1142',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                  ],
                ),
              ),
              OutlinedButton(onPressed: () {}, child: const Text('Edit')),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Active role',
                    style: TextStyle(
                        fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.2)),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  children: _roles
                      .map((r) => ChoiceChip(
                            label: Text(r),
                            selected: r == _activeRole,
                            onSelected: (_) {},
                          ))
                      .toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          _section('KYC status'),
          ..._kyc.map(_kycTile),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.security),
            label: const Text('Complete pending KYC'),
          ),
          const SizedBox(height: 20),
          _section('Farm summary'),
          _statRow('Pond area', '4.5 acres'),
          _statRow('Species', 'L. vannamei'),
          _statRow('Avg QS (5 cycles)', '86 / 100'),
          _statRow('Avg yield', '4.8 t/acre'),
          _statRow('Years on AquaI', '2'),
          const SizedBox(height: 20),
          _section('Linked partners'),
          ListTile(
            leading: const Icon(Icons.storefront),
            title: const Text('Aquaprime Hatcheries'),
            subtitle: const Text('Primary PL supplier'),
          ),
          ListTile(
            leading: const Icon(Icons.account_balance),
            title: const Text('SBI · Bhimavaram'),
            subtitle: const Text('Crop loan account'),
          ),
          ListTile(
            leading: const Icon(Icons.shield),
            title: const Text('Bajaj Allianz'),
            subtitle: const Text('Pond insurance'),
          ),
        ],
      ),
    );
  }

  Widget _section(String t) => Padding(
        padding: const EdgeInsets.fromLTRB(4, 0, 4, 8),
        child: Text(t.toUpperCase(),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
              color: Colors.grey.shade700,
            )),
      );

  Widget _statRow(String k, String v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Expanded(child: Text(k, style: TextStyle(color: Colors.grey.shade700))),
            Text(v, style: const TextStyle(fontWeight: FontWeight.w600)),
          ],
        ),
      );

  Widget _kycTile(_KycRow r) {
    final Color color;
    final IconData icon;
    switch (r.status) {
      case 'verified':
        color = Colors.green;
        icon = Icons.verified;
        break;
      case 'pending':
        color = Colors.orange;
        icon = Icons.hourglass_bottom;
        break;
      default:
        color = Colors.red;
        icon = Icons.error_outline;
    }
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(r.label)),
          Text(r.status,
              style: TextStyle(
                  color: color, fontSize: 11, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _KycRow {
  final String label;
  final String status;
  const _KycRow(this.label, this.status);
}
