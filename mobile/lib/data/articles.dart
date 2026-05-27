/// Knowledge Hub article catalogue. Mirrors the web `ARTICLES` array in
/// src/pages/KnowledgePage.tsx. Bodies are simple plain text — the article
/// detail screen renders them as paragraphs.
class Article {
  final String slug;
  final String title;
  final String excerpt;
  final String category;
  final int readMin;
  final String hero;
  final String publishedAt;
  final List<String> body;
  const Article({
    required this.slug,
    required this.title,
    required this.excerpt,
    required this.category,
    required this.readMin,
    required this.hero,
    required this.publishedAt,
    required this.body,
  });
}

const articles = <Article>[
  Article(
    slug: 'summer-strategies-vannamei-pond',
    title: 'Summer Strategies: Enhancing Vannamei Shrimp Pond Management',
    excerpt: 'Tactical playbook for the May–July window — DO drops, ammonia spikes, FCR slides.',
    category: 'Pond Management', readMin: 8, publishedAt: '2026-05-20',
    hero: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=70',
    body: [
      'Summer is when vannamei farms either set records or write off the cycle. Pond temperatures climb past 32 °C, dissolved oxygen crashes overnight, and feed-conversion ratios drift up by 0.2-0.4 in weeks.',
      'The four summer levers: 1) Aeration HP — add 25-30% capacity from May onward. 2) Water exchange — 10-15% per day during peaks. 3) Shift heaviest feed to 6-8 AM and 7-9 PM. 4) Switch to water + gut probiotics.',
      'Tip: A 1°C drop at the bottom cuts oxygen demand ~10%. Pitch paddle wheels at 30-45° to push surface heat down.',
      'DO-crash protocol: When pre-dawn DO < 3.5 mg/L, turn on every aerator, exchange 30% water, dose emergency oxygen. Aqua AI pushes a notification within 5 minutes of the first sensor reading.',
    ],
  ),
  Article(
    slug: 'sustainable-vannamei-best-practices',
    title: 'Best Practices for Sustainable Vannamei Shrimp Culture',
    excerpt: 'Yield above 5 t/acre while protecting the environment.',
    category: 'Sustainability', readMin: 11, publishedAt: '2026-05-12',
    hero: 'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?w=1600&q=70',
    body: [
      'Sustainable doesn\'t mean low-yield. The highest-yielding clusters in AP are also the cleanest. The discipline is input quality and effluent management — not density cuts.',
      'Effluent rules: 8-10% sedimentation pond. Mangrove buffers cut nitrogen 40-60%. Recycle 70% of exchange water through bio-filters.',
    ],
  ),
  Article(
    slug: 'lime-application-vannamei',
    title: 'The Crucial Role of Lime Application in Vannamei Aquaculture',
    excerpt: 'Why CaO matters for EHP eradication. Dose per acre, pH ladder.',
    category: 'Disease Management', readMin: 6, publishedAt: '2026-05-04',
    hero: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&q=70',
    body: [
      'EHP spores survive desiccation, freezing, and most disinfectants. They do not survive sustained pH > 12. That is what quicklime (CaO) buys you.',
      'The 12-pH protocol: drain → scrape 5 cm muck → spread CaO at 50-150 kg/acre (sandy lower, clay higher) → wait 7 days dry → flush with 4 inches clean water → drain → refill.',
      'WARNING: Quicklime is caustic. Wear PPE.',
    ],
  ),
  Article(
    slug: 'checktray-mastery',
    title: 'Checktray Mastery: Enhancing Shrimp Culture Through Precision Management',
    excerpt: 'The 15-minute drill that separates top farms from average ones.',
    category: 'Feed Management', readMin: 7, publishedAt: '2026-04-28',
    hero: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=1600&q=70',
    body: [
      'Used well, checktrays cut FCR 0.15-0.25 and prevent NH3 spikes.',
      '4-point drill: 4 corners + 1 centre at each feed. Pull after 90 min. Score on a 4-point scale (empty/dusty/partial/full). Adjust next meal ±10% based on the dustiest tray. Photo daily for Aqua AI auto-scoring.',
    ],
  ),
  Article(
    slug: 'seed-stocking-success',
    title: 'The Key to Success: Seed Stocking in Vannamei Shrimp Farming',
    excerpt: 'PL selection, acclimatisation, stocking density math.',
    category: 'Stocking', readMin: 9, publishedAt: '2026-04-21',
    hero: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?w=1600&q=70',
    body: [
      'The opening week is 60% of cycle outcome. PCR-verified PLs, slow acclimatisation, accurate density matter more than anything at DOC 60.',
      'PL checklist: MPEDA-licensed hatchery, A++/A+ tier; EHP/WSSV/AHPND PCR clear within 7 days; Aqua AI cert ≥ 80; uniform size, active swimming, transparent body.',
    ],
  ),
  Article(
    slug: 'freshwater-vannamei',
    title: 'Exploring Freshwater Aquaculture with Vannamei Shrimp',
    excerpt: 'Vannamei in low-salinity inland ponds — when it works.',
    category: 'Species Profiles', readMin: 10, publishedAt: '2026-04-14',
    hero: 'https://images.unsplash.com/photo-1518757215068-c2cea5b22301?w=1600&q=70',
    body: [
      'Inland low-salinity vannamei is recent in India, with notable clusters in AP, Telangana, WB. Works above 4 ppt with mineral balancing. Below that, mortality climbs sharply.',
    ],
  ),
  Article(
    slug: 'ehp-early-detection',
    title: 'EHP Early Detection — From Microscopy to AI in Under 30 Seconds',
    excerpt: 'A ₹1,500 USB microscope + on-device AI matches a PCR lab.',
    category: 'Disease Management', readMin: 12, publishedAt: '2026-04-07',
    hero: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=70',
    body: [
      'PCR is the gold standard for EHP but turn-around is 36-72 hours. In a 120-day cycle, that delay is the difference between salvage and loss.',
      'Aqua AI\'s EHP detector closes the gap to 30 seconds with sensitivity > 92% vs PCR.',
    ],
  ),
  Article(
    slug: 'cyclone-pond-sop',
    title: 'Cyclone Season SOP: Protecting Your Pond Before the Storm',
    excerpt: 'IMD warning to first rain — step-by-step.',
    category: 'Weather', readMin: 7, publishedAt: '2026-03-30',
    hero: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1600&q=70',
    body: [
      'A cat-1 cyclone on a poorly prepared 1-acre pond costs ₹3-5 lakh on average. On a prepared pond, almost nothing. The difference is 4 hours of work the day before landfall.',
    ],
  ),
];
