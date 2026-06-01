import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { MobileBackBar } from '@/components/mobile/MobileChrome';

const LANGUAGES = [
  { code: 'en', native: 'English', name: 'English' },
  { code: 'te', native: 'తెలుగు', name: 'Telugu' },
  { code: 'hi', native: 'हिंदी', name: 'Hindi' },
  { code: 'kn', native: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'ta', native: 'தமிழ்', name: 'Tamil' },
  { code: 'ml', native: 'മലയാളം', name: 'Malayalam' },
  { code: 'bn', native: 'বাংলা', name: 'Bengali' },
  { code: 'or', native: 'ଓଡ଼ିଆ', name: 'Odia' },
  { code: 'gu', native: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'mr', native: 'मराठी', name: 'Marathi' },
];

export default function LanguagePage() {
  useEffect(() => { document.title = 'Choose Language — Aqua Rudra'; }, []);
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [selected, setSelected] = useState(i18n.resolvedLanguage ?? 'en');

  async function choose(code: string) {
    setSelected(code);
    void i18n.changeLanguage(code);
    if (user && supabase) {
      await supabase.auth.updateUser({ data: { lang: code } });
    }
    const lang = LANGUAGES.find((l) => l.code === code);
    toast.success(`Language set to ${lang?.name ?? code}.`);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileBackBar title="Choose Language" />

      {/* Banner */}
      <div className="bg-gradient-to-br from-teal-400 to-sky-500 px-5 py-10 text-white">
        <div className="max-w-md mx-auto flex flex-wrap gap-2">
          {['தமிழ்', 'हिंदी', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা'].map((t) => (
            <span key={t} className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">{t}</span>
          ))}
        </div>
      </div>

      <main className="max-w-md mx-auto px-5 pt-6 pb-16">
        <h2 className="text-2xl font-bold">Choose Language</h2>
        <p className="text-neutral-500">Select your preferred language</p>

        <div className="mt-4 divide-y divide-neutral-100">
          {LANGUAGES.map((l) => {
            const on = l.code === selected;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className="w-full flex items-center gap-4 py-4 text-left"
              >
                <span className={`grid place-items-center w-6 h-6 rounded-full border-2 ${on ? 'border-sky-500' : 'border-neutral-300'}`}>
                  {on && <span className="w-3 h-3 rounded-full bg-sky-500" />}
                </span>
                <span className={`flex-1 text-lg ${on ? 'text-sky-600 font-semibold' : 'text-sky-700/90 font-medium'}`}>
                  {l.native} {l.name !== l.native && <span className="text-neutral-500 font-normal">({l.name})</span>}
                </span>
                {on && <Check className="w-5 h-5 text-sky-500" />}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
