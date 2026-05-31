import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Package, MapPin, Clock, ThermometerSun, Wind,
  CheckCircle2, AlertTriangle, ChevronRight, Phone,
} from 'lucide-react';

type Status = 'scheduled' | 'loading' | 'in_transit' | 'delivered' | 'rejected';

type Dispatch = {
  id: string;
  batchId: string;
  buyer: string;
  destination: string;
  km: number;
  vehicle: string;
  cargoKind: 'live' | 'cold';
  count: string;
  scheduledFor: string;
  status: Status;
  tempC?: number;
  oxygenPct?: number;
  driver: string;
  driverPhone: string;
  etaHours?: number;
};

const DISPATCHES: Dispatch[] = [
  { id: 'DSP-2026-1124', batchId: 'HB-3401', buyer: 'Krishna Farms',     destination: 'Krishna, AP',     km:  62, vehicle: 'O₂ tanker',     cargoKind: 'live', count: '5 lakh PL-12', scheduledFor: 'Today 14:00', status: 'in_transit', tempC: 26.2, oxygenPct: 87, driver: 'P. Naidu',    driverPhone: '+91 98765 43210', etaHours: 1.2 },
  { id: 'DSP-2026-1125', batchId: 'HB-3402', buyer: 'Bhimavaram Cluster',destination: 'West Godavari, AP',km: 18, vehicle: 'Mini-truck',    cargoKind: 'live', count: '3 lakh PL-10', scheduledFor: 'Today 16:30', status: 'loading',    tempC: 24.0, oxygenPct: 95, driver: 'S. Murthy',   driverPhone: '+91 98765 43211' },
  { id: 'DSP-2026-1126', batchId: 'HB-3399', buyer: 'Nellore Agg.',      destination: 'Nellore, AP',     km: 240, vehicle: 'Refer 9 t',     cargoKind: 'cold', count: '8 t harvest',  scheduledFor: 'Tomorrow 06:00', status: 'scheduled', tempC: -1.5, driver: 'R. Kumar',    driverPhone: '+91 98765 43212' },
  { id: 'DSP-2026-1127', batchId: 'HB-3403', buyer: 'IFCO Exports',      destination: 'Vizag Port',      km: 180, vehicle: 'Reefer 20 ft',  cargoKind: 'cold', count: '12 t harvest', scheduledFor: 'Yesterday',     status: 'delivered', tempC: -2.0, driver: 'B. Reddy',    driverPhone: '+91 98765 43213' },
  { id: 'DSP-2026-1119', batchId: 'HB-3388', buyer: 'East Bengal H.',    destination: 'Kakdwip, WB',     km: 980, vehicle: 'Reefer 20 ft',  cargoKind: 'cold', count: '6 t harvest',  scheduledFor: 'Yesterday',     status: 'rejected',  tempC:  4.0, driver: 'A. Mondal',   driverPhone: '+91 98765 43214' },
];

