import { motion } from 'framer-motion';
import { CheckCircle2, KeyRound, Fingerprint, Smartphone, ShieldCheck } from 'lucide-react';
import { ROLES, type Role } from './RoleSelector';

const VERIFICATION: Record<Role, { req: string; features: string[] }> = {
  farmer:      { req: 'Aadhaar + farm GPS coordinates',                 features: ['Diagnostics', 'Marketplace', 'Pricing', 'Advisory', 'Harvest sale'] },
  vle:         { req: 'Aadhaar + training cert + cluster assignment',   features: ['All farmer tools', 'Service tools', 'Commissions'] },
  hatchery:    { req: 'MPEDA / CAA license + GST + facility verify',    features: ['QC certification', 'B2B portal', 'Batch tracking', 'Buyer ratings'] },
  transporter: { req: 'Vehicle RC + DL + cold-chain cert',              features: ['Load matching', 'Route optimisation', 'Tracking', 'Payments'] },
  supplier:    { req: 'GST + facility license + capacity declaration',  features: ['Order management', 'Delivery routing', 'Dynamic pricing'] },
  trader:      { req: 'MPEDA buyer license + IEC export code',          features: ['Bulk procurement', 'Quality verify', 'Export logistics'] },
  bank:        { req: 'Institutional verify + API credentials',         features: ['Underwriting data', 'Claims verify', 'Farm risk scoring'] },
  govt:        { req: 'Government ID + jurisdiction code',              features: ['Surveillance', 'Outbreak alerts', 'Compliance reports'] },
};

const AUTH_STACK = [
  { icon: Smartphone,   label: 'OTP-first mobile login', tone: '#38bdf8' },
  { icon: KeyRound,     label: 'Aadhaar e-KYC (NSDL/Karza)', tone: '#a78bfa' },
  { icon: Fingerprint,  label: 'Biometric (fingerprint / face)', tone: '#f472b6' },
  { icon: ShieldCheck,  label: 'JWT 15min + refresh 30d', tone: '#34d399' },
];

export function OnboardingModule({ role }: { role: Role }) {
  const meta = VERIFICATION[role];
  const roleMeta = ROLES.find((r) => r.id === role)!;
  const Icon = roleMeta.icon;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-border bg-card"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl" style={{ background: `${roleMeta.accent}22` }}>
            <Icon className="w-6 h-6" style={{ color: roleMeta.accent }} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/30 mb-1">Selected role</div>
            <div className="text-2xl font-bold text-foreground">{roleMeta.label}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-2">Verification required</div>
            <div className="p-3 rounded-xl bg-card text-sm text-foreground/80">{meta.req}</div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-2">Features unlocked</div>
            <ul className="space-y-1.5">
              {meta.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: roleMeta.accent }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-4">Authentication Stack</div>
          <div className="grid grid-cols-2 gap-3">
            {AUTH_STACK.map(({ icon: AIcon, label, tone }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
                <AIcon className="w-4 h-4 shrink-0" style={{ color: tone }} />
                <span className="text-xs text-foreground/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-3">Multi-role support</div>
          <p className="text-sm text-foreground/60">
            One account, multiple roles. A farmer who is also a VLE can switch context in-app
            without separate logins. RBAC enforced server-side; session per-device with revocation.
          </p>
        </div>
      </div>
    </div>
  );
}
