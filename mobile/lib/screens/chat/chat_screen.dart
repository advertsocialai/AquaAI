import 'package:flutter/material.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _controller = TextEditingController();
  final _scroll = ScrollController();
  final List<_Msg> _msgs = [
    _Msg(role: 'bot', text: 'Hi! I\'m the Aqua AI assistant. How can I help your farm today?'),
  ];

  String _answer(String q) {
    final t = q.toLowerCase();
    if (t.contains('price') || t.contains('vannamei')) {
      return 'Vannamei 40-count is ₹420/kg today in your district. Check the Pricing tab.';
    }
    if (t.contains('ehp') || t.contains('outbreak')) {
      return '2 EHP-confirmed farms within 5 km in 48h. Run a QC scan and exchange 30% water.';
    }
    if (t.contains('feed') || t.contains('biomass')) {
      return 'For 500 kg biomass at 4% body weight: 20 kg/day starter feed.';
    }
    if (t.contains('weather') || t.contains('cyclone')) {
      return 'IMD forecast: 65mm rain tonight. Lower water level by 4 inches.';
    }
    return 'I can help with pricing, disease alerts, calculators, QC certificates and weather. Try one of the quick options.';
  }

  void _send(String text) {
    if (text.trim().isEmpty) return;
    setState(() {
      _msgs.add(_Msg(role: 'user', text: text));
      _msgs.add(_Msg(role: 'bot', text: _answer(text)));
    });
    _controller.clear();
    Future.delayed(const Duration(milliseconds: 50), () {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  static const _quick = [
    'Today\'s vannamei 40-count price?',
    'EHP outbreak near me?',
    'Feed for 500kg biomass?',
    'How to verify a QC certificate?',
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF38BDF8), Color(0xFFA78BFA)],
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Aqua AI Assistant', style: TextStyle(fontSize: 15)),
                Text('Online · multilingual',
                    style: TextStyle(fontSize: 11, color: Colors.greenAccent)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(12),
              itemCount: _msgs.length,
              itemBuilder: (_, i) {
                final m = _msgs[i];
                final isUser = m.role == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.78,
                    ),
                    decoration: BoxDecoration(
                      color: isUser
                          ? const Color(0xFF38BDF8).withOpacity(0.15)
                          : Colors.grey.shade100,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(14),
                        topRight: const Radius.circular(14),
                        bottomLeft: Radius.circular(isUser ? 14 : 4),
                        bottomRight: Radius.circular(isUser ? 4 : 14),
                      ),
                    ),
                    child: Text(m.text),
                  ),
                );
              },
            ),
          ),
          if (_msgs.length <= 2)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: _quick
                    .map((q) => GestureDetector(
                          onTap: () => _send(q),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(q,
                                style: TextStyle(
                                    fontSize: 12, color: Colors.grey.shade700)),
                          ),
                        ))
                    .toList(),
              ),
            ),
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: 'Ask anything…',
                        filled: true,
                        fillColor: Colors.grey.shade100,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 10),
                      ),
                      onSubmitted: _send,
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: () => _send(_controller.text),
                    icon: const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Msg {
  final String role;
  final String text;
  _Msg({required this.role, required this.text});
}
