import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, AlertTriangle, IndianRupee,
  Truck, Package, Shield, Microscope, Droplets, Users, Landmark,
  Building2, ThermometerSun,
} from 'lucide-react';
import type { Role } from './RoleSelector';

type Kpi = {
  label: string;
  value: string;
  delta?: { dir: 'up' | 'down' | 'flat'; text: string };
  icon: React.ElementType;
  color: string;
  sub?: string;
};

const KPIS: Record<Role, Kpi[]> = {
  farmer: [
    { label: 'Pond health',       value: 'Good',     delta: { dir: 'up',   text: '+4 pts vs yesterday' }, icon: Droplets,       color: '#34d399' },
    { label: 'Today\'s price',    value: '₹320/kg',  delta: { dir: 'up',   text: '+₹12 (40-ct)' },        icon: IndianRupee,    color: '#facc15' },
    { label: 'Days to harvest',   value: '32 days',  sub: 'Vannamei · 90 DOC',                            icon: Activity,       color: '#38bdf8' },
    { label: 'Outbreaks nearby',  value: '2',        delta: { dir: 'up',   text: '5 km radius' },         icon: AlertTriangle,  color: '#f87171' },
  ],
  vle: [
    { label: 'Active farms',      value: '18',       delta: { dir: 'up',   text: '+2 this month' },       icon: Users,          color: '#38bdf8' },
    { label: 'QC sessions (7d)',  value: '42',       delta: { dir: 'up',   text: '+12 vs last week' },    icon: Microscope,     color: '#a78bfa' },
    { label: 'Avg QS score',      value: '87',       delta: { dir: 'up',   text: '+3 vs cycle' },         icon: TrendingUp,     color: '#34d399' },
    { label: 'Commissions MTD',   value: '₹14,200',  delta: { dir: 'up',   text: '78% of target' },       icon: IndianRupee,    color: '#facc15' },
  ],
  hatchery: [
    { label: 'Active batches',    value: '8',        sub: '5 ready · 2 reserved · 1 in QC',               icon: Package,        color: '#a78bfa' },
    { label: 'Avg buyer rating',  value: '4.7',      delta: { dir: 'up',   text: '+0.1 this month' },     icon: TrendingUp,     color: '#34d399' },
    { label: 'Pending dispatch',  value: '3 lakh PL',sub: '→ Krishna Farms tomorrow',                     icon: Truck,          color: '#fb923c' },
    { label: 'Disputes',          value: '0',        delta: { dir: 'down', text: '-2 vs last cycle' },    icon: AlertTriangle,  color: '#f87171' },
  ],
  transporter: [
    { label: 'Active shipments',  value: '4',        sub: '2 cold · 1 live haul · 1 reefer',              icon: Truck,          color: '#fb923c' },
    { label: 'Utilisation (7d)',  value: '78%',      delta: { dir: 'up',   text: '+6% vs avg' },          icon: TrendingUp,     color: '#34d399' },
    { label: 'Empty miles',       value: '12%',      delta: { dir: 'down', text: '-3% improvement' },     icon: Activity,       color: '#38bdf8' },
    { label: 'Earnings MTD',      value: '₹2.4 L',   delta: { dir: 'up',   text: '+18% vs target' },      icon: IndianRupee,    color: '#facc15' },
  ],
  supplier: [
    { label: 'Open orders',       value: '23',       delta: { dir: 'up',   text: '+5 today' },            icon: Package,        color: '#fb923c' },
    { label: 'Delivery routes',   value: '7',        sub: '2 same-day · 5 next-day',                      icon: Truck,          color: '#38bdf8' },
    { label: 'Capacity used',     value: '64%',      delta: { dir: 'up',   text: '+9% vs last week' },    icon: ThermometerSun, color: '#a78bfa' },
    { label: 'Revenue MTD',       value: '₹8.7 L',   delta: { dir: 'up',   text: '+22%' },                icon: IndianRupee,    color: '#facc15' },
  ],
  trader: [
    { label: 'Bulk RFQs open',    value: '11',       sub: '6 awaiting quotes · 5 closing this week',      icon: Package,        color: '#fb923c' },
    { label: 'Export FOB (40-ct)',value: '$4.85/kg', delta: { dir: 'up',   text: '+$0.12' },              icon: IndianRupee,    color: '#facc15' },
    { label: 'Rejection rate',    value: '2.3%',     delta: { dir: 'down', text: '-0.4% vs Q1' },         icon: TrendingDown,   color: '#34d399' },
    { label: 'Consignments (Q)',  value: '47',       delta: { dir: 'up',   text: '+11 vs Q1' },           icon: Truck,          color: '#38bdf8' },
  ],
  bank: [
    { label: 'Farms in book',     value: '342',      delta: { dir: 'up',   text: '+18 this month' },     icon: Landmark,       color: '#facc15' },
    { label: 'Band A share',      value: '61%',      delta: { dir: 'up',   text: '+4% YoY' },             icon: TrendingUp,     color: '#34d399' },
    { label: 'Default risk',      value: '2.8%',     delta: { dir: 'down', text: '-0.6% vs Q1' },         icon: TrendingDown,   color: '#38bdf8' },
    { label: 'Sanctioned MTD',    value: '₹1.4 Cr',  delta: { dir: 'up',   text: '92% of cap' },          icon: IndianRupee,    color: '#a78bfa' },
  ],
  govt: [
    { label: 'Surveilled farms',  value: '8,432',    delta: { dir: 'up',   text: '+612 vs Q1' },          icon: Shield,         color: '#f87171' },
    { label: 'Active outbreaks',  value: '6',        sub: '2 high · 2 medium · 2 low',                    icon: AlertTriangle,  color: '#fb923c' },
    { label: 'NSPAAD reports',    value: '342',      delta: { dir: 'up',   text: '+24 this week' },       icon: Building2,      color: '#a78bfa' },
    { label: 'Compliance score',  value: '94%',      delta: { dir: 'up',   text: '+2% YoY' },             icon: TrendingUp,     color: '#34d399' },
  ],
};

function DeltaPill({ delta }: { delta: NonNullable<Kpi['delta']> }) {
  const tone = delta.dir === 'up' ? 'text-emerald-400' : delta.dir === 'down' ? 'text-emerald-400' : 'text-foreground/40';
  const Icon = delta.dir === 'up' ? TrendingUp : delta.dir === 'down' ? TrendingDown : Activity;
  return (
    <div className={`flex items-center gap-1 text-[11px] ${tone}`}>
      <Icon className="w-3 h-3" />
      <span>{delta.text}</span>
    </div>
  );
}

export function KpiDashboard({ role }: { role: Role }) {
  const kpis = KPIS[role];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <motion.div
            key={role + k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative p-5 rounded-2xl border border-border bg-card backdrop-blur-sm overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
              style={{ background: k.color }}
            />
            <Icon className="w-4 h-4 mb-3" style={{ color: k.color }} />
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 tabular-nums">{k.value}</div>
            <div className="text-xs text-foreground/50 mb-2">{k.label}</div>
            {k.delta && <DeltaPill delta={k.delta} />}
            {k.sub && !k.delta && <div className="text-[11px] text-foreground/30">{k.sub}</div>}
          </motion.div>
        );
      })}
    </div>
  );
}
