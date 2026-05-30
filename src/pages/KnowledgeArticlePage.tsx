import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Clock, ArrowLeft, ArrowRight, BookOpen, Share2, Bookmark,
  CheckCircle2, AlertTriangle, Lightbulb,
} from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMin: number;
  hero: string;
  publishedAt: string;
  body: { kind: 'p' | 'h2' | 'h3' | 'ul' | 'callout-tip' | 'callout-warn' | 'callout-do'; text?: string; items?: string[] }[];
};

const ARTICLES: Article[] = [
  {
    slug: 'summer-strategies-vannamei-pond',
    title: 'Summer Strategies: Enhancing Vannamei Shrimp Pond Management',
    excerpt: 'A tactical playbook for the May-July window — when DO drops, ammonia spikes and FCR slides.',
    category: 'Pond Management', readMin: 8, publishedAt: '2026-05-20',
    hero: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=70',
    body: [
      { kind: 'p', text: 'Summer is when vannamei farms either set records or write off the cycle. Pond temperatures climb past 32 °C, dissolved oxygen crashes overnight, and feed-conversion ratios drift up by 0.2-0.4 in a matter of weeks. The farmers who finish the season at 5 t/acre share a common discipline — they treat May to July differently.' },
      { kind: 'h2', text: 'The four summer levers' },
      { kind: 'ul', items: [
        'Aeration HP — add 25-30% capacity from May onward; don\'t wait for the first DO crash.',
        'Water exchange — bump to 10-15% per day during peaks, ideally pre-dawn when intake is coolest.',
        'Feeding window — shift the heaviest feed to 6-8 AM and 7-9 PM. Skip the 12-3 PM slot.',
        'Probiotics — switch to water + gut formulations; alternate Bacillus and Lactobacillus weeks.',
      ] },
      { kind: 'callout-tip', text: 'A 1°C drop at the bottom of the pond cuts oxygen demand ~10%. Run paddle wheels deeper at 30-45° pitch to push surface heat down.' },
      { kind: 'h2', text: 'DO crash protocol' },
      { kind: 'p', text: 'When the pre-dawn DO meter reads below 3.5 mg/L, do not wait for the test kit. Turn on every aerator at full power, exchange 30% water immediately if salinity allows, and dose emergency oxygen if available. AquaRudra\'s pond advisory module will push a push notification within 5 minutes of the first sensor reading.' },
      { kind: 'callout-warn', text: 'Never feed within 4 hours of an overnight DO crash — undigested feed becomes a second NH3 spike 24 hours later.' },
      { kind: 'h2', text: 'When to harvest early' },
      { kind: 'p', text: 'If body weight is above 18 g and the 7-day NH3 trend is climbing past 1.5 mg/L, partial harvest is usually the right call. AquaRudra\'s harvest-timing recommender combines current body weight, mandi prices, and outbreak risk to flag the optimal window.' },
      { kind: 'callout-do', text: 'Run a checktray once every 4 hours during a heat wave. The 2-hour leftover signal tells you to skip the next meal faster than any chart.' },
    ],
  },
  {
    slug: 'sustainable-vannamei-best-practices',
    title: 'Best Practices for Sustainable Vannamei Shrimp Culture',
    excerpt: 'Protecting the environment while pushing yields above 5 t/acre.',
    category: 'Sustainability', readMin: 11, publishedAt: '2026-05-12',
    hero: 'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?w=1600&q=70',
    body: [
      { kind: 'p', text: 'Sustainable doesn\'t mean low-yield. Some of the highest-yielding clusters in Andhra Pradesh are also the cleanest. The discipline is in input quality and effluent management, not in cutting density.' },
      { kind: 'h2', text: 'Effluent rules of thumb' },
      { kind: 'ul', items: [
        'Build a sedimentation pond at 8-10% of culture pond area.',
        'Use mangrove buffers wherever land permits — they cut nitrogen load by 40-60%.',
        'Recycle 70% of exchange water through bio-filters before discharge.',
      ] },
    ],
  },
  {
    slug: 'lime-application-vannamei',
    title: 'The Crucial Role of Lime Application in Vannamei Aquaculture',
    excerpt: 'Why CaO matters for EHP eradication, dose per acre, and the pH ladder.',
    category: 'Disease Management', readMin: 6, publishedAt: '2026-05-04',
    hero: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&q=70',
    body: [
      { kind: 'p', text: 'EHP spores are tough — they survive desiccation, freezing, and most disinfectants. The one thing they don\'t survive is sustained pH above 12. That is what quicklime (CaO) buys you.' },
      { kind: 'h2', text: 'The 12-pH protocol' },
      { kind: 'ul', items: [
        'Drain pond fully. Scrape and remove top 5 cm of bottom muck.',
        'Spread CaO at 50-150 kg/acre depending on soil pH (sandy = lower, clay = higher).',
        'Wait 7 days dry. Re-test pH at multiple points.',
        'Flush with 4 inches of clean water, drain, refill for cycle.',
      ] },
      { kind: 'callout-warn', text: 'Quicklime is caustic. Never apply with bare hands, never breathe the dust. Wear PPE.' },
    ],
  },
  {
    slug: 'checktray-mastery',
    title: 'Checktray Mastery: Enhancing Shrimp Culture Through Precision Management',
    excerpt: 'The 15-minute checktray drill that separates top-yielding farms from average ones.',
    category: 'Feed Management', readMin: 7, publishedAt: '2026-04-28',
    hero: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=1600&q=70',
    body: [
      { kind: 'p', text: 'Checktrays are the single highest-leverage tool a farmer has. Used well, they cut FCR by 0.15-0.25 and prevent uneaten feed from triggering NH3 spikes.' },
      { kind: 'h2', text: 'The 4-point drill' },
      { kind: 'ul', items: [
        'Place trays at four corners and one centre at the same time each feed.',
        'Pull after 90 minutes. Score on a 4-point scale: empty / dusty / partial / full.',
        'Adjust the next meal by ±10% based on the dustiest tray.',
        'Photo the trays daily — AquaRudra\'s checktray module reads the score automatically.',
      ] },
    ],
  },
  {
    slug: 'seed-stocking-success',
    title: 'The Key to Success: Seed Stocking in Vannamei Shrimp Farming',
    excerpt: 'PL selection, acclimatisation, and stocking density math.',
    category: 'Stocking', readMin: 9, publishedAt: '2026-04-21',
    hero: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?w=1600&q=70',
    body: [
      { kind: 'p', text: 'The opening week is 60% of your cycle outcome. PCR-verified PLs, slow acclimatisation, and accurate stocking density matter more than anything you do at DOC 60.' },
      { kind: 'h2', text: 'PL selection checklist' },
      { kind: 'ul', items: [
        'MPEDA-licensed hatchery with current QC tier (A++/A+).',
        'EHP / WSSV / AHPND PCR clear within last 7 days.',
        'AquaRudra QC certificate with composite score ≥ 80.',
        'Visual: uniform size, active swimming, transparent body.',
      ] },
    ],
  },
  {
    slug: 'freshwater-vannamei',
    title: 'Exploring Freshwater Aquaculture with Vannamei Shrimp',
    excerpt: 'Can vannamei be raised in low-salinity inland ponds?',
    category: 'Species Profiles', readMin: 10, publishedAt: '2026-04-14',
    hero: 'https://images.unsplash.com/photo-1518757215068-c2cea5b22301?w=1600&q=70',
    body: [
      { kind: 'p', text: 'Inland low-salinity vannamei farming is a recent phenomenon in India, with notable clusters in Andhra Pradesh, Telangana and West Bengal. It works when salinity is held above 4 ppt and mineral balance is monitored. Below that, mortality climbs sharply.' },
    ],
  },
  {
    slug: 'ehp-early-detection',
    title: 'EHP Early Detection — From Microscopy to AI in Under 30 Seconds',
    excerpt: 'How a ₹1,500 USB microscope and on-device AI match a PCR lab.',
    category: 'Disease Management', readMin: 12, publishedAt: '2026-04-07',
    hero: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600&q=70',
    body: [
      { kind: 'p', text: 'PCR labs are the gold standard for EHP, but turn-around time is 36-72 hours. In a 120-day cycle that delay is the difference between salvaging a crop and losing it. The AquaRudra EHP detector closes that gap to 30 seconds with sensitivity > 92% vs PCR.' },
    ],
  },
  {
    slug: 'cyclone-pond-sop',
    title: 'Cyclone Season SOP: Protecting Your Pond Before the Storm',
    excerpt: 'IMD warning to first rain — a step-by-step list of what to lower, what to cover.',
    category: 'Weather', readMin: 7, publishedAt: '2026-03-30',
    hero: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1600&q=70',
    body: [
      { kind: 'p', text: 'A category 1 cyclone on a poorly prepared 1-acre pond costs ₹3-5 lakh on average. The same storm on a prepared pond costs almost nothing. The difference is 4 hours of work the day before landfall.' },
    ],
  },
];

