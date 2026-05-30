import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Search, Clock, ArrowRight, Mail, BookOpen, ChevronLeft, ChevronRight,
} from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMin: number;
  hero: string;
  publishedAt: string;
};

const ARTICLES: Article[] = [
  {
    slug: 'summer-strategies-vannamei-pond',
    title: 'Summer Strategies: Enhancing Vannamei Shrimp Pond Management',
    excerpt: 'As the temperature rises, vannamei farmers face DO drops, ammonia spikes and feed-conversion losses. Here is a tactical playbook for the May-July window.',
    category: 'Pond Management', readMin: 8, publishedAt: '2026-05-20',
    hero: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=70',
  },
  {
    slug: 'sustainable-vannamei-best-practices',
    title: 'Best Practices for Sustainable Vannamei Shrimp Culture',
    excerpt: 'Protecting the environment while pushing yields above 5 t/acre. Stocking density, water exchange, probiotic protocols and effluent management.',
    category: 'Sustainability', readMin: 11, publishedAt: '2026-05-12',
    hero: 'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?w=1600&q=70',
  },
  {
    slug: 'lime-application-vannamei',
    title: 'The Crucial Role of Lime Application in Vannamei Aquaculture',
    excerpt: 'Why CaO matters for EHP eradication, how much per acre, when to apply, and the pH ladder that gives you the cleanest pond bottom of the season.',
    category: 'Disease Management', readMin: 6, publishedAt: '2026-05-04',
    hero: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&q=70',
  },
  {
    slug: 'checktray-mastery',
    title: 'Checktray Mastery: Enhancing Shrimp Culture Through Precision Management',
    excerpt: 'The 15-minute checktray drill that separates top-yielding farms from average ones. Tools, timing, and how AI counts cut your sampling error to under 3%.',
    category: 'Feed Management', readMin: 7, publishedAt: '2026-04-28',
    hero: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=1600&q=70',
  },
  {
    slug: 'seed-stocking-success',
    title: 'The Key to Success: Seed Stocking in Vannamei Shrimp Farming',
    excerpt: 'PL selection, acclimatisation, and stocking density math by salinity and pond size. The opening week is 60% of the cycle outcome.',
    category: 'Stocking', readMin: 9, publishedAt: '2026-04-21',
    hero: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?w=1600&q=70',
  },
  {
    slug: 'freshwater-vannamei',
    title: 'Exploring Freshwater Aquaculture with Vannamei Shrimp',
    excerpt: 'Can vannamei be raised in low-salinity inland ponds? A look at the science, the salinity floor, mineral balancing, and three farmer case studies.',
    category: 'Species Profiles', readMin: 10, publishedAt: '2026-04-14',
    hero: 'https://images.unsplash.com/photo-1518757215068-c2cea5b22301?w=1600&q=70',
  },
  {
    slug: 'ehp-early-detection',
    title: 'EHP Early Detection — From Microscopy to AI in Under 30 Seconds',
    excerpt: 'How a ₹1,500 USB microscope and an on-device AI model match a PCR lab on EHP screening. The full diagnostic workflow.',
    category: 'Disease Management', readMin: 12, publishedAt: '2026-04-07',
    hero: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=70',
  },
  {
    slug: 'cyclone-pond-sop',
    title: 'Cyclone Season SOP: Protecting Your Pond Before the Storm',
    excerpt: 'IMD warning to first rain — a step-by-step list of what to lower, what to cover, and what to harvest early. Avoid the ₹3-5 lakh per acre cyclone tax.',
    category: 'Weather', readMin: 7, publishedAt: '2026-03-30',
    hero: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1600&q=70',
  },
  {
    slug: 'salt-seeding-vannamei',
    title: 'Salt Seeding in Vannamei Shrimp Farming',
    excerpt: 'Mineral seeding in low-salinity ponds — Na, K, Ca, Mg ratios that decide moulting success. The exact gm/m³ recipe and when to dose.',
    category: 'Water Quality', readMin: 6, publishedAt: '2026-03-22',
    hero: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&q=70',
  },
  {
    slug: 'probiotic-production-aquaculture',
    title: 'Probiotic Production in Aquaculture: Vannamei Shrimp',
    excerpt: 'On-farm Bacillus + Lactobacillus fermentation in a ₹4,000 setup. CFU counts, dosing schedule, and gut-health gains across 90 days.',
    category: 'Probiotics', readMin: 9, publishedAt: '2026-03-15',
    hero: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1600&q=70',
  },
  {
    slug: 'pond-bottom-ecology',
    title: 'Promoting Pond Bottom Ecology',
    excerpt: 'Why the bottom decides your cycle. Sediment ORP, sludge depth, beneficial microbes, and the bottom-renovation playbook between crops.',
    category: 'Pond Management', readMin: 10, publishedAt: '2026-03-08',
    hero: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1600&q=70',
  },
  {
    slug: 'probiotics-shrimp-culture',
    title: 'Probiotics in Shrimp Culture',
    excerpt: 'Strain selection, pond vs. feed application, and the science behind why one ₹400 probiotic dose can offset ₹4,000 in antibiotic spend.',
    category: 'Probiotics', readMin: 8, publishedAt: '2026-03-01',
    hero: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&q=70',
  },
  {
    slug: 'water-quality-master-guide',
    title: 'Salinity, pH, DO, Temperature & Ammonia — The Complete Vannamei Water-Quality Guide',
    excerpt: 'Optimal ranges, danger thresholds, dawn vs. afternoon checkpoints, and corrective dosing for every parameter that decides growth and survival.',
    category: 'Water Quality', readMin: 14, publishedAt: '2026-02-22',
    hero: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=1600&q=70',
  },
  {
    slug: 'stocking-density-productivity',
    title: 'How Stocking Density Limits Aquaculture Productivity',
    excerpt: 'The math behind PL/m² — yield per acre vs. survival, FCR creep, and the sweet spot for semi-intensive Indian conditions.',
    category: 'Stocking', readMin: 7, publishedAt: '2026-02-15',
    hero: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=70',
  },
  {
    slug: 'aerator-equipped-ponds',
    title: 'Aerator-Equipped Ponds: Sizing, Placement and Power Math',
    excerpt: 'HP per acre, paddlewheel vs. aspirator vs. nano-bubble, where to position them, and the 4 a.m. DO crash you can prevent.',
    category: 'Pond Management', readMin: 9, publishedAt: '2026-02-08',
    hero: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1600&q=70',
  },
  {
    slug: 'inland-pond-renovation',
    title: 'Inland Pond Bottom Renovation Between Crops',
    excerpt: 'Drying, ploughing, liming, disinfection — the 14-day SOP that resets pathogen load and delivers a clean Day-1 for the next cycle.',
    category: 'Pond Management', readMin: 8, publishedAt: '2026-02-01',
    hero: 'https://images.unsplash.com/photo-1572783306003-3f81a9a4063e?w=1600&q=70',
  },
  {
    slug: 'lean-living-shrimp-farming',
    title: 'Shrimp Farming Through Lean Living — Cutting Costs Without Cutting Yield',
    excerpt: 'How small farmers in Bhimavaram crossed 4.5 t/acre by trimming feed waste, electricity, and probiotic overdosing. Spreadsheet inside.',
    category: 'Economics', readMin: 11, publishedAt: '2026-01-25',
    hero: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=70',
  },
  {
    slug: 'smart-pond-zero-exchange',
    title: 'What a Smart Pond Looks Like — Zero Water Exchange',
    excerpt: 'Closed-cycle ponds with biofloc + microbial cap. Inputs, outputs, biosecurity gains, and why this is the future for water-stressed states.',
    category: 'Sustainability', readMin: 10, publishedAt: '2026-01-18',
    hero: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=1600&q=70',
  },
  {
    slug: 'larvae-production-hatchery',
    title: 'Larvae Production in Shrimp Hatcheries',
    excerpt: 'From maturation tank to PL-12 — water chemistry, broodstock selection, feeding protocol, and the 28-day timeline.',
    category: 'Hatchery', readMin: 12, publishedAt: '2026-01-11',
    hero: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1600&q=70',
  },
  {
    slug: 'nutrition-feed-management',
    title: 'Nutrition and Feed Management of Shrimp',
    excerpt: 'Crude protein %, lipid balance, attractants, and the daily-ration formula. Why FCR 1.4 is achievable on Indian feeds.',
    category: 'Feed Management', readMin: 9, publishedAt: '2026-01-04',
    hero: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1600&q=70',
  },
  {
    slug: 'penaeus-monodon-disease',
    title: 'Disease Management in Penaeus monodon — Causes, Prevention and Solutions',
    excerpt: 'WSSV, YHV, IHHNV, AHPND, EHP — the differential diagnosis flowchart, plus prevention SOPs that cut outbreak risk by 60%.',
    category: 'Disease Management', readMin: 13, publishedAt: '2025-12-28',
    hero: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=70',
  },
  {
    slug: 'black-tiger-strategies',
    title: 'Growth Strategies for Black Tiger Shrimp Farming',
    excerpt: 'Polyculture, polyhouse and intercrop techniques that have brought P. monodon back to Indian ponds with premium export pricing.',
    category: 'Species Profiles', readMin: 11, publishedAt: '2025-12-20',
    hero: 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=70',
  },
  {
    slug: 'role-of-seafood-economy',
    title: 'The Role of Seafood in India\'s Rural Economy',
    excerpt: '13 million livelihoods, $7B exports, 9 coastal states — how aquaculture became India\'s fastest-growing rural employer.',
    category: 'Economics', readMin: 8, publishedAt: '2025-12-13',
    hero: 'https://images.unsplash.com/photo-1535400255456-3eb785f44906?w=1600&q=70',
  },
  {
    slug: 'dissolved-oxygen',
    title: 'The Importance of Dissolved Oxygen in Aquaculture',
    excerpt: 'Why DO is the single most important water parameter. Diurnal swings, 4 a.m. crashes, and the dosing/aeration corrections that save crops.',
    category: 'Water Quality', readMin: 8, publishedAt: '2025-12-06',
    hero: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=70',
  },
  {
    slug: 'maximizing-feed-efficiency',
    title: 'Maximizing Feed Efficiency in Vannamei Shrimp',
    excerpt: 'Feed is 55% of your cost. Checktray-driven dosing, attractant boosting, dawn-vs-evening rations — the playbook that pushes FCR below 1.3.',
    category: 'Feed Management', readMin: 9, publishedAt: '2025-11-29',
    hero: 'https://images.unsplash.com/photo-1593854823322-5ab30a23b9c4?w=1600&q=70',
  },
  {
    slug: 'running-mortality-syndrome',
    title: 'Understanding & Controlling Running Mortality Syndrome (RMS)',
    excerpt: 'Slow, persistent daily mortality with no clear pathogen. The probable causes — Vibrio + EHP combo, mineral imbalance, sludge — and how to stop the bleed.',
    category: 'Disease Management', readMin: 11, publishedAt: '2025-11-22',
    hero: 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=1600&q=70',
  },
  {
    slug: 'optimal-salinity',
    title: 'The Importance of Optimal Salinity for Shrimp Farming',
    excerpt: 'PPT ranges by species and life stage, salinity acclimatisation curves, and the inland low-salinity protocol that still hits 5 t/acre.',
    category: 'Water Quality', readMin: 7, publishedAt: '2025-11-15',
    hero: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&q=70',
  },
  {
    slug: 'microcystis-remedies',
    title: 'Microcystis Remedies — Tackling Toxic Algae Blooms',
    excerpt: 'When the pond turns blue-green, you have hours. Identification, immediate corrective dosing, and the prevention rotation that keeps it from coming back.',
    category: 'Water Quality', readMin: 9, publishedAt: '2025-11-08',
    hero: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1600&q=70',
  },
  {
    slug: 'better-pond-management',
    title: 'Better Pond Management — Daily, Weekly, Monthly Checklists',
    excerpt: 'A field-proven calendar of pond actions by week-of-culture. Sampling, water exchange, feed adjustment, probiotic dosing, harvest prep.',
    category: 'Pond Management', readMin: 12, publishedAt: '2025-11-01',
    hero: 'https://images.unsplash.com/photo-1572783306003-3f81a9a4063e?w=1600&q=70',
  },
  {
    slug: 'ph-fluctuations',
    title: 'Understanding & Stabilising pH Fluctuations in Aquaculture',
    excerpt: 'Morning vs. afternoon pH gap, what 0.5+ swings do to shrimp moulting, and the buffer dosing schedule that keeps your pond at 7.8–8.3.',
    category: 'Water Quality', readMin: 8, publishedAt: '2025-10-25',
    hero: 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=1600&q=70',
  },
  {
    slug: 'rainy-season-protocols',
    title: 'Rainy Season Precautions for Successful Vannamei Crops',
    excerpt: 'Sudden temperature drops, salinity dilution, runoff contamination — the SOP that protects ponds through the southwest and northeast monsoons.',
    category: 'Weather', readMin: 9, publishedAt: '2025-10-18',
    hero: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1600&q=70',
  },
  {
    slug: 'natural-water-resources',
    title: 'The Role of Natural Water Resources in Advanced Shrimp Farming',
    excerpt: 'Estuarine, brackish and groundwater sources — testing protocols, treatment, and what to do when your inlet water itself is the contamination.',
    category: 'Water Quality', readMin: 10, publishedAt: '2025-10-11',
    hero: 'https://images.unsplash.com/photo-1488188840022-eafa9cb24c47?w=1600&q=70',
  },
];

