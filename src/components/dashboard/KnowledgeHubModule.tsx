import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Video, GraduationCap, MessageCircleQuestion, Search, Clock,
  Microscope, Fish, Bug, FileText, BadgeCheck,
} from 'lucide-react';

type Kind = 'article' | 'video' | 'course' | 'paper' | 'disease' | 'species';

const TABS: { id: Kind; label: string; icon: React.ElementType }[] = [
  { id: 'article', label: 'Articles',   icon: BookOpen },
  { id: 'video',   label: 'Videos',     icon: Video },
  { id: 'course',  label: 'Courses',    icon: GraduationCap },
  { id: 'paper',   label: 'Research',   icon: FileText },
  { id: 'disease', label: 'Diseases',   icon: Bug },
  { id: 'species', label: 'Species',    icon: Fish },
];

type Item = { title: string; meta: string; kind: Kind; tag?: string; lang?: string[] };

const ITEMS: Item[] = [
  // Articles
  { kind: 'article', title: 'Pond preparation before stocking: 7-step checklist',  meta: '6 min read · ICAR-CIBA',           tag: 'Pond Prep',     lang: ['EN', 'TE'] },
  { kind: 'article', title: 'Reading water quality reports for shrimp farmers',    meta: '4 min read',                       tag: 'Water Quality', lang: ['EN', 'TE', 'TA'] },
  { kind: 'article', title: 'Probiotic dosing schedule for vannamei',              meta: '5 min read',                       tag: 'Feed & Probiotics', lang: ['EN', 'TE'] },
  { kind: 'article', title: 'Cyclone season SOP: protecting your pond',            meta: '8 min read · IMD advisory',        tag: 'Weather',       lang: ['EN', 'TE', 'OD'] },

  // Videos
  { kind: 'video', title: 'How to count PLs on a tray — IntensLight technique',    meta: '3:42 · Aqua Rudra Labs',                tag: 'Diagnostics',   lang: ['TE', 'EN'] },
  { kind: 'video', title: 'Spotting EHP under a USB microscope',                   meta: '5:18 · ICAR-CIBA',                 tag: 'Disease ID',    lang: ['TE', 'EN'] },
  { kind: 'video', title: 'Hatchery PCR sample collection walkthrough',            meta: '7:01',                             tag: 'Hatchery',      lang: ['EN'] },
  { kind: 'video', title: 'Setting up a 1-acre vannamei pond from scratch',        meta: '14:33',                            tag: 'Setup',         lang: ['TE', 'TA'] },

  // Courses
  { kind: 'course', title: 'AquaI Foundations — for new farmers',                  meta: '12 lessons · 3 hours · Free',      tag: 'Beginner',      lang: ['TE', 'TA', 'EN'] },
  { kind: 'course', title: 'VLE Certification — diagnostic services',              meta: '24 lessons · 9 hours · ₹1,499',    tag: 'Certification', lang: ['EN', 'TE'] },
  { kind: 'course', title: 'Hatchery QC Mastery',                                  meta: '18 lessons · 6 hours · ₹4,999',    tag: 'Hatchery',      lang: ['EN'] },
  { kind: 'course', title: 'Export readiness: BAP, ASC, GlobalGAP',                meta: '10 lessons · 4 hours · ₹2,999',    tag: 'Export',        lang: ['EN'] },

  // Research / papers
  { kind: 'paper', title: 'Enterocytozoon hepatopenaei: a global review (2024)',    meta: 'Tang et al. · Aquaculture',        tag: 'EHP' },
  { kind: 'paper', title: 'Detection of WSSV via real-time PCR in AP hatcheries', meta: 'ICAR-NBFGR · 2023',                tag: 'WSSV' },
  { kind: 'paper', title: 'PMMSY scheme guidelines for shrimp clusters',           meta: 'MoFAH&D · 2025 revision',          tag: 'Policy' },
  { kind: 'paper', title: 'NSPAAD disease surveillance Q4 2025 report',            meta: 'NBFGR',                            tag: 'Surveillance' },

  // Diseases
  { kind: 'disease', title: 'EHP — Enterocytozoon hepatopenaei',                   meta: 'Hard-fail · stunts growth',        tag: 'Critical' },
  { kind: 'disease', title: 'WSSV — White Spot Syndrome Virus',                    meta: 'Hard-fail · 100% mortality',       tag: 'Critical' },
  { kind: 'disease', title: 'AHPND / Early Mortality Syndrome',                    meta: 'V. parahaemolyticus toxin',        tag: 'Critical' },
  { kind: 'disease', title: 'BGD — Black Gill Disease',                            meta: 'Fungal · gill discolouration',     tag: 'Moderate' },
  { kind: 'disease', title: 'HPV — Hepatopancreatic Parvovirus',                   meta: 'Stunting + mortality',             tag: 'Moderate' },
  { kind: 'disease', title: 'WFS — White Faeces Syndrome',                         meta: 'Gut microbiome dysbiosis',         tag: 'Moderate' },

  // Species
  { kind: 'species', title: 'Litopenaeus vannamei',                                 meta: 'Whiteleg shrimp · 28-32°C · 15-25 ppt', tag: 'Prawn' },
  { kind: 'species', title: 'Penaeus monodon',                                     meta: 'Black tiger · 26-32°C · 10-25 ppt',     tag: 'Prawn' },
  { kind: 'species', title: 'Macrobrachium rosenbergii',                           meta: 'Scampi · freshwater + brackish',         tag: 'Prawn' },
  { kind: 'species', title: 'Labeo rohita',                                        meta: 'Rohu · IMC · freshwater',                tag: 'Fish'  },
  { kind: 'species', title: 'Lates calcarifer',                                    meta: 'Asian seabass · brackish · cage farming',tag: 'Fish'  },
  { kind: 'species', title: 'Scylla serrata',                                      meta: 'Mud crab · mangrove · live export',      tag: 'Crab'  },
];

