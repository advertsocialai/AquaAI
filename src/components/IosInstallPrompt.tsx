import { useEffect, useState } from 'react';
import { Share, Plus, X, Smartphone, Download } from 'lucide-react';

/**
 * "Install AquaRudra on your phone" prompt.
 *
 *  - iOS Safari → static banner explaining the Share → Add-to-Home-Screen
 *    flow (Apple doesn't expose a JS API for this; we have to instruct).
 *  - Android Chrome / Edge → captures the beforeinstallprompt event and
 *    fires the native install dialog from the banner's button.
 *  - Hidden when the user is already running the installed PWA, when
 *    they've dismissed it, or when the platform doesn't support either path.
 */

const DISMISS_KEY = 'aquai-install-dismissed';
const DISMISS_DAYS = 30;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari sets this proprietary flag when the PWA is launched from home screen.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|GSA/.test(ua);
  return ios && safari;
}

function isDismissed() {
  if (typeof window === 'undefined') return false;
  try {
    const v = window.localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    const ts = parseInt(v, 10);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function persistDismiss() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* private mode — ignore */
  }
}

export function IosInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'ios' | 'android'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    // Android / Chromium path — the browser dispatches this when the PWA is installable.
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode('android');
      // Slight delay so the banner doesn't slap the user the moment the page paints.
      setTimeout(() => setVisible(true), 1500);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);

    // iOS Safari has no install event, so fall back to a manual instructional banner.
    if (isIosSafari()) {
      setMode('ios');
      setTimeout(() => setVisible(true), 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    };
  }, []);

  function dismiss() {
    persistDismiss();
    setVisible(false);
  }

  async function triggerNativeInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      persistDismiss();
    }
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      data-voice-skip
      role="dialog"
      aria-label="Install AquaRudra"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[min(96vw,420px)] rounded-2xl border border-cyan-400/30 bg-black/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/30 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-cyan-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">Install AquaRudra</h3>
            <button
              aria-label="Dismiss"
              onClick={dismiss}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {mode === 'android' ? (
            <>
              <p className="text-xs text-white/65 mt-1 leading-relaxed">
                Add AquaRudra to your home screen for offline access, faster launch and push alerts.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={triggerNativeInstall}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Install
                </button>
                <button
                  onClick={dismiss}
                  className="text-xs text-white/55 hover:text-white px-2 py-2"
                >
                  Not now
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-white/65 mt-1 leading-relaxed">
                Get AquaRudra on your home screen — works offline and feels like a native app.
              </p>
              <ol className="mt-3 space-y-2 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 grid place-items-center text-[10px] font-bold">1</span>
                  <span className="inline-flex items-center gap-1">
                    Tap the <Share className="inline w-3.5 h-3.5 mx-1 text-cyan-300" /> Share button in Safari
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 grid place-items-center text-[10px] font-bold">2</span>
                  <span className="inline-flex items-center gap-1">
                    Scroll down and tap
                    <Plus className="inline w-3.5 h-3.5 mx-1 text-cyan-300" />
                    <span>Add to Home Screen</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 grid place-items-center text-[10px] font-bold">3</span>
                  <span>Tap <strong className="text-white">Add</strong> to confirm</span>
                </li>
              </ol>
              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={dismiss}
                  className="text-xs text-white/55 hover:text-white px-2 py-1"
                >
                  Got it
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
