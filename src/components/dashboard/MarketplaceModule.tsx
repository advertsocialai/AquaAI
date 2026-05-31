import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Fan, Snowflake, Microscope, Construction, Sprout,
  ShoppingCart, BadgeCheck,
} from 'lucide-react';

type Item = { name: string; spec: string; low: number; high: number; unit?: string };
type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  items: Item[];
};

const CATEGORIES: Category[] = [
  {
    id: 'seed-feed',
    label: 'Seed, Feed & Inputs',
    icon: Sprout,
    accent: '#34d399',
    items: [
      { name: 'PL Seed (MPEDA hatchery)',   spec: 'L. vannamei, AI-QC linked',  low: 0.30, high: 0.55, unit: '₹/PL' },
      { name: 'Tilapia Fingerlings',        spec: 'GIFT strain, 5-10g',         low: 2.5,  high: 5,    unit: '₹/pc' },
      { name: 'Starter Feed (CP/Avanti)',   spec: '40% protein, crumble',       low: 95,   high: 130,  unit: '₹/kg' },
      { name: 'Grower Feed',                spec: '36-38% protein, pellet',     low: 80,   high: 110,  unit: '₹/kg' },
      { name: 'Probiotic / Immunostim',     spec: 'water + gut blend',          low: 350,  high: 800,  unit: '₹/kg' },
      { name: 'Test Kits — full set',       spec: 'pH, DO, NH3, NO2, salinity', low: 1200, high: 3500, unit: '₹/set' },
      { name: 'Quicklime (CaO)',            spec: 'EHP eradication grade',      low: 8,    high: 14,   unit: '₹/kg' },
    ],
  },
  {
    id: 'aeration',
    label: 'Aeration & Oxygen',
    icon: Fan,
    accent: '#38bdf8',
    items: [
      { name: 'Paddle wheel aerator',  spec: '1 HP · 0.5 acre',         low: 18000,  high: 28000  },
      { name: 'Paddle wheel aerator',  spec: '2 HP · 1 acre',           low: 32000,  high: 45000  },
      { name: 'Aspirator aerator',     spec: 'submersible / per HP',    low: 12000,  high: 25000  },
      { name: 'Diffused aeration',     spec: 'per acre complete',       low: 80000,  high: 150000 },
      { name: 'Liquid O₂ tank',        spec: '250 L',                   low: 35000,  high: 55000  },
      { name: 'Liquid O₂ tank',        spec: '500 L',                   low: 65000,  high: 95000  },
      { name: 'O₂ cylinder',           spec: 'medical grade · 47 L',    low: 8000,   high: 12000  },
      { name: 'PSA O₂ generator',      spec: '10 LPM',                  low: 180000, high: 280000 },
      { name: 'PSA O₂ generator',      spec: '20 LPM',                  low: 300000, high: 450000 },
      { name: 'Emergency O₂ kit',      spec: 'transport · 1-2 hr',      low: 4500,   high: 8000   },
    ],
  },
  {
    id: 'cold-chain',
    label: 'Ice & Cold Chain',
    icon: Snowflake,
    accent: '#60a5fa',
    items: [
      { name: 'Block Ice (bulk)',        spec: 'delivered',                   low: 3,       high: 6,       unit: '₹/kg' },
      { name: 'Flake Ice (hatchery)',    spec: 'hatchery grade',              low: 5,       high: 9,       unit: '₹/kg' },
      { name: 'Ice Plant — small',       spec: '1 tonne / day',               low: 450000,  high: 700000   },
      { name: 'Ice Plant — medium',      spec: '5 tonnes / day',              low: 1800000, high: 2800000  },
      { name: 'Ice Plant — large',       spec: '10+ tonnes / day',            low: 4000000, high: 7500000  },
      { name: 'Insulated Fish Box',      spec: '50 L',                        low: 1200,    high: 2500     },
      { name: 'Insulated Fish Box',      spec: '200 L',                       low: 4500,    high: 8000     },
      { name: 'Insulated Fish Box',      spec: '500 L',                       low: 12000,   high: 22000    },
      { name: 'Reefer (20 ft) rental',   spec: 'per day',                     low: 2500,    high: 4500,    unit: '₹/day' },
      { name: 'Reefer (40 ft) rental',   spec: 'per day',                     low: 4500,    high: 7500,    unit: '₹/day' },
      { name: 'Cold Storage',            spec: 'per kg / day',                low: 1.5,     high: 4,       unit: '₹/kg-day' },
    ],
  },
  {
    id: 'diagnostic',
    label: 'Diagnostic Hardware',
    icon: Microscope,
    accent: '#a78bfa',
    items: [
      { name: 'USB Pen Microscope',       spec: '400-1000x · LED',          low: 1500, high: 5000 },
      { name: 'IntensLight LED ring',     spec: '5 brightness levels',      low: 500,  high: 1500 },
      { name: 'White Counting Tray',      spec: '20 × 20 cm acrylic',       low: 200,  high: 500  },
      { name: 'Phone Stand Clip',         spec: '20-25 cm height',          low: 150,  high: 400  },
      { name: 'Clip-on Macro Lens',       spec: '20-40× magnification',     low: 500,  high: 1500 },
      { name: 'Glass slides + covers',    spec: 'pack of 50 each',          low: 150,  high: 250  },
      { name: 'VLE Bundle Kit',           spec: 'complete diagnostic set',  low: 3000, high: 9150 },
    ],
  },
  {
    id: 'construction',
    label: 'Pond & Infrastructure',
    icon: Construction,
    accent: '#fb923c',
    items: [
      { name: 'HDPE Pond Liner',       spec: 'per sqm',           low: 45,     high: 120,    unit: '₹/sqm' },
      { name: 'Sluice Gate / Monk',    spec: 'standard pond',     low: 8000,   high: 25000   },
      { name: 'Bird Net / Predator',   spec: 'per acre',          low: 12000,  high: 30000   },
      { name: 'Genset',                spec: '5-25 kVA',          low: 35000,  high: 250000  },
      { name: 'Solar Pump + Panel',    spec: 'off-grid pond',     low: 65000,  high: 220000  },
      { name: 'Automatic Feeder',      spec: 'with belt system',  low: 18000,  high: 75000   },
      { name: 'IoT Sensor Pack',       spec: 'pH/DO/Temp/Salin.', low: 12000,  high: 45000   },
    ],
  },
];