const POPULAR_SLUGS = [
  'water-quality-master-guide',
  'penaeus-monodon-disease',
  'probiotic-production-aquaculture',
  'checktray-mastery',
  'smart-pond-zero-exchange',
];

const PER_PAGE = 6;

export default function KnowledgePage() {
  useEffect(() => { document.title = 'Knowledge Hub — Aqua Rudra'; }, []);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARTICLES;
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const popular = POPULAR_SLUGS
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero — warm, inviting, illustration on the right */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-black to-violet-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm tracking-widest uppercase mb-6"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              >
                <BookOpen className="w-4 h-4" />
                Knowledge Hub
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold leading-[1.05] mb-5"
              >
                Unlocking <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300">Boundless</span> Aquatic Wisdom
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-8"
              >
                Field-tested guides, disease playbooks and farmer case studies — sourced from
                ICAR-CIBA, NSPAAD, MPEDA circulars and Aqua Rudra's own diagnostic dataset. Read
                in your language. Learn at your pace.
              </motion.p>

              <form
                onSubmit={(e) => { e.preventDefault(); setPage(1); }}
                className="max-w-xl flex items-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] focus-within:border-cyan-400/40"
              >
                <Search className="w-5 h-5 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search articles, diseases, species…"
                  className="flex-1 bg-transparent outline-none text-white text-base placeholder:text-white/35"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setPage(1); }}
                    className="text-sm text-white/45 hover:text-white"
                  >
                    clear
                  </button>
                )}
              </form>
            </div>

            {/* Friendly illustration — farmer reading the Aqua Rudra handbook by his pond */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="hidden lg:flex justify-center"
            >
              <KnowledgeIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles + sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-6">
              {paged.length === 0 ? (
                <div className="text-center py-16 text-sm text-white/30">
                  No articles match "{query}"
                </div>
              ) : (
                paged.map((a, i) => <ArticleCard key={a.slug} article={a} delay={i * 0.05} />)
              )}

              {filtered.length > PER_PAGE && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-30 text-white/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`min-w-9 h-9 rounded-lg text-sm font-medium border transition ${
                          n === safePage
                            ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                            : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-30 text-white/70"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="text-[11px] uppercase tracking-widest text-cyan-300 mb-4">Popular posts</div>
                <ol className="space-y-3">
                  {popular.map((a, i) => (
                    <li key={a.slug} className="flex gap-3">
                      <span className="text-2xl font-bold text-white/15 leading-none tabular-nums">
                        {i + 1}
                      </span>
                      <Link
                        to={`/knowledge/${a.slug}`}
                        className="text-sm text-white/80 hover:text-cyan-300 leading-snug line-clamp-3 transition"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold text-white">Subscribe to stay updated</span>
                </div>
                <p className="text-xs text-white/60 mb-4">
                  Weekly newsletter — disease alerts, pricing trends, new articles. In your
                  language.
                </p>
                <form onSubmit={subscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.in"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white outline-none focus:border-emerald-400/40"
                  />
                  <button
                    type="submit"
                    disabled={subscribed}
                    className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black text-xs font-semibold"
                  >
                    {subscribed ? 'Done' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function KnowledgeIllustration() {
  // Inline SVG — farmer reading the handbook with shrimp + book + pond.
  // Keeps the page light (no PNG download) and tints match the warm hero gradient.
  return (
    <svg viewBox="0 0 420 360" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
      {/* Pond / floor disc */}
      <ellipse cx="210" cy="320" rx="180" ry="22" fill="#fb923c" opacity="0.25" />
      <ellipse cx="210" cy="318" rx="160" ry="16" fill="#fdba74" opacity="0.4" />

      {/* Open book (the bookshelf in the reference, simplified to one big open tome) */}
      <g transform="translate(250 90)">
        <rect x="0" y="0" width="140" height="180" rx="6" fill="#1e293b" />
        <rect x="6" y="6" width="128" height="168" rx="3" fill="#fef3c7" />
        <line x1="70" y1="6" x2="70" y2="174" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Pages of text */}
        {[20, 35, 50, 65, 80, 100, 115, 130, 145, 160].map((y) => (
          <g key={y}>
            <line x1="14" y1={y} x2="62" y2={y} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="78" y1={y} x2="126" y2={y} stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        ))}
        {/* Shrimp + leaf icons on page corners */}
        <circle cx="32" cy="92" r="6" fill="#fb923c" />
        <path d="M 26 92 q 6 -8 12 0 q -6 8 -12 0" fill="#f97316" />
        <circle cx="108" cy="92" r="6" fill="#34d399" />
      </g>

      {/* Farmer figure reading */}
      <g transform="translate(70 110)">
        {/* Body */}
        <ellipse cx="60" cy="170" rx="55" ry="14" fill="#312e81" opacity="0.4" />
        {/* Lungi */}
        <path d="M 30 120 L 90 120 L 100 175 L 20 175 Z" fill="#7c3aed" />
        <path d="M 30 120 L 90 120 L 100 175 L 20 175 Z" fill="#a78bfa" opacity="0.3" />
        {/* Shirt */}
        <path d="M 30 75 Q 30 65 60 65 Q 90 65 90 75 L 90 125 L 30 125 Z" fill="#e5e7eb" />
        {/* Head */}
        <circle cx="60" cy="45" r="24" fill="#fde68a" />
        {/* Hair */}
        <path d="M 38 35 Q 40 22 60 22 Q 80 22 82 35 Q 82 30 70 28 Q 60 26 50 28 Q 40 30 38 35 Z" fill="#fafafa" />
        {/* Smile */}
        <path d="M 52 50 Q 60 56 68 50" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="52" cy="42" r="2" fill="#1f2937" />
        <circle cx="68" cy="42" r="2" fill="#1f2937" />
        {/* Waving arm */}
        <path d="M 30 80 Q 8 78 6 50" stroke="#fde68a" strokeWidth="11" fill="none" strokeLinecap="round" />
        <circle cx="6" cy="46" r="9" fill="#fde68a" />
        {/* Arm holding book */}
        <path d="M 90 80 Q 115 95 120 110" stroke="#fde68a" strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>

      {/* Floating leaves / shrimp accents */}
      <g opacity="0.7">
        <path d="M 380 280 q 8 -4 14 4 q -8 4 -14 -4" fill="#34d399" />
        <path d="M 360 320 q 6 -3 11 3 q -6 3 -11 -3" fill="#34d399" />
      </g>
    </svg>
  );
}

function ArticleCard({ article, delay }: { article: Article; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-cyan-400/30 transition"
    >
      <Link to={`/knowledge/${article.slug}`} className="block">
        <div
          className="aspect-[16/8] bg-cover bg-center"
          style={{ backgroundImage: `url(${article.hero})` }}
        />
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3 text-[11px] text-white/40">
            <span className="px-2 py-0.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 uppercase tracking-wide">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readMin} min read</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <h3 className="text-xl font-bold text-white leading-snug mb-2 hover:text-cyan-300 transition">
            {article.title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
          <div className="inline-flex items-center gap-1 text-xs text-cyan-300">
            Read article <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
