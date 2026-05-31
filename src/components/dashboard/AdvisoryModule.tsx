import { motion } from 'framer-motion';
import {
  CalendarDays, CloudRain, MessageCircle, Phone, BookOpen,
  Users, Bell, Languages, AlertTriangle,
} from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';

const CROP_CALENDAR = [
  { day: 'D-0',   stage: 'Pond Prep',      action: 'Lime, dry, fill, fertilise' },
  { day: 'D+5',   stage: 'Stocking',       action: 'PL acclimatisation 2-3 hrs' },
  { day: 'D+15',  stage: 'Nursery',        action: 'Starter feed 4×/day' },
  { day: 'D+30',  stage: 'Early Grow',     action: 'Add aerators, water exchange 10%' },
  { day: 'D+60',  stage: 'Mid Grow',       action: 'Probiotics, monitor DO' },
  { day: 'D+90',  stage: 'Late Grow',      action: 'Reduce feed protein, prep for harvest' },
  { day: 'D+110', stage: 'Pre-Harvest',    action: 'Final QC + buyer match' },
  { day: 'D+120', stage: 'Harvest',        action: 'Net out, ice, ship' },
];

const ALERTS = [
  { kind: 'outbreak',   label: 'EHP cluster 3.2 km E',  detail: '2 farms confirmed, last 48h', severity: 'high'   },
  { kind: 'weather',    label: 'Heavy rain alert',      detail: 'IMD: 65mm tonight',           severity: 'medium' },
  { kind: 'water',      label: 'DO low — Pond 3',       detail: '3.1 mg/L · sensor #14',       severity: 'medium' },
  { kind: 'price',      label: 'Vannamei 40-ct ↑ 6%',   detail: 'Krishna mandi today',         severity: 'low'    },
];

const SCHEMES = [
  { name: 'PMMSY', desc: 'Pradhan Mantri Matsya Sampada Yojana', match: '92%' },
  { name: 'NFDB',  desc: 'Working capital — pond input loans',    match: '78%' },
  { name: 'State AP', desc: 'Aerator subsidy 40%',                match: '85%' },
];

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === 'high' ? '#f87171' : severity === 'medium' ? '#fb923c' : '#34d399';
  return (
    <span className="relative flex w-2 h-2 shrink-0">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: color }} />
      <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: color }} />
    </span>
  );
}

export function AdvisoryModule() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-foreground">Crop Calendar</span>
          <span className="text-xs text-foreground/30">— 120-day Vannamei cycle</span>
        </div>
        <div className="space-y-2">
          {CROP_CALENDAR.map((s, i) => (
            <motion.div
              key={s.day}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card"
            >
              <div className="font-mono text-xs text-emerald-400 w-14 shrink-0">{s.day}</div>
              <div className="text-sm text-foreground/90 font-medium w-32 shrink-0">{s.stage}</div>
              <div className="text-xs text-foreground/50 flex-1">{s.action}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-foreground">Live Alerts</span>
            <span className="ml-auto text-[10px] text-foreground/30">5 km radius</span>
          </div>
          <div className="space-y-3">
            {ALERTS.map((a) => (
              <div key={a.label} className="flex items-start gap-3">
                <SeverityDot severity={a.severity} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground/90 truncate">{a.label}</div>
                  <div className="text-[11px] text-foreground/40 truncate">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold text-foreground">Weather (IMD)</span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-3xl font-bold text-foreground">29°</div>
              <div className="text-xs text-foreground/40">Bhimavaram · partly cloudy</div>
            </div>
            <div className="ml-auto text-right text-xs">
              <div className="text-amber-300 flex items-center gap-1 justify-end"><AlertTriangle className="w-3 h-3" /> heavy rain 65mm</div>
              <div className="text-foreground/40 mt-1">DO drop risk · monitor pond 3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <VoiceAssistant />
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-semibold text-foreground">Govt Schemes Match</span>
        </div>
        <div className="space-y-2">
          {SCHEMES.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-card">
              <div>
                <div className="text-sm text-foreground/90 font-medium">{s.name}</div>
                <div className="text-[11px] text-foreground/40">{s.desc}</div>
              </div>
              <span className="text-xs font-bold text-emerald-400">{s.match}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-semibold text-foreground">Community</span>
        </div>
        <ul className="text-sm text-foreground/70 space-y-2">
          <li>• Farmer forums by district & species</li>
          <li>• VLE directory with ratings</li>
          <li>• Hatchery QC leaderboard</li>
          <li className="flex items-center gap-1.5 text-teal-300">
            <Phone className="w-3.5 h-3.5" /> Book vet consultation
          </li>
        </ul>
      </div>
    </div>
  );
}
