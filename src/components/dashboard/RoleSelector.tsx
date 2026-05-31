import { motion } from 'framer-motion';
import {
  User, UserCheck, Factory, Truck, Snowflake,
  Briefcase, Landmark, ShieldCheck,
} from 'lucide-react';

export type Role =
  | 'farmer' | 'vle' | 'hatchery' | 'transporter'
  | 'supplier' | 'trader' | 'bank' | 'govt';

export const ROLES: { id: Role; label: string; icon: React.ElementType; accent: string }[] = [
  { id: 'farmer',      label: 'Farmer',          icon: User,        accent: '#34d399' },
  { id: 'vle',         label: 'VLE / Agent',     icon: UserCheck,   accent: '#38bdf8' },
  { id: 'hatchery',    label: 'Hatchery',        icon: Factory,     accent: '#a78bfa' },
  { id: 'transporter', label: 'Transporter',     icon: Truck,       accent: '#fb923c' },
  { id: 'supplier',    label: 'Ice / O₂ Supply', icon: Snowflake,   accent: '#60a5fa' },
  { id: 'trader',      label: 'Trader / Export', icon: Briefcase,   accent: '#f472b6' },
  { id: 'bank',        label: 'Bank / Insurer',  icon: Landmark,    accent: '#facc15' },
  { id: 'govt',        label: 'MPEDA / Govt',    icon: ShieldCheck, accent: '#f87171' },
];

export function RoleSelector({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLES.map(({ id, label, icon: Icon, accent }) => {
        const active = id === role;
        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition ${
              active
                ? 'border-border bg-card text-foreground'
                : 'border-border bg-card text-foreground/50 hover:text-foreground/80 hover:bg-muted'
            }`}
            style={active ? { boxShadow: `0 0 24px ${accent}33` } : undefined}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: active ? accent : undefined }} />
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
