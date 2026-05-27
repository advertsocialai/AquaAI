import 'package:flutter/material.dart';
import '../../data/articles.dart';
import '../../utils/constants.dart';
import '../../widgets/voice_fab.dart';
import 'knowledge_article_screen.dart';

class KnowledgeScreen extends StatefulWidget {
  const KnowledgeScreen({super.key});

  @override
  State<KnowledgeScreen> createState() => _KnowledgeScreenState();
}

class _KnowledgeScreenState extends State<KnowledgeScreen>
    with VoiceReadableScreen {
  String _query = '';

  @override
  void initState() {
    super.initState();
    registerReadable(
      'Knowledge Hub. Field-tested guides, disease playbooks and farmer '
      'case studies. '
      '${articles.map((a) => '${a.title}. ${a.excerpt}').join(' ')}',
    );
  }

  @override
  Widget build(BuildContext context) {
    final q = _query.trim().toLowerCase();
    final filtered = q.isEmpty
        ? articles
        : articles.where((a) =>
            a.title.toLowerCase().contains(q) ||
            a.excerpt.toLowerCase().contains(q) ||
            a.category.toLowerCase().contains(q)).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Knowledge Hub')),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Search articles…',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: Colors.grey.shade100,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
            onChanged: (v) => setState(() => _query = v),
          ),
          const SizedBox(height: 16),
          ...filtered.map((a) => _ArticleCard(article: a)),
          if (filtered.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 48),
              child: Center(child: Text('No matches', style: TextStyle(color: Colors.grey))),
            ),
        ],
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  final Article article;
  const _ArticleCard({required this.article});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => KnowledgeArticleScreen(article: article)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9,
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                child: Image.network(
                  article.hero,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(color: Colors.grey.shade200),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(AppColors.accentCyan).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(article.category,
                          style: const TextStyle(fontSize: 10, color: Color(AppColors.primary), fontWeight: FontWeight.w600)),
                    ),
                    const SizedBox(width: 8),
                    Icon(Icons.access_time, size: 12, color: Colors.grey.shade600),
                    const SizedBox(width: 4),
                    Text('${article.readMin} min',
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                  ]),
                  const SizedBox(height: 8),
                  Text(article.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 4),
                  Text(article.excerpt,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
