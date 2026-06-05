import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import te from '@/locales/te.json';
import hi from '@/locales/hi.json';
import od from '@/locales/od.json';
import bn from '@/locales/bn.json';

export const LANGUAGES = [
  { code: 'en', name: 'English',  native: 'English'  },
  { code: 'te', name: 'Telugu',   native: 'తెలుగు'    },
  { code: 'hi', name: 'Hindi',    native: 'हिन्दी'    },
  { code: 'od', name: 'Odia',     native: 'ଓଡ଼ିଆ'    },
  { code: 'bn', name: 'Bengali',  native: 'বাংলা'    },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      te: { translation: te },
      hi: { translation: hi },
      od: { translation: od },
      bn: { translation: bn },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'aquai-lang',
    },
  });

// Keep <html lang> in sync with the active language so language-aware CSS
// (e.g. extra line-height for Indic scripts) can target it.
if (typeof document !== 'undefined') {
  const applyLang = (lng: string) => { document.documentElement.lang = lng; };
  applyLang(i18n.language || 'en');
  i18n.on('languageChanged', applyLang);
}

export default i18n;
