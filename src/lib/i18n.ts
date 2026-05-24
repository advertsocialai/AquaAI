import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import te from '@/locales/te.json';
import ta from '@/locales/ta.json';
import hi from '@/locales/hi.json';
import od from '@/locales/od.json';
import bn from '@/locales/bn.json';

export const LANGUAGES = [
  { code: 'en', name: 'English',  native: 'English'  },
  { code: 'te', name: 'Telugu',   native: 'తెలుగు'    },
  { code: 'ta', name: 'Tamil',    native: 'தமிழ்'    },
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
      ta: { translation: ta },
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

export default i18n;
