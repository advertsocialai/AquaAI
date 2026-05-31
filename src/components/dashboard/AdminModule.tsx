import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, ShieldCheck, Users, Bell, Webhook, Key, Globe, Mail,
  Smartphone, MessageCircle, Building2, BadgeCheck, AlertCircle,
  Plus, Copy, Check,
} from 'lucide-react';
import { ROLES, type Role } from './RoleSelector';

type Section = 'profile' | 'team' | 'notifications' | 'integrations' | 'api';

const KYC_STATUS: { label: string; status: 'verified' | 'pending' | 'missing'; icon: React.ElementType }[] = [
  { label: 'Aadhaar e-KYC',           status: 'verified', icon: ShieldCheck },
  { label: 'Mobile (+91 98765 43210)', status: 'verified', icon: Smartphone },
  { label: 'Email',                    status: 'verified', icon: Mail },
  { label: 'GST verification',         status: 'pending',  icon: BadgeCheck },
  { label: 'MPEDA license',            status: 'missing',  icon: Building2 },
  { label: 'Bank penny-drop',          status: 'verified', icon: AlertCircle },
];

const TEAM = [
  { name: 'V. Ramana',    email: 'ramana@example.in',  role: 'Admin',    last: '2 min ago' },
  { name: 'S. Naidu',     email: 'naidu@example.in',   role: 'Manager',  last: '14 min ago' },
  { name: 'K. Lakshmi',   email: 'k.lak@example.in',   role: 'Operator', last: '1 hr ago' },
  { name: 'R. Kumar',     email: 'rkumar@example.in',  role: 'Viewer',   last: '3 hr ago' },
];

const NOTIF_PREFS = [
  { event: 'Price threshold hit',     channels: { email: true,  sms: true,  whatsapp: true,  push: true  } },
  { event: 'Disease outbreak (5 km)', channels: { email: true,  sms: true,  whatsapp: true,  push: true  } },
  { event: 'QC certificate ready',    channels: { email: true,  sms: false, whatsapp: true,  push: true  } },
  { event: 'New order',               channels: { email: true,  sms: false, whatsapp: false, push: true  } },
  { event: 'Payment received',        channels: { email: true,  sms: true,  whatsapp: false, push: true  } },
  { event: 'Weekly performance',      channels: { email: true,  sms: false, whatsapp: false, push: false } },
];

const INTEGRATIONS = [
  { name: 'MPEDA portal',     desc: 'License verification + circulars', status: 'connected',  accent: '#facc15' },
  { name: 'NSPAAD database',  desc: 'Auto-sync disease reports',         status: 'connected',  accent: '#f87171' },
  { name: 'IMD weather',      desc: 'Forecasts + cyclone alerts',        status: 'connected',  accent: '#38bdf8' },
  { name: 'Razorpay',         desc: 'Payments + escrow',                 status: 'connected',  accent: '#34d399' },
  { name: 'Aadhaar e-KYC',    desc: 'NSDL / Karza',                      status: 'connected',  accent: '#a78bfa' },
  { name: 'GST verification', desc: 'B2B billing',                       status: 'pending',    accent: '#fb923c' },
  { name: 'MSG91 SMS',        desc: 'OTP + alerts',                      status: 'connected',  accent: '#60a5fa' },
  { name: 'Gupshup WhatsApp', desc: 'Business API · alerts',             status: 'available',  accent: '#34d399' },
];

