import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck, Snowflake, Container, Thermometer, MapPin,
  Route as RouteIcon, Gauge, ShieldCheck,
} from 'lucide-react';

type Vehicle = {
  type: string;
  capacity: string;
  use: string;
  ratePerKm: [number, number];
  cold: boolean;
  live: boolean;
};

const VEHICLES: Vehicle[] = [
  { type: 'Insulated mini-truck (Tata Ace)', capacity: '500-800 kg',        use: 'Local PL seed delivery',     ratePerKm: [8, 15],    cold: true,  live: false },
  { type: 'Insulated pickup (1 t)',          capacity: '1,000 kg',          use: 'Inter-district PL / harvest',ratePerKm: [15, 25],   cold: true,  live: false },
  { type: 'Refrigerated truck (small)',      capacity: '3 tonnes',          use: 'Harvest → processing',       ratePerKm: [25, 40],   cold: true,  live: false },
  { type: 'Refrigerated truck (medium)',     capacity: '9 tonnes',          use: 'Processor → port / airport', ratePerKm: [40, 60],   cold: true,  live: false },
  { type: 'Live haul tanker (oxygenated)',   capacity: '2-5 tonnes live',   use: 'Live shrimp / fingerlings',  ratePerKm: [50, 80],   cold: false, live: true  },
  { type: 'Reefer container truck',          capacity: '20-25 tonnes',      use: 'Export consignments',        ratePerKm: [80, 120],  cold: true,  live: false },
];

const ROUTES = [
  { from: 'Bhimavaram',         to: 'Visakhapatnam Port', state: 'Andhra Pradesh', kind: 'Export hub' },
  { from: 'Nellore',            to: 'Chennai Airport',    state: 'Andhra Pradesh', kind: 'Live air-freight' },
  { from: 'Krishna',            to: 'Hyderabad / Blr',    state: 'Andhra Pradesh', kind: 'Domestic mass market' },
  { from: 'East Godavari',      to: 'Kakinada Port',      state: 'Andhra Pradesh', kind: 'Export' },
  { from: 'Surat',              to: 'Pipavav Port',       state: 'Gujarat',        kind: 'Export corridor' },
  { from: 'Bhubaneswar',        to: 'Paradip Port',       state: 'Odisha',         kind: 'Export' },
  { from: 'Kolkata cluster',    to: 'Haldia Port',        state: 'West Bengal',    kind: 'Export' },
];

const LIVE_SHIPMENTS = [
  { id: 'AQ-2451', cargo: '12 t Vannamei',     vehicle: 'Reefer 20 ft',    route: 'Bhimavaram → Vizag', temp: '−2°C', eta: '02:15', status: 'On route'  },
  { id: 'AQ-2452', cargo: '3 lakh PL',         vehicle: 'Mini-truck',      route: 'Hatchery → Pond 17', temp: '24°C', eta: '00:38', status: 'On route'  },
  { id: 'AQ-2453', cargo: '900 kg live scampi',vehicle: 'O₂ tanker',       route: 'Krishna → Hyd',      temp: '26°C', eta: '04:02', status: 'O₂ 87%'    },
  { id: 'AQ-2454', cargo: '8 t Rohu (ice)',    vehicle: 'Refer 9 t',       route: 'EG → Kakinada',      temp: '0°C',  eta: '01:20', status: 'Delayed' },
];

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'Delayed' ? 'text-red-400 bg-red-400/10 border-red-400/20'
    : status.startsWith('O₂') ? 'text-amber-300 bg-amber-400/10 border-amber-400/20'
    : 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${tone}`}>{status}</span>;
}

export function LogisticsModule() {
  const [section, setSection] = useState<'vehicles' | 'routes' | 'live'>('vehicles');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'vehicles' as const, label: 'Vehicle Categories', icon: Truck },
          { id: 'routes' as const,   label: 'Pre-Mapped Routes',  icon: RouteIcon },
          { id: 'live' as const,     label: 'Live Shipments',     icon: Gauge },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
              section === id
                ? 'border-orange-400/40 bg-orange-400/10 text-orange-300'
                : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {section === 'vehicles' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Vehicle', 'Capacity', 'Typical Use', 'Rate ₹/km', 'Cold', 'Live'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((v, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/90 font-medium">{v.type}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{v.capacity}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{v.use}</td>
                  <td className="px-4 py-3 font-bold text-orange-400 tabular-nums">₹{v.ratePerKm[0]}-{v.ratePerKm[1]}</td>
                  <td className="px-4 py-3">{v.cold && <Snowflake className="w-4 h-4 text-sky-400" />}</td>
                  <td className="px-4 py-3">{v.live && <Thermometer className="w-4 h-4 text-emerald-400" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {section === 'routes' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROUTES.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 mb-3">
                <MapPin className="w-3 h-3" /> {r.state}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/90 mb-1">
                <span className="font-semibold">{r.from}</span>
                <RouteIcon className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-semibold">{r.to}</span>
              </div>
              <div className="text-xs text-white/40">{r.kind}</div>
            </div>
          ))}
        </motion.div>
      )}

      {section === 'live' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {LIVE_SHIPMENTS.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="font-mono text-xs text-white/40">{s.id}</div>
              <Container className="w-4 h-4 text-orange-400" />
              <div className="text-sm text-white/90 flex-1 min-w-[140px]">{s.cargo}</div>
              <div className="text-xs text-white/50">{s.vehicle}</div>
              <div className="text-xs text-white/40 flex-1 min-w-[140px]">{s.route}</div>
              <div className="flex items-center gap-1 text-xs text-sky-300">
                <Thermometer className="w-3 h-3" /> {s.temp}
              </div>
              <div className="text-xs text-white/40">ETA {s.eta}h</div>
              <StatusBadge status={s.status} />
            </div>
          ))}
          <div className="flex items-center gap-2 text-[10px] text-white/30 pt-2">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> KYC-verified drivers · transit insurance · e-way bill auto-generated
          </div>
        </motion.div>
      )}
    </div>
  );
}
