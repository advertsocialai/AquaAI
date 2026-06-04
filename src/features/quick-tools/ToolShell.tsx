import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, WifiOff } from 'lucide-react';

/**
 * Shared wrapper for every Quick Tool: back header, title, a voice button that
 * speaks the active guidance/result (Web Speech API), and an offline banner.
 */
export function ToolShell({
  title, speakText, children,
}: { title: string; speakText?: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  function speak() {
    if (!speakText || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(speakText));
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-100">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Back" className="p-1 -ml-1">
            <ChevronLeft className="w-7 h-7 text-neutral-900" />
          </button>
          <span className="flex-1 text-2xl font-bold">{title}</span>
          <button
            onClick={speak}
            disabled={!speakText}
            aria-label="Read aloud"
            className="p-2 rounded-full text-rose-600 disabled:text-neutral-300"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      {!online && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-700 text-sm">
          <div className="max-w-md mx-auto px-5 py-2 flex items-center gap-2">
            <WifiOff className="w-4 h-4" /> Offline — results compute on your device and sync later.
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-5 pt-5 pb-16 space-y-5">{children}</main>
    </div>
  );
}