const STATUS: Record<Status, { label: string; tone: string; bg: string }> = {
  scheduled:  { label: 'Scheduled',  tone: 'text-sky-300',     bg: 'bg-sky-400/10 border-sky-400/30' },
  loading:    { label: 'Loading',    tone: 'text-amber-300',   bg: 'bg-amber-400/10 border-amber-400/30' },
  in_transit: { label: 'In transit', tone: 'text-violet-300',  bg: 'bg-violet-400/10 border-violet-400/30' },
  delivered:  { label: 'Delivered',  tone: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  rejected:   { label: 'Rejected',   tone: 'text-red-300',     bg: 'bg-red-400/10 border-red-400/30' },
};

function StatusPill({ status }: { status: Status }) {
  const m = STATUS[status];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${m.tone} ${m.bg}`}>{m.label}</span>;
}

function HealthBar({ value, danger, color }: { value: number; danger: boolean; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-card overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: danger ? '#f87171' : color }}
        />
      </div>
      <span className={`text-xs tabular-nums ${danger ? 'text-red-300' : 'text-foreground/60'}`}>{value}%</span>
    </div>
  );
}

export function DispatchOrders() {
  const [selected, setSelected] = useState<string | null>('DSP-2026-1124');
  const active = DISPATCHES.find((d) => d.id === selected) ?? null;

  const stats = {
    total:    DISPATCHES.length,
    transit:  DISPATCHES.filter((d) => d.status === 'in_transit' || d.status === 'loading').length,
    scheduled:DISPATCHES.filter((d) => d.status === 'scheduled').length,
    alerts:   DISPATCHES.filter((d) => (d.oxygenPct ?? 100) < 90 || (d.cargoKind === 'cold' && (d.tempC ?? 0) > 0)).length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'All dispatches',    value: stats.total,     icon: Package,       color: '#a78bfa' },
          { label: 'On route / loading',value: stats.transit,   icon: Truck,         color: '#38bdf8' },
          { label: 'Scheduled',         value: stats.scheduled, icon: Clock,         color: '#34d399' },
          { label: 'Cold-chain alerts', value: stats.alerts,    icon: AlertTriangle, color: '#f87171' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-3 rounded-xl border border-border bg-card">
            <Icon className="w-3.5 h-3.5 mb-2" style={{ color }} />
            <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
            <div className="text-[11px] text-foreground/40">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-2">
          {DISPATCHES.map((d) => {
            const isLive = d.cargoKind === 'live';
            const alert = (d.oxygenPct ?? 100) < 90 || (d.cargoKind === 'cold' && (d.tempC ?? 0) > 0);
            return (
              <motion.button
                key={d.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelected(d.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                  selected === d.id
                    ? 'border-cyan-400/40 bg-cyan-400/5'
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <div className={`p-2 rounded-lg ${isLive ? 'bg-emerald-400/10' : 'bg-sky-400/10'}`}>
                  <Truck className={`w-4 h-4 ${isLive ? 'text-emerald-300' : 'text-sky-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-violet-300">{d.id}</span>
                    <StatusPill status={d.status} />
                    {alert && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  </div>
                  <div className="text-sm text-foreground/90 truncate">{d.count} → {d.buyer}</div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground/40 mt-0.5">
                    <MapPin className="w-3 h-3" />{d.destination} · {d.km} km
                    <span className="text-foreground/20">·</span>
                    <Clock className="w-3 h-3" />{d.scheduledFor}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/30" />
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-xl border border-border bg-card space-y-4"
              >
                <div>
                  <div className="font-mono text-xs text-violet-300">{active.id}</div>
                  <div className="text-sm font-semibold text-foreground mt-1">{active.batchId} · {active.count}</div>
                  <div className="text-[11px] text-foreground/40 mt-0.5">{active.buyer}</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/50 inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Destination
                    </span>
                    <span className="text-foreground">{active.destination} · {active.km} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/50 inline-flex items-center gap-1.5">
                      <Truck className="w-3 h-3" /> Vehicle
                    </span>
                    <span className="text-foreground">{active.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/50 inline-flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Scheduled
                    </span>
                    <span className="text-foreground">{active.scheduledFor}</span>
                  </div>
                  {active.etaHours !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/50">ETA</span>
                      <span className="text-cyan-300">{active.etaHours.toFixed(1)} h</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/30">Live telemetry</div>
                  {active.tempC !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/50 inline-flex items-center gap-1.5">
                        <ThermometerSun className="w-3 h-3 text-sky-300" /> Temp
                      </span>
                      <span className={`tabular-nums ${active.cargoKind === 'cold' && active.tempC > 0 ? 'text-red-300' : 'text-foreground'}`}>
                        {active.tempC.toFixed(1)} °C
                      </span>
                    </div>
                  )}
                  {active.oxygenPct !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/50 inline-flex items-center gap-1.5">
                        <Wind className="w-3 h-3 text-emerald-300" /> O₂
                      </span>
                      <HealthBar
                        value={active.oxygenPct}
                        danger={active.oxygenPct < 90}
                        color="#34d399"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/30">Driver</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{active.driver}</span>
                    <a
                      href={`tel:${active.driverPhone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>

                {active.status === 'delivered' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-xs text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Delivered. Buyer signed off on temperature log.
                  </div>
                )}
                {active.status === 'rejected' && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-400/10 border border-red-400/30 text-xs text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5" /> Rejected on arrival — cold-chain breach (+4°C). Dispute opened.
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 rounded-xl border border-dashed border-border bg-card text-sm text-foreground/30">
                Select a dispatch on the left.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