function StatusDot({ status }: { status: string }) {
  const color = status === 'verified' || status === 'connected'
    ? '#34d399'
    : status === 'pending'
    ? '#facc15'
    : status === 'missing'
    ? '#f87171'
    : '#94a3b8';
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: color }} />
      <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function AdminModule({ role }: { role: Role }) {
  const [section, setSection] = useState<Section>('profile');
  const [activeRole, setActiveRole] = useState<Role>(role);
  const [apiCopied, setApiCopied] = useState(false);

  const apiToken = 'sk_live_aquai_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'profile' as const,       label: 'Profile & KYC',     icon: User },
          { id: 'team' as const,          label: 'Team',              icon: Users },
          { id: 'notifications' as const, label: 'Notifications',     icon: Bell },
          { id: 'integrations' as const,  label: 'Integrations',      icon: Webhook },
          { id: 'api' as const,           label: 'API & Access',      icon: Key },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
              section === id
                ? 'border-border bg-card text-foreground'
                : 'border-border bg-card text-foreground/50 hover:text-foreground/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {section === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-2xl font-bold text-teal-300">
                V
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-foreground">V. Ramana</div>
                <div className="text-xs text-foreground/40">advertsocialai@gmail.com · +91 98765 43210</div>
              </div>
            </div>
            <div className="space-y-2">
              {KYC_STATUS.map(({ label, status, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-card">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-foreground/50" />
                    <span className="text-sm text-foreground/80">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <span className={`text-xs capitalize ${
                      status === 'verified' ? 'text-emerald-300'
                      : status === 'pending' ? 'text-amber-300'
                      : 'text-red-300'
                    }`}>{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-semibold text-foreground">Multi-role context</span>
              </div>
              <p className="text-xs text-foreground/50 mb-4">
                You can hold more than one role. Switch context here to see the matching dashboard.
              </p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(({ id, label, icon: Icon, accent }) => {
                  const active = id === activeRole;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveRole(id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
                        active ? 'border-border bg-card text-foreground' : 'border-border bg-card text-foreground/50'
                      }`}
                    >
                      <Icon className="w-3 h-3" style={{ color: active ? accent : undefined }} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-foreground">Language & Region</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">UI language</span>
                  <span className="text-foreground">తెలుగు (Telugu)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Timezone</span>
                  <span className="text-foreground">Asia/Kolkata (IST)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Currency</span>
                  <span className="text-foreground">INR (₹)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {section === 'team' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] uppercase tracking-widest text-foreground/30">Team members</div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-400/30 text-xs text-teal-300 hover:bg-teal-500/30">
              <Plus className="w-3.5 h-3.5" /> Invite member
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  {['Name', 'Email', 'Role', 'Last active', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-foreground/40 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEAM.map((m) => (
                  <tr key={m.email} className="border-b border-border hover:bg-muted">
                    <td className="px-4 py-3 text-foreground/90 font-semibold">{m.name}</td>
                    <td className="px-4 py-3 text-foreground/60 text-xs">{m.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        m.role === 'Admin' ? 'border-red-400/30 bg-red-400/10 text-red-300'
                        : m.role === 'Manager' ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                        : m.role === 'Operator' ? 'border-sky-400/30 bg-sky-400/10 text-sky-300'
                        : 'border-border bg-card text-foreground/60'
                      }`}>{m.role}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/40 text-xs">{m.last}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-foreground/40 hover:text-foreground">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {section === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left text-xs font-medium text-foreground/40 uppercase tracking-widest">Event</th>
                {[
                  { l: 'Email', i: Mail },
                  { l: 'SMS', i: Smartphone },
                  { l: 'WhatsApp', i: MessageCircle },
                  { l: 'Push', i: Bell },
                ].map(({ l, i: Icon }) => (
                  <th key={l} className="px-4 py-3 text-center text-xs font-medium text-foreground/40 uppercase tracking-widest">
                    <div className="inline-flex items-center gap-1 justify-center">
                      <Icon className="w-3.5 h-3.5" /> {l}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NOTIF_PREFS.map((n) => (
                <tr key={n.event} className="border-b border-border hover:bg-muted">
                  <td className="px-4 py-3 text-foreground/90">{n.event}</td>
                  {(['email', 'sms', 'whatsapp', 'push'] as const).map((c) => (
                    <td key={c} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={n.channels[c]}
                        className="w-4 h-4 rounded accent-teal-500 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {section === 'integrations' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: i.accent }} />
                  <span className="text-sm font-semibold text-foreground">{i.name}</span>
                </div>
                <StatusDot status={i.status} />
              </div>
              <div className="text-xs text-foreground/40 mb-3">{i.desc}</div>
              <button
                className={`w-full py-1.5 rounded-lg text-xs border transition ${
                  i.status === 'connected'
                    ? 'border-border bg-card text-foreground/60 hover:bg-muted'
                    : 'border-teal-400/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                }`}
              >
                {i.status === 'connected' ? 'Manage' : i.status === 'pending' ? 'Complete setup' : 'Connect'}
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {section === 'api' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">API Token</span>
              <span className="text-[10px] text-foreground/30 ml-auto">For institutional partners</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black border border-border font-mono text-xs text-emerald-300 overflow-x-auto">
              <span className="flex-1 truncate">{apiToken}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(apiToken);
                  setApiCopied(true);
                  setTimeout(() => setApiCopied(false), 1500);
                }}
                className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded bg-card hover:bg-muted text-foreground/70"
              >
                {apiCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {apiCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="text-[11px] text-foreground/30 mt-3">
              Rotate every 90 days. Bearer auth · rate limited 600 req/min · IP allowlist optional.
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Webhook className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-foreground">Webhook endpoints</span>
            </div>
            <div className="space-y-2">
              {[
                { event: 'qc.certificate.signed', url: 'https://your-erp.example.in/webhooks/qc' },
                { event: 'price.threshold.hit',   url: 'https://your-erp.example.in/webhooks/price' },
                { event: 'outbreak.alert.region', url: 'https://your-erp.example.in/webhooks/outbreak' },
              ].map((w) => (
                <div key={w.event} className="flex items-center justify-between p-3 rounded-lg bg-card">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono text-violet-300">{w.event}</div>
                    <div className="text-[11px] text-foreground/40 truncate">{w.url}</div>
                  </div>
                  <button className="text-xs text-foreground/50 hover:text-foreground">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
