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
];

const POPULAR_SLUGS = [
  'summer-strategies-vannamei-pond',
  'sustainable-vannamei-best-practices',
  'lime-application-vannamei',
  'checktray-mastery',
  'seed-stocking-success',
];

const PER_PAGE = 4;

export default function KnowledgePage() {
  useEffect(() => { document.title = 'Knowledge Hub — Aqua AI'; }, []);
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

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-black to-emerald-500/10" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge Hub
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Aquaculture, decoded</h1>
          <p className="text-base text-white/60 max-w-2xl mx-auto mb-8">
            Field-tested guides, disease playbooks and farmer case studies. Sourced from
            ICAR-CIBA, NSPAAD, MPEDA circulars and Aqua AI's own diagnostic dataset.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            className="max-w-xl mx-auto flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40"
          >
            <Search className="w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search articles, diseases, species…"
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setPage(1); }}
                className="text-xs text-white/40 hover:text-white"
              >
                clear
              </button>
            )}
          </form>
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