function formatINR(n: number) {
  if (n < 100) return `₹${n}`;
  if (n < 100000) return `₹${n.toLocaleString('en-IN')}`;
  if (n < 10000000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`;
  return `₹${(n / 10000000).toFixed(1)} Cr`;
}

function ItemCard({ item, accent }: { item: Item; accent: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl border border-border bg-card hover:bg-muted transition group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{item.name}</div>
          <div className="text-xs text-foreground/40 truncate">{item.spec}</div>
        </div>
        <BadgeCheck className="w-4 h-4 shrink-0 opacity-60" style={{ color: accent }} />
      </div>
      <div className="flex items-baseline justify-between mt-3">
        <div>
          <div className="text-lg font-bold tabular-nums" style={{ color: accent }}>
            {formatINR(item.low)} – {formatINR(item.high)}
          </div>
          {item.unit && <div className="text-[10px] text-foreground/30">{item.unit}</div>}
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted transition text-xs text-foreground/70 opacity-0 group-hover:opacity-100">
          <ShoppingCart className="w-3 h-3" /> Quote
        </button>
      </div>
    </motion.div>
  );
}

export function MarketplaceModule() {
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === cat)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label, icon: Icon, accent, items }) => {
          const isActive = id === cat;
          return (
            <button
              key={id}
              onClick={() => setCat(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition ${
                isActive
                  ? 'border-border bg-card text-foreground'
                  : 'border-border bg-card text-foreground/50 hover:text-foreground/80'
              }`}
              style={isActive ? { boxShadow: `0 0 24px ${accent}22` } : undefined}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: isActive ? accent : undefined }} />
              {label}
              <span className="text-foreground/30">· {items.length}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {active.items.map((item, i) => (
          <ItemCard key={i} item={item} accent={active.accent} />
        ))}
      </motion.div>
    </div>
  );
}
