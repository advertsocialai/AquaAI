import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  KeyRound, BrainCircuit, IndianRupee, ShoppingCart, Truck, LifeBuoy,
} from 'lucide-react';
import { RoleSelector, type Role } from './RoleSelector';
import { OnboardingModule } from './OnboardingModule';
import { PricingModule } from './PricingModule';
import { MarketplaceModule } from './MarketplaceModule';
import { LogisticsModule } from './LogisticsModule';
import { AdvisoryModule } from './AdvisoryModule';

import { SeedScanner } from '@/components/SeedScanner';
import { DiagnosisDemo } from '@/components/DiagnosisDemo';
import { GradCamViewer } from '@/components/GradCamViewer';
import { BatchExtrapolator } from '@/components/BatchExtrapolator';
import { CertificateVerify } from '@/components/CertificateVerify';
import { OutbreakMap } from '@/components/OutbreakMap';
import { WaterQualityPanel } from '@/components/WaterQualityPanel';
import { ContinuousLearning } from '@/components/ContinuousLearning';

const TABS = [
  { id: 'onboarding',  label: 'Onboarding',   short: 'M1', icon: KeyRound,     accent: '#38bdf8' },
  { id: 'diagnostics', label: 'Diagnostics',  short: 'M2', icon: BrainCircuit, accent: '#a78bfa' },
  { id: 'pricing',     label: 'Pricing',      short: 'M3', icon: IndianRupee,  accent: '#34d399' },
  { id: 'marketplace', label: 'Marketplace',  short: 'M4', icon: ShoppingCart, accent: '#fb923c' },
  { id: 'logistics',   label: 'Logistics',    short: 'M5', icon: Truck,        accent: '#f472b6' },
  { id: 'advisory',    label: 'Advisory',     short: 'M6', icon: LifeBuoy,     accent: '#facc15' },
];

function DiagnosticsModule() {
  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Seed Counter</div>
          <SeedScanner />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Disease &amp; Quality</div>
          <DiagnosisDemo />
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Explainable AI (Grad-CAM)</div>
        <GradCamViewer />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Batch Extrapolation</div>
        <BatchExtrapolator />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Tamper-Evident QC Certificate</div>
        <CertificateVerify />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Outbreak Map</div>
          <OutbreakMap />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Water Quality</div>
          <WaterQualityPanel />
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/30 mb-2">Continuous Learning</div>
        <ContinuousLearning />
      </div>
    </div>
  );
}

export function AquaDashboard() {
  const [role, setRole] = useState<Role>('farmer');
  const [tab, setTab] = useState(TABS[1].id);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest text-white/30">View As</div>
          <div className="text-[11px] text-white/30">Role-based access · multi-role support</div>
        </div>
        <RoleSelector role={role} onChange={setRole} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full h-auto flex-wrap justify-start bg-white/[0.03] border border-white/10 p-1.5 gap-1">
          {TABS.map(({ id, label, short, icon: Icon, accent }) => {
            const active = id === tab;
            return (
              <TabsTrigger
                key={id}
                value={id}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 hover:text-white/80 transition gap-2 px-3 py-2 rounded-md"
              >
                <Icon className="w-3.5 h-3.5" style={{ color: active ? accent : undefined }} />
                <span className="hidden sm:inline">{label}</span>
                <span className="text-[10px] font-mono text-white/30">{short}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map(({ id, label, icon: Icon, accent }) => (
          <TabsContent key={id} value={id} className="mt-6">
            <motion.div
              key={id + role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg" style={{ background: `${accent}22` }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <h3 className="text-lg font-semibold text-white">{label}</h3>
                <div className="ml-auto text-[10px] text-white/30 font-mono">
                  {role.toUpperCase()}
                </div>
              </div>
              {id === 'onboarding'  && <OnboardingModule role={role} />}
              {id === 'diagnostics' && <DiagnosticsModule />}
              {id === 'pricing'     && <PricingModule />}
              {id === 'marketplace' && <MarketplaceModule />}
              {id === 'logistics'   && <LogisticsModule />}
              {id === 'advisory'    && <AdvisoryModule />}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
