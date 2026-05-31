/**
 * Web push helper. Wraps the browser Notification + Push APIs and persists
 * the subscription to Supabase so a backend can send notifications later.
 *
 * VAPID public key comes from VITE_VAPID_PUBLIC_KEY. Without it we can still
 * show local notifications (e.g. fired from the page) but cannot register a
 * server-sendable push subscription.
 */
import { supabase } from '@/lib/supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Asks for permission, registers a push subscription and stores it on the
 * current user's row in `push_subscriptions`. Returns true on success.
 */
export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { ok: false, reason: 'denied' };

  const reg = await navigator.serviceWorker.ready;

  // Reuse an existing subscription if present.
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    if (!VAPID_PUBLIC_KEY) {
      // Permission is granted (local notifications work) but we can't make a
      // server-sendable subscription without a VAPID key.
      return { ok: false, reason: 'no-vapid' };
    }
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  // Persist so the backend can target this device. Best-effort: a missing
  // table shouldn't break the UX, the permission is still granted.
  if (supabase) {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (userId) {
      const json = sub.toJSON();
      // `push_subscriptions` is provisioned out-of-band (see migration note in
      // SettingsPage); cast since it isn't in the generated Database types yet.
      await (supabase.from('push_subscriptions' as never) as never as {
        upsert: (v: unknown, o: unknown) => Promise<unknown>;
      }).upsert(
        {
          user_id: userId,
          endpoint: sub.endpoint,
          p256dh: json.keys?.p256dh ?? '',
          auth: json.keys?.auth ?? '',
        },
        { onConflict: 'endpoint' },
      );
    }
  }

  return { ok: true };
}

/** Show a notification right now (used for local/foreground alerts). */
export async function showLocalNotification(title: string, body: string, url = '/') {
  if (notificationPermission() !== 'granted') return;
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(title, { body, icon: '/favicon.svg', data: { url } });
}
