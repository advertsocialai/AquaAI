import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { enablePush, notificationPermission, pushSupported, showLocalNotification } from '@/lib/push';

/**
 * Lets the user turn on browser push notifications. On grant we register a
 * push subscription (if a VAPID key is configured) so the backend can notify
 * them — e.g. when a login code or an alert arrives — without keeping the tab
 * open. Shows a quick test notification on success.
 */
export function NotificationSettings() {
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'warn'; text: string } | null>(null);

  useEffect(() => {
    setPerm(pushSupported() ? notificationPermission() : 'unsupported');
  }, []);

  async function turnOn() {
    setBusy(true);
    setMsg(null);
    const res = await enablePush();
    setPerm(notificationPermission());
    setBusy(false);
    if (res.ok) {
      setMsg({ kind: 'ok', text: 'Notifications are on for this device.' });
      void showLocalNotification('Aqua Rudra', 'Notifications enabled — you\'re all set.', '/');
    } else if (res.reason === 'denied') {
      setMsg({ kind: 'warn', text: 'Permission was blocked. Enable notifications for this site in your browser settings.' });
    } else if (res.reason === 'no-vapid') {
      setMsg({ kind: 'warn', text: 'Permission granted, but server push isn\'t configured yet (missing VAPID key). Local alerts will still show.' });
    } else if (res.reason === 'unsupported') {
      setMsg({ kind: 'warn', text: 'This browser doesn\'t support web push.' });
    } else {
      setMsg({ kind: 'warn', text: 'Could not enable notifications.' });
    }
  }

  const granted = perm === 'granted';
  const unsupported = perm === 'unsupported';

  return (
    <div className="mb-6 p-4 rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-teal-400/10 shrink-0">
            {granted ? <Bell className="w-5 h-5 text-teal-400" /> : <BellOff className="w-5 h-5 text-foreground/40" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Push notifications</div>
            <p className="text-xs text-foreground/50 mt-0.5 max-w-md">
              Get alerts for login codes, disease warnings, price moves and order
              updates — even when the site isn't open.
            </p>
          </div>
        </div>
        {granted ? (
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-medium">
            <Check className="w-3.5 h-3.5" /> On
          </span>
        ) : (
          <button
            type="button"
            onClick={turnOn}
            disabled={busy || unsupported}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-30 text-black text-xs font-semibold transition"
          >
            {busy ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enabling…</> : <>Enable</>}
          </button>
        )}
      </div>
      {msg && (
        <div className={`mt-3 flex items-center gap-2 text-xs ${msg.kind === 'ok' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {msg.kind === 'ok' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {msg.text}
        </div>
      )}
    </div>
  );
}
