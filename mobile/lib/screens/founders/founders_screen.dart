import 'package:flutter/material.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';

class FoundersScreen extends StatefulWidget {
  const FoundersScreen({super.key});

  @override
  State<FoundersScreen> createState() => _FoundersScreenState();
}

class _FoundersScreenState extends State<FoundersScreen>
    with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    registerReadable(
      "Our Team. The team behind Aqua AI. Engineers and researchers on a "
      "mission to decode aquaculture for India's farmers, hatcheries and "
      "government bodies. Chaitanya Gowtham, Founder. "
      "We started Aqua AI because the biggest problems in Indian aquaculture "
      "won't be solved by incremental progress — they need a fundamentally "
      "different approach.",
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Founders')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('OUR TEAM',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1.5, color: Color(AppColors.primary))),
          const SizedBox(height: 6),
          const Text('The team behind Aqua AI',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(
            'Engineers and researchers on a mission to decode aquaculture for India\'s farmers, hatcheries and government bodies.',
            style: TextStyle(color: Colors.grey.shade700, fontSize: 14),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.grey.shade200),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: const Color(AppColors.accentCyan).withOpacity(0.2),
                  child: const Text('C',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(AppColors.primary))),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Chaitanya Gowtham',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('Founder',
                          style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
                IconButton(icon: const Icon(Icons.open_in_new), onPressed: () {}),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(AppColors.primary).withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Text(
              '"We started Aqua AI because the biggest problems in Indian aquaculture won\'t be solved by incremental progress — they need a fundamentally different approach."',
              style: TextStyle(fontStyle: FontStyle.italic, fontSize: 14, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }
}