export default function KnowledgeArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = useMemo(() => ARTICLES.find((a) => a.slug === slug), [slug]);
  const related = useMemo(
    () => ARTICLES.filter((a) => a.slug !== slug && a.category === article?.category).slice(0, 3),
    [slug, article],
  );

  useEffect(() => {
    document.title = article ? `${article.title} — AquaRudra` : 'Article not found — AquaRudra';
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-white">
        <Header />
        <main className="container mx-auto px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold mb-2">Article not found</h1>
          <p className="text-white/50 mb-8">We couldn't find the article you're looking for.</p>
          <Link to="/knowledge" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/[0.05] text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero */}
      <article className="pt-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white tracking-widest uppercase mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Knowledge Hub
          </Link>
          <div className="flex items-center gap-3 mb-4 text-[11px]">
            <span className="px-2 py-0.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 uppercase tracking-wide">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 text-white/40"><Clock className="w-3 h-3" /> {article.readMin} min read</span>
            <span className="text-white/20">·</span>
            <span className="text-white/40">{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-6"
          >
            {article.title}
          </motion.h1>
          <p className="text-base text-white/65 leading-relaxed mb-10">{article.excerpt}</p>

          <div
            className="aspect-[16/8] rounded-2xl border border-white/10 bg-cover bg-center mb-10"
            style={{ backgroundImage: `url(${article.hero})` }}
          />

          {/* Body */}
          <div className="space-y-5">
            {article.body.map((block, i) => {
              if (block.kind === 'p')
                return <p key={i} className="text-base text-white/80 leading-relaxed">{block.text}</p>;
              if (block.kind === 'h2')
                return <h2 key={i} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-2">{block.text}</h2>;
              if (block.kind === 'h3')
                return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-2">{block.text}</h3>;
              if (block.kind === 'ul')
                return (
                  <ul key={i} className="space-y-2 my-2">
                    {block.items?.map((it, j) => (
                      <li key={j} className="flex items-start gap-2 text-base text-white/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              if (block.kind === 'callout-tip')
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-cyan-400/30 bg-cyan-400/5">
                    <Lightbulb className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/85 italic">{block.text}</p>
                  </div>
                );
              if (block.kind === 'callout-warn')
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-amber-400/30 bg-amber-400/5">
                    <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/85">{block.text}</p>
                  </div>
                );
              if (block.kind === 'callout-do')
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-emerald-400/30 bg-emerald-400/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/85">{block.text}</p>
                  </div>
                );
              return null;
            })}
          </div>

          {/* Share strip */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-white/30 uppercase tracking-widest">Found this useful?</div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs text-white/70">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-xs text-white/70">
                <Bookmark className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 border-t border-white/5 mt-16 bg-white/[0.02]">
          <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
            <div className="text-xs text-cyan-300 uppercase tracking-widest mb-2">Related reading</div>
            <h2 className="text-2xl font-bold mb-8">More from {article.category}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/knowledge/${r.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition overflow-hidden group"
                >
                  <div
                    className="aspect-[16/9] bg-cover bg-center"
                    style={{ backgroundImage: `url(${r.hero})` }}
                  />
                  <div className="p-4">
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 leading-snug line-clamp-3 transition">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-white/40 mt-2 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.readMin} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/knowledge"
                className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
              >
                <BookOpen className="w-4 h-4" /> Browse all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
