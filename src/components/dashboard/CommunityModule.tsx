import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, Trophy, Star, TrendingUp, Search,
  MapPin, BadgeCheck, UserCheck,
} from 'lucide-react';

type Section = 'forums' | 'leaderboard' | 'stories' | 'vle';

const DISTRICTS = [
  { name: 'West Godavari',  state: 'AP', members: 4128, threads: 312, hot: 'EHP outbreak update — 14 affected' },
  { name: 'East Godavari',  state: 'AP', members: 3411, threads: 247, hot: 'Best CP feed price this week?' },
  { name: 'Krishna',        state: 'AP', members: 2876, threads: 198, hot: 'Vannamei 40-ct ₹12 jump — sell or hold?' },
  { name: 'Nellore',        state: 'AP', members: 2103, threads: 167, hot: 'Cyclone Aakash pond prep checklist' },
  { name: 'Bhimavaram',     state: 'AP', members: 1842, threads: 124, hot: 'PCR lab turnaround — best in district?' },
  { name: 'Surat',          state: 'GJ', members: 987,  threads: 71,  hot: 'Reefer to Pipavav — current rates' },
  { name: 'Bhubaneswar',    state: 'OD', members: 654,  threads: 48,  hot: 'Scampi vs vannamei for sandy ponds' },
  { name: 'Kakdwip',        state: 'WB', members: 489,  threads: 34,  hot: 'BGD in monodon — treatment options' },
];

const HATCHERY_RANK = [
  { rank: 1, name: 'Aquaprime Hatcheries',  district: 'Bhimavaram', avgQS: 94, batches: 142, rating: 4.9, mpeda: 'A++' },
  { rank: 2, name: 'BlueFin SPF Labs',      district: 'Nellore',    avgQS: 92, batches: 98,  rating: 4.8, mpeda: 'A+'  },
  { rank: 3, name: 'CoastalLine Hatchery',  district: 'Vizag',      avgQS: 90, batches: 76,  rating: 4.7, mpeda: 'A+'  },
  { rank: 4, name: 'AndhraMarine PLs',      district: 'Krishna',    avgQS: 88, batches: 64,  rating: 4.6, mpeda: 'A'   },
  { rank: 5, name: 'Sagar Seed Co.',        district: 'Surat',      avgQS: 85, batches: 41,  rating: 4.4, mpeda: 'A'   },
  { rank: 6, name: 'East Bengal Hatchery',  district: 'Kakdwip',    avgQS: 81, batches: 28,  rating: 4.2, mpeda: 'B+'  },
];

const STORIES = [
  { farmer: 'V. Ramana',    district: 'Bhimavaram', yield: '5.8 t/acre', profit: '₹4.2 L', story: 'Switched to MPEDA-A++ PLs + AquaI QC. Crop loss dropped from 18% to 4%.' },
  { farmer: 'K. Srinivasan',district: 'Nellore',    yield: '4.6 t/acre', profit: '₹3.1 L', story: 'Caught EHP at DOC-28 via app. Restocked clean batch. Saved entire crop.' },
  { farmer: 'A. Mohanty',   district: 'Paradip',    yield: '3.9 t/acre', profit: '₹2.4 L', story: 'Reverse-auction sold to Bangalore buyer at ₹18/kg premium.' },
];

const VLES = [
  { name: 'S. Naidu',     district: 'West Godavari', farms: 22, rating: 4.9, since: 'Apr 2024' },
  { name: 'R. Kumar',     district: 'Krishna',       farms: 18, rating: 4.8, since: 'Jun 2024' },
  { name: 'M. Lakshmi',   district: 'East Godavari', farms: 16, rating: 4.7, since: 'Mar 2024' },
  { name: 'B. Reddy',     district: 'Nellore',       farms: 14, rating: 4.6, since: 'Aug 2024' },
];

function MedalIcon({ rank }: { rank: number }) {
  const color = rank === 1 ? '#facc15' : rank === 2 ? '#cbd5e1' : rank === 3 ? '#fb923c' : '#475569';
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
         style={{ background: `${color}22`, color }}>
      #{rank}
    </div>
  );
}

export function CommunityModule() {
  const [section, setSection] = useState<Section>('forums');
  const [query, setQuery] = useState('');

  const districts = useMemo(
    () => DISTRICTS.filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'forums' as const,      label: 'District Forums',         icon: MessageSquare },
          { id: 'leaderboard' as const, label: 'Hatchery Leaderboard',    icon: Trophy },
          { id: 'stories' as const,     label: 'Success Stories',         icon: Star },
          { id: 'vle' as const,         label: 'VLE Directory',           icon: UserCheck },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
              section === id
                ? 'border-pink-400/40 bg-pink-400/10 text-pink-300'
                : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {section === 'forums' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 max-w-md">
            <Search className="w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search districts…"
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 flex-1"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {districts.map((d) => (
              <motion.button
                key={d.name}
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-left transition"
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest text-white/30">
                  <MapPin className="w-3 h-3" /> {d.state}
                </div>
                <div className="text-sm font-semibold text-white mb-1">{d.name}</div>
                <div className="flex items-center gap-3 text-[11px] text-white/40 mb-3">
                  <span>{d.members.toLocaleString('en-IN')} members</span>
                  <span>·</span>
                  <span>{d.threads} threads</span>
                </div>
                <div className="text-xs text-cyan-300 line-clamp-2">🔥 {d.hot}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {section === 'leaderboard' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['Rank', 'Hatchery', 'District', 'Avg QS', 'Batches', 'Rating', 'MPEDA Tier'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HATCHERY_RANK.map((h) => (
                  <tr key={h.name} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3"><MedalIcon rank={h.rank} /></td>
                    <td className="px-4 py-3 text-white/90 font-semibold inline-flex items-center gap-2">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" /> {h.name}
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{h.district}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400 tabular-nums">{h.avgQS}</td>
                    <td className="px-4 py-3 text-white/70 tabular-nums">{h.batches}</td>
                    <td className="px-4 py-3 inline-flex items-center gap-1 text-amber-300 text-xs">
                      <Star className="w-3 h-3 fill-amber-300" /> {h.rating}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-violet-300">{h.mpeda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-white/30 mt-3 inline-flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Driven by aggregated AI QC scores — not paid placement.
          </div>
        </motion.div>
      )}

      {section === 'stories' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-4">
          {STORIES.map((s) => (
            <div key={s.farmer} className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">{s.farmer}</div>
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-[11px] text-white/40 mb-3 inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {s.district}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">"{s.story}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Yield</div>
                  <div className="text-sm font-bold text-cyan-400 tabular-nums">{s.yield}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Cycle profit</div>
                  <div className="text-sm font-bold text-emerald-400 tabular-nums">{s.profit}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {section === 'vle' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VLES.map((v) => (
            <div key={v.name} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <div className="text-sm font-semibold text-white">{v.name}</div>
              </div>
              <div className="text-[11px] text-white/40 mb-3">{v.district} · since {v.since}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">{v.farms} farms</span>
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300" /> {v.rating}
                </span>
              </div>
              <button className="w-full mt-3 py-1.5 text-[11px] rounded-lg border border-white/10 hover:bg-white/10 text-white/70 transition">
                Book diagnostic visit
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
