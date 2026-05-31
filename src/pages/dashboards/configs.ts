import type { ElementType } from 'react';
import {
  Users, UserPlus, Microscope, GraduationCap, Wallet, BookOpen,
  Factory, FlaskConical, Boxes, ClipboardList, Package, ShieldCheck,
  Truck, Route, Thermometer, FileCheck,
  Snowflake, Droplets, Receipt, Warehouse,
  Landmark, FileSpreadsheet, TrendingUp, PieChart,
  Building2, AlertTriangle, BadgeCheck, BarChart3,
} from 'lucide-react';
import type { Role } from '@/components/dashboard/RoleSelector';

export type DashAction = { kind: 'urgent' | 'warning' | 'info'; title: string; meta: string; to: string };
export type DashTool = { icon: ElementType; label: string; sub: string; to: string; accent: string; bg: string };
export type DashActivity = { when: string; what: string; detail: string; status: 'ok' | 'alert' };
export type DashMetric = { label: string; value: string };

export type DashboardConfig = {
  title: string;
  greetingName: string;
  headlineLead: string;
  headlineSub: string;
  region: string;
  metrics: DashMetric[];
  actions: DashAction[];
  toolsHeading: string;
  tools: DashTool[];
  showPrices: boolean;
  pricesHeading: string;
  activityHeading: string;
  activity: DashActivity[];
  cta: { eyebrow: string; heading: string; body: string; label: string };
};

/** Single source of truth for every role's dashboard URL. */
export const DASHBOARD_ROUTE: Record<Role, string> = {
  farmer: '/farmer',
  vle: '/vle',
  hatchery: '/hatchery',
  transporter: '/transporter',
  supplier: '/supplier',
  trader: '/trader',
  bank: '/bank',
  govt: '/govt',
};

const DASH = '/aquaai#dashboard';

/** Config-driven dashboards for the non-bespoke roles
 *  (farmer + trader have their own hand-built pages). */