function ItemCard({ item }: { item: Item }) {
  const Icon =
    item.kind === 'video' ? Video
    : item.kind === 'course' ? GraduationCap
    : item.kind === 'paper' ? FileText
    : item.kind === 'disease' ? Bug
    : item.kind === 'species' ? Fish
    : BookOpen;
  const accent =
    item.kind === 'video' ? '#fb923c'
    : item.kind === 'course' ? '#34d399'
    : item.kind === 'paper' ? '#a78bfa'
    : item.kind === 'disease' ? '#f87171'
    : item.kind === 'species' ? '#38bdf8'
    : '#facc15';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer group transition"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg shrink-0" style={{ background: `${accent}22` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white leading-snug group-hover:text-cyan-300 transition">
            {item.title}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-white/40">
            <Clock className="w-3 h-3" /> {item.meta}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {item.tag && (
          <span className="px-2 py-0.5 rounded-full text-[10px] border border-white/10 bg-white/[0.04] text-white/60">
            {item.tag}
          </span>
        )}
        {item.lang?.map((l) => (
          <span key={l} className="px-2 py-0.5 rounded-full text-[10px] border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
            {l}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function KnowledgeHubModule() {
  const [tab, setTab] = useState<Kind>('article');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    return ITEMS.filter(
      (i) =>
        i.kind === tab &&
        (!query ||
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          (i.tag ?? '').toLowerCase().includes(query.toLowerCase())),
    );
  }, [tab, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knowledge hub…"
            className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 flex-1"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white/60 hover:text-white">
          <MessageCircleQuestion className="w-4 h-4 text-cyan-400" /> Ask an expert
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = id === tab;
          const count = ITEMS.filter((i) => i.kind === id).length;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
                active
                  ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300'
                  : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label} <span className="text-white/30">· {count}</span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-sm text-white/30">No matches for "{query}"</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it, i) => <ItemCard key={i} item={it} />)}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
        <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs text-white/50">
          Sources: ICAR-CIBA · ICAR-NBFGR · MPEDA circulars · OIE/WOAH disease standards · peer-reviewed journals
        </span>
        <Microscope className="w-4 h-4 text-violet-400 ml-auto shrink-0" />
      </div>
    </div>
  );
}
