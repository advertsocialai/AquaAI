import { lazy, Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  KeyRound, BrainCircuit, IndianRupee, ShoppingCart, Truck, LifeBuoy,
  Building2, Shield, Landmark, Calculator, BookOpen, MessageSquare,
  FileText, Settings, Loader2,
} from 'lucide-react';
import { RoleSelector, type Role } from './RoleSelector';
import { KpiDashboard } from './KpiDashboard';
import { LivePriceTicker } from './LivePriceTicker';
import { WeatherForecast } from './WeatherForecast';

// Lazy-load every heavy tab body. Each becomes its own chunk so the
// Aqua RudraPage initial download stays small. Tab payloads (charts, maps,
// PDFs, leaflet) are only fetched when the user opens that tab.
const OnboardingModule  = lazy(() => import('./OnboardingModule').then((m) => ({ default: m.OnboardingModule })));
const PricingModule     = lazy(() => import('./PricingModule').then((m)    => ({ default: m.PricingModule })));
const MarketplaceModule = lazy(() => import('./MarketplaceModule').then((m)=> ({ default: m.MarketplaceModule })));
const LogisticsModule   = lazy(() => import('./LogisticsModule').then((m)  => ({ default: m.LogisticsModule })));
const AdvisoryModule    = lazy(() => import('./AdvisoryModule').then((m)   => ({ default: m.AdvisoryModule })));
const B2BPortalModule   = lazy(() => import('./B2BPortalModule').then((m)  => ({ default: m.B2BPortalModule })));
const SurveillanceModule= lazy(() => import('./SurveillanceModule').then((m)=>({ default: m.SurveillanceModule })));
const RiskScoringModule = lazy(() => import('./RiskScoringModule').then((m)=> ({ default: m.RiskScoringModule })));
const CalculatorsModule = lazy(() => import('./CalculatorsModule').then((m)=> ({ default: m.CalculatorsModule })));
const KnowledgeHubModule= lazy(() => import('./KnowledgeHubModule').then((m)=>({ default: m.KnowledgeHubModule })));
const CommunityModule   = lazy(() => import('./CommunityModule').then((m)  => ({ default: m.CommunityModule })));
const ReportsModule     = lazy(() => import('./ReportsModule').then((m)    => ({ default: m.ReportsModule })));
const AdminModule       = lazy(() => import('./AdminModule').then((m)      => ({ default: m.AdminModule })));

const DiagnosticsModule = lazy(() => import('./DiagnosticsLazy'));

type TabId =
  | 'onboarding' | 'diagnostics' | 'pricing' | 'marketplace'
  | 'logistics' | 'advisory' | 'b2b' | 'surveillance' | 'risk'
  | 'calculators' | 'knowledge' | 'community' | 'reports' | 'admin';

const TABS: { id: TabId; label: string; short: string; icon: React.ElementType; accent: string }[] = [
  { id: 'onboarding',   label: 'Onboarding',   short: 'M1', icon: KeyRound,     accent: '#38bdf8' },
  { id: 'diagnostics',  label: 'Diagnostics',  short: 'M2', icon: BrainCircuit, accent: '#a78bfa' },
  { id: 'pricing',      label: 'Pricing',      short: 'M3', icon: IndianRupee,  accent: '#34d399' },
  { id: 'marketplace',  label: 'Marketplace',  short: 'M4', icon: ShoppingCart, accent: '#fb923c' },
  { id: 'logistics',    label: 'Logistics',    short: 'M5', icon: Truck,        accent: '#f472b6' },
  { id: 'advisory',     label: 'Advisory',     short: 'M6', icon: LifeBuoy,     accent: '#facc15' },
  { id: 'calculators',  label: 'Calculators',  short: 'CALC',icon: Calculator,  accent: '#38bdf8' },
  { id: 'knowledge',    label: 'Knowledge Hub',short: 'KB', icon: BookOpen,     accent: '#facc15' },
  { id: 'community',    label: 'Community',    short: 'COM',icon: MessageSquare,accent: '#f472b6' },
  { id: 'reports',      label: 'Reports',      short: 'RPT',icon: FileText,     accent: '#60a5fa' },
  { id: 'b2b',          label: 'B2B Portal',   short: 'B2B',icon: Building2,    accent: '#a78bfa' },
  { id: 'surveillance', label: 'Surveillance', short: 'GOV',icon: Shield,       accent: '#f87171' },
  { id: 'risk',         label: 'Risk Scoring', short: 'BNK',icon: Landmark,     accent: '#facc15' },
  { id: 'admin',        label: 'Admin',        short: 'ADM',icon: Settings,     accent: '#94a3b8' },
];