export const ROLE_DASHBOARDS: Partial<Record<Role, DashboardConfig>> = {
  vle: {
    title: 'VLE Dashboard — Aqua Rudra',
    greetingName: 'K. Lakshmi (VLE)',
    headlineLead: '34 farmers served',
    headlineSub: '8 sessions this week',
    region: 'Kaikalur cluster · Krishna Dist.',
    metrics: [
      { label: 'Farmers', value: '34' },
      { label: 'Sessions (wk)', value: '8' },
      { label: 'Commission', value: '₹12,400' },
    ],
    actions: [
      { kind: 'urgent',  title: '2 farmers flagged disease — need a visit', meta: 'Pond screens · today', to: DASH },
      { kind: 'warning', title: 'Onboarding KYC pending for 3 farmers',     meta: 'Aadhaar e-KYC',       to: DASH },
      { kind: 'info',    title: 'Payout ₹12,400 clears Friday',             meta: 'Net-weekly',          to: DASH },
    ],
    toolsHeading: 'Serve your farmers',
    tools: [
      { icon: UserPlus,      label: 'Onboard farmer', sub: 'KYC + farm setup',  to: '/signup',  accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: Microscope,    label: 'Run diagnostics', sub: 'On their behalf',   to: DASH,       accent: 'text-rose-300',    bg: 'bg-rose-400/10' },
      { icon: Users,         label: 'My farmers',     sub: '34 active',         to: DASH,       accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: GraduationCap, label: 'Training',       sub: 'Modules · certs',   to: '/knowledge', accent: 'text-violet-300', bg: 'bg-violet-400/10' },
      { icon: Wallet,        label: 'Commissions',    sub: 'Earnings · payouts', to: DASH,       accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: BookOpen,      label: 'Knowledge',      sub: 'Schemes · advice',  to: '/knowledge', accent: 'text-amber-300',  bg: 'bg-amber-400/10' },
    ],
    showPrices: true,
    pricesHeading: 'Prices to share with farmers',
    activityHeading: 'Your field log',
    activity: [
      { when: '1 h ago',   what: 'Diagnostic run',   detail: 'V. Ramana · Pond 2 · DO low',        status: 'alert' },
      { when: '3 h ago',   what: 'Farmer onboarded', detail: 'M. Suresh · KYC verified',           status: 'ok' },
      { when: 'Yesterday', what: 'Training session',  detail: '6 farmers · biofloc basics',         status: 'ok' },
      { when: '2 days ago', what: 'Commission paid',  detail: '₹9,800 · week 21',                   status: 'ok' },
    ],
    cta: { eyebrow: 'Verified VLE account', heading: 'Grow your farmer network', body: 'Create a VLE account to onboard farmers, run diagnostics on their behalf and earn commissions.', label: 'Sign up as VLE' },
  },

  hatchery: {
    title: 'Hatchery Dashboard — Aqua Rudra',
    greetingName: 'Sagar Hatcheries',
    headlineLead: '9 active PL batches',
    headlineSub: '14 broodstock tanks',
    region: 'Nellore · SPF facility',
    metrics: [
      { label: 'PL batches', value: '9' },
      { label: 'PLs ready', value: '4.2M' },
      { label: 'PCR pass', value: '96%' },
    ],
    actions: [
      { kind: 'urgent',  title: 'Batch B-12 PCR re-test due before sale', meta: 'WSSV panel · today', to: DASH },
      { kind: 'warning', title: 'Tank 7 temperature drift +1.8°C',        meta: 'Live sensor',        to: DASH },
      { kind: 'info',    title: '3 trader orders awaiting confirmation',  meta: '1.1M PLs',           to: DASH },
    ],
    toolsHeading: 'Run your hatchery',
    tools: [
      { icon: FlaskConical, label: 'PL quality',   sub: 'Stage · stress',    to: DASH, accent: 'text-rose-300',    bg: 'bg-rose-400/10' },
      { icon: Microscope,   label: 'Seed counter', sub: 'Tray → count',      to: DASH, accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: Boxes,        label: 'Batch lineage', sub: 'Broodstock → PL',  to: DASH, accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
      { icon: ClipboardList, label: 'PCR tests',   sub: 'WSSV · EHP panel',  to: DASH, accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: Package,      label: 'Orders',       sub: 'Trader demand',     to: DASH, accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: ShieldCheck,  label: 'Certificates', sub: 'SPF · MPEDA',       to: '/verify/QC-2026-04421', accent: 'text-amber-300', bg: 'bg-amber-400/10' },
    ],
    showPrices: false,
    pricesHeading: '',
    activityHeading: 'Production log',
    activity: [
      { when: '20 min ago', what: 'PCR result',     detail: 'Batch B-09 · WSSV negative',     status: 'ok' },
      { when: '2 h ago',    what: 'Seed count',     detail: 'Tank 4 · 1.18M PLs (±1.4%)',     status: 'ok' },
      { when: '6 h ago',    what: 'Temp alert',     detail: 'Tank 7 · +1.8°C drift',          status: 'alert' },
      { when: 'Yesterday',  what: 'Order shipped',  detail: '900K PLs → Prasad Exports',      status: 'ok' },
    ],
    cta: { eyebrow: 'Verified hatchery account', heading: 'List your PL batches', body: 'Create a hatchery account to publish SPF-certified PL batches with PCR lineage to verified buyers.', label: 'Sign up as Hatchery' },
  },

  transporter: {
    title: 'Transporter Dashboard — Aqua Rudra',
    greetingName: 'AP-39 Cold Logistics',
    headlineLead: '5 active trips',
    headlineSub: '2 reefers en route',
    region: 'Bhimavaram → Vizag port',
    metrics: [
      { label: 'Active trips', value: '5' },
      { label: 'On-time', value: '94%' },
      { label: 'Avg temp', value: '2.4°C' },
    ],
    actions: [
      { kind: 'urgent',  title: 'Reefer AP-39 temp rose to 6.1°C',      meta: 'Trip #T-882 · live',  to: DASH },
      { kind: 'warning', title: 'Pickup window closes 4 PM at Kaikalur', meta: '2,400 kg lot',        to: DASH },
      { kind: 'info',    title: '3 PODs awaiting upload',               meta: 'Yesterday\'s trips',   to: DASH },
    ],
    toolsHeading: 'Run your fleet',
    tools: [
      { icon: Truck,       label: 'My trips',   sub: '5 active',         to: DASH, accent: 'text-orange-300',  bg: 'bg-orange-400/10' },
      { icon: Route,       label: 'Route plan', sub: 'Optimise pickups', to: DASH, accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: Thermometer, label: 'Temp log',   sub: 'Cold-chain trace', to: DASH, accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: FileCheck,   label: 'PODs',       sub: 'Proof of delivery', to: DASH, accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: Package,     label: 'Loads',      sub: 'Available freight', to: DASH, accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
      { icon: BookOpen,    label: 'Knowledge',  sub: 'Cold-chain SOPs',  to: '/knowledge', accent: 'text-amber-300', bg: 'bg-amber-400/10' },
    ],
    showPrices: false,
    pricesHeading: '',
    activityHeading: 'Trip log',
    activity: [
      { when: '15 min ago', what: 'Temp excursion', detail: 'AP-39 · 6.1°C · trip #T-882',    status: 'alert' },
      { when: '2 h ago',    what: 'Trip started',   detail: 'Kaikalur → Vizag · 2,400 kg',    status: 'ok' },
      { when: '5 h ago',    what: 'POD uploaded',   detail: 'Trip #T-879 · signed',           status: 'ok' },
      { when: 'Yesterday',  what: 'Trip completed', detail: '4 stops · on-time',              status: 'ok' },
    ],
    cta: { eyebrow: 'Verified transporter account', heading: 'Find cold-chain loads', body: 'Create a transporter account to accept freight, log cold-chain temperature and upload digital PODs.', label: 'Sign up as Transporter' },
  },

  supplier: {
    title: 'Supplier Dashboard — Aqua Rudra',
    greetingName: 'Krishna Ice & O₂',
    headlineLead: '23 orders today',
    headlineSub: '4 depots active',
    region: 'West Godavari · Coastal AP',
    metrics: [
      { label: 'Orders today', value: '23' },
      { label: 'Fulfilled', value: '91%' },
      { label: 'Depots', value: '4' },
    ],
    actions: [
      { kind: 'urgent',  title: 'Depot 2 ice stock below reorder level', meta: '12% remaining',  to: DASH },
      { kind: 'warning', title: '5 O₂ cylinder orders need dispatch',     meta: 'Before 2 PM',    to: DASH },
      { kind: 'info',    title: '₹1.8L invoices pending collection',      meta: 'Net-15 terms',   to: DASH },
    ],
    toolsHeading: 'Run your supply',
    tools: [
      { icon: Snowflake, label: 'Orders',    sub: 'Ice · O₂ demand',   to: DASH, accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: Warehouse, label: 'Inventory', sub: 'Depot stock',       to: DASH, accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
      { icon: Truck,     label: 'Dispatch',  sub: 'Route deliveries',  to: DASH, accent: 'text-orange-300',  bg: 'bg-orange-400/10' },
      { icon: Receipt,   label: 'Invoices',  sub: 'Collect payments',  to: DASH, accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: Droplets,  label: 'O₂ levels', sub: 'Cylinder tracking', to: DASH, accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: BookOpen,  label: 'Knowledge', sub: 'Handling SOPs',     to: '/knowledge', accent: 'text-amber-300', bg: 'bg-amber-400/10' },
    ],
    showPrices: false,
    pricesHeading: '',
    activityHeading: 'Supply log',
    activity: [
      { when: '10 min ago', what: 'Order placed',   detail: 'Pond cluster K-4 · 600 kg ice', status: 'ok' },
      { when: '1 h ago',    what: 'Low stock',      detail: 'Depot 2 · ice 12%',             status: 'alert' },
      { when: '4 h ago',    what: 'Dispatched',     detail: '8 O₂ cylinders · Kaikalur',     status: 'ok' },
      { when: 'Yesterday',  what: 'Invoice paid',   detail: '₹64,000 · Prasad Exports',      status: 'ok' },
    ],
    cta: { eyebrow: 'Verified supplier account', heading: 'Sell ice & oxygen on demand', body: 'Create a supplier account to receive ice and O₂ orders from nearby farms with route-optimised dispatch.', label: 'Sign up as Supplier' },
  },

  bank: {
    title: 'Bank / Insurer Dashboard — Aqua Rudra',
    greetingName: 'Coastal Agri Finance',
    headlineLead: '48 loan applications',
    headlineSub: '₹3.2 Cr disbursed',
    region: 'Andhra Pradesh portfolio',
    metrics: [
      { label: 'Applications', value: '48' },
      { label: 'Disbursed', value: '₹3.2Cr' },
      { label: 'At-risk', value: '4.1%' },
    ],
    actions: [
      { kind: 'urgent',  title: '3 loans flagged high-risk by AI score', meta: 'Outbreak exposure', to: DASH },
      { kind: 'warning', title: '11 applications awaiting KYC review',    meta: 'Avg wait 2 days',   to: DASH },
      { kind: 'info',    title: '₹42L EMI collections due this week',     meta: 'On-time 95%',       to: DASH },
    ],
    toolsHeading: 'Manage your portfolio',
    tools: [
      { icon: FileSpreadsheet, label: 'Applications', sub: 'Review · approve',  to: DASH, accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: BarChart3,       label: 'Risk scoring', sub: 'AI farm-risk',      to: DASH, accent: 'text-rose-300',    bg: 'bg-rose-400/10' },
      { icon: Wallet,          label: 'Disbursements', sub: 'Release funds',    to: DASH, accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: PieChart,        label: 'Portfolio',    sub: 'Exposure · NPA',    to: DASH, accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
      { icon: TrendingUp,      label: 'Collections',  sub: 'EMI tracking',      to: DASH, accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: ShieldCheck,     label: 'Insurance',    sub: 'Claims · cover',    to: DASH, accent: 'text-amber-300',   bg: 'bg-amber-400/10' },
    ],
    showPrices: false,
    pricesHeading: '',
    activityHeading: 'Portfolio log',
    activity: [
      { when: '30 min ago', what: 'Risk flag',     detail: 'Loan #L-219 · outbreak zone',   status: 'alert' },
      { when: '2 h ago',    what: 'Loan approved', detail: '₹4.5L · V. Ramana · 18 mo',      status: 'ok' },
      { when: '5 h ago',    what: 'EMI collected', detail: '₹38,000 · on time',             status: 'ok' },
      { when: 'Yesterday',  what: 'KYC verified',  detail: 'M. Suresh · application',        status: 'ok' },
    ],
    cta: { eyebrow: 'Verified institution account', heading: 'Lend with AI farm-risk', body: 'Create an institutional account to underwrite aquaculture loans using live farm-health and outbreak data.', label: 'Sign up as Bank / Insurer' },
  },

  govt: {
    title: 'MPEDA / Govt Dashboard — Aqua Rudra',
    greetingName: 'District Fisheries Office',
    headlineLead: '1,240 registered farms',
    headlineSub: '3 active outbreak zones',
    region: 'West Godavari jurisdiction',
    metrics: [
      { label: 'Farms', value: '1,240' },
      { label: 'Outbreaks', value: '3' },
      { label: 'Compliance', value: '88%' },
    ],
    actions: [
      { kind: 'urgent',  title: 'EHP cluster expanding near Kaikalur',   meta: 'NSPAAD · 24 h',     to: DASH },
      { kind: 'warning', title: '46 farms overdue for compliance audit', meta: 'Q2 cycle',          to: DASH },
      { kind: 'info',    title: '12 new farm registrations to verify',   meta: 'CAA licensing',     to: DASH },
    ],
    toolsHeading: 'Monitor your district',
    tools: [
      { icon: AlertTriangle, label: 'Outbreaks',   sub: 'Heatmap · clusters', to: DASH, accent: 'text-rose-300',    bg: 'bg-rose-400/10' },
      { icon: Building2,     label: 'Surveillance', sub: 'Farm health',       to: DASH, accent: 'text-sky-300',     bg: 'bg-sky-400/10' },
      { icon: BadgeCheck,    label: 'Certifications', sub: 'CAA · MPEDA',     to: DASH, accent: 'text-emerald-300', bg: 'bg-emerald-400/10' },
      { icon: FileSpreadsheet, label: 'Registrations', sub: 'Verify farms',   to: DASH, accent: 'text-violet-300',  bg: 'bg-violet-400/10' },
      { icon: BarChart3,     label: 'Reports',     sub: 'District analytics', to: DASH, accent: 'text-teal-300',    bg: 'bg-teal-400/10' },
      { icon: BookOpen,      label: 'Advisories',  sub: 'Publish bulletins',  to: '/knowledge', accent: 'text-amber-300', bg: 'bg-amber-400/10' },
    ],
    showPrices: false,
    pricesHeading: '',
    activityHeading: 'District log',
    activity: [
      { when: '25 min ago', what: 'Outbreak update', detail: 'EHP · Kaikalur · +2 farms',     status: 'alert' },
      { when: '3 h ago',    what: 'Farm registered', detail: 'Reg #F-1241 · CAA pending',     status: 'ok' },
      { when: '6 h ago',    what: 'Audit cleared',   detail: 'Cluster K-2 · compliant',       status: 'ok' },
      { when: 'Yesterday',  what: 'Bulletin issued', detail: 'White-spot advisory · 24 farms', status: 'ok' },
    ],
    cta: { eyebrow: 'Government / MPEDA access', heading: 'Surveil your jurisdiction', body: 'Request an official account to monitor farm registrations, outbreak clusters and compliance across your district.', label: 'Request Govt access' },
  },
};
