import { useEffect, useId, useState } from 'react';
import { Megaphone, Check, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

/**
 * Announcement dialog — styled after OriginUI's newsletter-dialog
 * (https://21st.dev/community/components/originui/dialog/newsletter-dialog).
 *
 * Auto-opens once per visitor (remembered in localStorage), and doubles as a
 * newsletter opt-in: the email is written to `newsletter_subscribers`.
 * Bump STORAGE_KEY to re-show after a new announcement.
 */
const STORAGE_KEY = 'aqua-announcement-v1';
const TITLE = 'Aqua Rudra is now live 🎉';
const MESSAGE =
  'Get disease alerts, daily shrimp & fish rates and Shop@Farm updates — straight to your inbox.';

export function AnnouncementDialog() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  // Show once, shortly after load, if not seen before.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) localStorage.setItem(STORAGE_KEY, '1'); // dismissed → don't nag again
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase().slice(0, 254);
    if (!clean.includes('@')) return;
    setStatus('loading');
    try {
      // `newsletter_subscribers` isn't in the generated Database types, so cast.
      if (supabase) {
        await (supabase.from('newsletter_subscribers' as never) as never as {
          insert: (v: unknown) => Promise<{ error: { code?: string } | null }>;
        }).insert({ email: clean, source: 'announcement' });
      }
    } catch {
      /* swallow — duplicate emails / offline shouldn't block the UX */
    }
    setStatus('done');
    localStorage.setItem(STORAGE_KEY, '1');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Megaphone className="w-5 h-5" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{TITLE}</DialogTitle>
            <DialogDescription className="sm:text-center">{MESSAGE}</DialogDescription>
          </DialogHeader>
        </div>

        {status === 'done' ? (
          <div className="flex items-center justify-center gap-2 py-2 text-emerald-500 font-medium">
            <Check className="w-5 h-5" /> You&rsquo;re subscribed — thank you!
          </div>
        ) : (
          <form onSubmit={subscribe} className="space-y-4">
            <Input
              id={id}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.in"
              aria-label="Email"
            />
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          No spam — unsubscribe anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}