const ROLE_ACCESS: Record<Role, { default: TabId; tabs: TabId[] }> = {
  farmer:      { default: 'advisory',     tabs: ['onboarding', 'diagnostics', 'pricing', 'marketplace', 'logistics', 'advisory', 'calculators', 'knowledge', 'community', 'reports', 'admin'] },
  vle:         { default: 'diagnostics',  tabs: ['onboarding', 'diagnostics', 'pricing', 'marketplace', 'logistics', 'advisory', 'calculators', 'knowledge', 'community', 'reports', 'admin'] },
  hatchery:    { default: 'b2b',          tabs: ['onboarding', 'b2b', 'diagnostics', 'marketplace', 'logistics', 'advisory', 'calculators', 'knowledge', 'community', 'reports', 'admin'] },
  transporter: { default: 'logistics',    tabs: ['onboarding', 'logistics', 'advisory', 'knowledge', 'reports', 'admin'] },
  supplier:    { default: 'marketplace',  tabs: ['onboarding', 'marketplace', 'logistics', 'pricing', 'knowledge', 'reports', 'admin'] },
  trader:      { default: 'pricing',      tabs: ['onboarding', 'pricing', 'b2b', 'marketplace', 'logistics', 'knowledge', 'reports', 'admin'] },
  bank:        { default: 'risk',         tabs: ['onboarding', 'risk', 'pricing', 'advisory', 'knowledge', 'reports', 'admin'] },
  govt:        { default: 'surveillance', tabs: ['onboarding', 'surveillance', 'advisory', 'knowledge', 'community', 'reports', 'admin'] },
};

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-white/40">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Loading module…
    </div>
  );
}

export function AquaDashboard() {
  const [role, setRole] = useState<Role>('farmer');
  const [tab, setTab] = useState<TabId>(ROLE_ACCESS.farmer.default);

  useEffect(() => {
    const access = ROLE_ACCESS[role];
    if (!access.tabs.includes(tab)) setTab(access.default);
  }, [role, tab]);

  const visibleTabs = TABS.filter((t) => ROLE_ACCESS[role].tabs.includes(t.id));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-widest text-white/30">View As</div>
          <div className="text-[11px] text-white/30">
            {visibleTabs.length} module{visibleTabs.length === 1 ? '' : 's'} available · default: {TABS.find(t => t.id === ROLE_ACCESS[role].default)?.label}
          </div>
        </div>
        <RoleSelector role={role} onChange={setRole} />
      </div>

      <LivePriceTicker />

      {/* 7-day weather forecast with rain alarm */}
      <WeatherForecast />

      {/* Role-specific KPI summary (Module 01 — Dashboard) */}
      <KpiDashboard role={role} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList className="w-full h-auto flex-wrap justify-start bg-white/[0.03] border border-white/10 p-1.5 gap-1">
          {visibleTabs.map(({ id, label, short, icon: Icon, accent }) => {
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

        {visibleTabs.map(({ id, label, icon: Icon, accent }) => (
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
              <Suspense fallback={<TabLoader />}>
                {id === 'onboarding'   && <OnboardingModule role={role} />}
                {id === 'diagnostics'  && <DiagnosticsModule />}
                {id === 'pricing'      && <PricingModule />}
                {id === 'marketplace'  && <MarketplaceModule />}
                {id === 'logistics'    && <LogisticsModule />}
                {id === 'advisory'     && <AdvisoryModule />}
                {id === 'b2b'          && <B2BPortalModule />}
                {id === 'surveillance' && <SurveillanceModule />}
                {id === 'risk'         && <RiskScoringModule />}
                {id === 'calculators'  && <CalculatorsModule />}
                {id === 'knowledge'    && <KnowledgeHubModule />}
                {id === 'community'    && <CommunityModule />}
                {id === 'reports'      && <ReportsModule />}
                {id === 'admin'        && <AdminModule role={role} />}
              </Suspense>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
