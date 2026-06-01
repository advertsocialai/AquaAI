import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Trash2, ArrowRight, Loader2, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ROLES } from '@/components/dashboard/RoleSelector';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';

export default function ProfilePage() {
  useEffect(() => { document.title = 'Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  // Not signed in → send to login.
  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
      </div>
    );
  }

  const name = (user.user_metadata?.name as string | undefined) || user.email?.split('@')[0] || 'Member';
  const initial = name.charAt(0).toUpperCase();
  const roleLabel = ROLES.find((r) => r.id === role)?.label ?? 'Member';
  const location = user.user_metadata?.location as string | undefined;
  const kycRef = user.user_metadata?.kyc_ref as string | undefined;
  const myDashboard = role ? DASHBOARD_ROUTE[role] : '/aquaai';

  async function handleLogout() {
    setBusy(true);
    await signOut();
    navigate('/');
  }

  async function handleDelete() {
    setBusy(true);
    // Supabase doesn't allow client self-delete with the anon key; sign the
    // user out and route them to contact so the team can action the request.
    // (A backend admin endpoint can hard-delete via the service-role key.)
    await supabase?.auth.signOut();
    setBusy(false);
    navigate('/contact?reason=delete-account');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-2xl py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Menu</h1>
          <Link to="/home" className="text-rose-600 font-medium hover:underline">
            Close
          </Link>
        </div>

        {/* Identity card */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center shrink-0">
            <span className="text-4xl font-bold text-rose-600">{initial}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{name}</div>
            <Link
              to="/profile/details"
              className="mt-1 text-rose-600 font-medium inline-flex items-center gap-1.5 hover:underline"
            >
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Menu rows */}
        <div className="divide-y divide-border border-y border-border">
          <MenuRow label="Change Language" custom={<LanguageSwitcher />} />
          <MenuRow label="How It Works" to="/aquaai" />
          <MenuRow label="About Royye Raju" to="/about" />
          <MenuRow label="About MAARC" to="/about" />
          <MenuRow label="Privacy Policy" to="/privacy" />
          <MenuRow label="Logout" onClick={handleLogout} disabled={busy} />
          <MenuRow label="Delete Account" onClick={() => setConfirmDelete(true)} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-1.5">
          <div className="font-semibold text-foreground/80">Follow Us</div>
          <div className="text-sm text-foreground/60">Visit our website</div>
          <a
            href="https://matrixseafoods.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 font-medium hover:underline"
          >
            Matrixseafoods.in
          </a>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl border border-border max-w-sm w-full p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-400/10">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-lg font-bold">Delete account?</h2>
            </div>
            <p className="text-sm text-foreground/60 mb-6">
              This will sign you out and start the account-deletion request. Your
              data is removed per our privacy policy. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function MenuRow({
  label, to, onClick, custom, disabled,
}: {
  label: string; to?: string;
  onClick?: () => void; custom?: React.ReactNode; disabled?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 py-4">
      <span className="flex-1 text-lg font-medium text-foreground">{label}</span>
      {custom ?? <ChevronRight className="w-5 h-5 text-rose-600" />}
    </div>
  );
  if (custom) return <div className="flex items-center justify-between">{content}</div>;
  if (to) return <Link to={to} className="block hover:bg-muted/40 transition">{content}</Link>;
  return (
    <button onClick={onClick} disabled={disabled} className="w-full text-left hover:bg-muted/40 transition disabled:opacity-50">
      {content}
    </button>
  );
}
