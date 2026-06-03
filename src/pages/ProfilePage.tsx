import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Trash2, Loader2, AlertTriangle, X, Phone, Mail, Headphones,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const SUPPORT_PHONE = '+919705713399';
const SUPPORT_EMAIL = 'support@aquarudra.com';
const APP_NAME = 'Aqua Rudra';

export default function ProfilePage() {
  useEffect(() => { document.title = 'Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [busy, setBusy] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  // Pull avatar + mobile from the profile row for the identity card.
  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles').select('avatar_url,mobile').eq('id', user.id).maybeSingle();
      if (cancelled) return;
      setAvatarUrl(data?.avatar_url ?? null);
      setMobile(data?.mobile ?? user.phone ?? (user.user_metadata?.mobile as string) ?? null);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  const name = (user.user_metadata?.name as string | undefined) || user.email?.split('@')[0] || 'Member';
  const initial = name.charAt(0).toUpperCase();

  async function handleLogout() {
    setBusy(true);
    await signOut();
    navigate('/');
  }

  async function handleDelete() {
    setBusy(true);
    await supabase?.auth.signOut();
    setBusy(false);
    navigate('/contact?reason=delete-account');
  }

  async function handleResetPassword() {
    if (!supabase) return;
    if (!user?.email) { navigate('/forgot-password'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    toast[error ? 'error' : 'success'](
      error ? 'Could not send reset link.' : `Password reset link sent to ${user.email}.`,
    );
  }

  async function handleShare() {
    const url = window.location.origin;
    const text = `Install & Join ${APP_NAME} — One stop solution for aquaculture farmers. ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: APP_NAME, text, url });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Invite link copied to clipboard.');
      }
    } catch {
      /* user dismissed the share sheet */
    }
  }

  function handleRate() {
    toast('Thanks for the love! In-app rating is coming soon.');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 max-w-2xl py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Menu</h1>
          <Link to="/home" className="text-rose-600 font-medium hover:underline">Close</Link>
        </div>

        {/* Identity card */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/profile/details" className="w-24 h-24 rounded-2xl bg-muted overflow-hidden flex items-center justify-center shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              : <span className="text-4xl font-bold text-rose-600">{initial}</span>}
          </Link>
          <div className="mt-3 text-2xl font-bold">{name}</div>
          {mobile && <div className="text-foreground/60">Mobile: {mobile}</div>}
          <Link to="/profile/edit" className="mt-1 text-rose-600 font-medium hover:underline">Edit Profile</Link>
        </div>

        {/* Menu rows */}
        <div className="divide-y divide-border border-y border-border">
          <MenuRow label="How It Works" to="/aquaai" />
          <MenuRow label="Customer Support" onClick={() => setShowSupport(true)} />
          <MenuRow label="Rate Us" onClick={handleRate} />
          <MenuRow label="Share App" onClick={handleShare} />
          <MenuRow label="Privacy Policy" to="/privacy" />
          <MenuRow label="Reset Password" onClick={handleResetPassword} />
          <MenuRow label="Logout" onClick={handleLogout} disabled={busy} />
          <MenuRow label="Delete Account" onClick={() => setConfirmDelete(true)} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-1.5">
          <div className="font-semibold text-foreground/80">Follow Us</div>
          <div className="text-sm text-foreground/60">Visit our website</div>
          <a
            href="https://aquarudra.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 font-medium hover:underline"
          >
            Aquarudra.com
          </a>
        </div>
      </div>

      {/* Customer Support */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={() => setShowSupport(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl border border-border max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-sky-100 h-40 flex items-center justify-center">
              <Headphones className="w-16 h-16 text-sky-500" strokeWidth={1.4} />
              <button onClick={() => setShowSupport(false)} aria-label="Close" className="absolute top-3 right-3 p-1.5 rounded-full bg-white/70 hover:bg-white">
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-foreground/70"><Phone className="w-4 h-4" /> Call us @</div>
                <a href={`tel:${SUPPORT_PHONE}`} className="text-lg font-semibold text-sky-600">{SUPPORT_PHONE}</a>
                <span className="text-foreground/60"> 9 am to 6 pm (Mon-Sat)</span>
              </div>
              <div>
                <div className="flex items-center gap-2 text-foreground/70"><Mail className="w-4 h-4" /> Write to us @</div>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-lg font-semibold text-sky-600 break-all">{SUPPORT_EMAIL}</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
  label, to, onClick, disabled,
}: {
  label: string; to?: string; onClick?: () => void; disabled?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 py-4">
      <span className="flex-1 text-lg font-medium text-foreground">{label}</span>
      <ChevronRight className="w-5 h-5 text-rose-600" />
    </div>
  );
  if (to) return <Link to={to} className="block hover:bg-muted/40 transition">{content}</Link>;
  return (
    <button onClick={onClick} disabled={disabled} className="w-full text-left hover:bg-muted/40 transition disabled:opacity-50">
      {content}
    </button>
  );
}
