import 'package:flutter/material.dart';
import '../../data/articles.dart';
import '../../services/voice_reader.dart';
import '../../widgets/voice_fab.dart';
import '../../utils/constants.dart';

class KnowledgeArticleScreen extends StatefulWidget {
  final Article article;
  const KnowledgeArticleScreen({super.key, required this.article});

  @override
  State<KnowledgeArticleScreen> createState() => _KnowledgeArticleScreenState();
}

class _KnowledgeArticleScreenState extends State<KnowledgeArticleScreen>
    with VoiceReadableScreen {
  @override
  void initState() {
    super.initState();
    final a = widget.article;
    registerReadable('${a.title}. ${a.excerpt}. ${a.body.join(' ')}');
  }

  @override
  Widget build(BuildContext context) {
    final a = widget.article;
    final related = articles
        .where((r) => r.slug != a.slug && r.category == a.category)
        .take(3)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(a.category, style: const TextStyle(fontSize: 14)),
        actions: [
          IconButton(
            tooltip: 'Read aloud',
            icon: const Icon(Icons.volume_up),
            onPressed: voiceReader.start,
          ),
          IconButton(icon: const Icon(Icons.share), onPressed: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          AspectRatio(
            aspectRatio: 16 / 9,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                a.hero,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade200),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(AppColors.accentCyan).withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(a.category,
                  style: const TextStyle(fontSize: 10, color: Color(AppColors.primary), fontWeight: FontWeight.w600)),
            ),
            const SizedBox(width: 8),
            Text('${a.readMin} min read', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
            const Spacer(),
            Text(a.publishedAt, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
          ]),
          const SizedBox(height: 12),
          Text(a.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.25)),
          const SizedBox(height: 16),
          ...a.body.map((p) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Text(p, style: const TextStyle(fontSize: 15, height: 1.55)),
              )),
          if (related.isNotEmpty) ...[
            const SizedBox(height: 24),
            const Text('Related in this category',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 8),
            ...related.map((r) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.bookmark_border, color: Color(AppColors.primary)),
                  title: Text(r.title,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: Text('${r.readMin} min read',
                      style: const TextStyle(fontSize: 11)),
                  onTap: () => Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => KnowledgeArticleScreen(article: r)),
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
