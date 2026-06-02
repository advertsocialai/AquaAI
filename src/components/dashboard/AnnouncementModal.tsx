import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/announcement-dialog';
import { Button } from '@/components/ui/button';
import { StoreButtons } from '@/components/StoreButtons';

export interface AnnouncementModalProps {
  /** Unique id — used to remember dismissal so it shows only once per user. */
  id: string;
  title: string;
  description?: string;
  /** Optional richer body rendered below the description. */
  body?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  /** Show "Download on the App Store / Get it on Google Play" buttons. */
  showStoreButtons?: boolean;
}

/**
 * One-time announcement popup. Auto-opens shortly after mount and remembers
 * dismissal in localStorage (keyed by `id`) so returning users aren't nagged.
 */
export function AnnouncementModal({
  id,
  title,
  description,
  body,
  ctaLabel,
  ctaTo,
  showStoreButtons = false,
}: AnnouncementModalProps) {
  const storageKey = `aqua-announcement-${id}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      // localStorage unavailable (private mode) — just show it.
    }
    const t = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(t);
  }, [storageKey]);

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey, '1');
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent>
        <DialogHeader>
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
            <Megaphone className="size-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {body && <div className="text-sm text-muted-foreground">{body}</div>}

        {showStoreButtons && <StoreButtons />}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Dismiss</Button>
          </DialogClose>
          {ctaLabel && ctaTo && (
            <Button asChild onClick={dismiss}>
              <Link to={ctaTo}>
                {ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
