import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import ru from '../locales/ru.json';

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'quasar-chat-language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'translation',
    ns: ['translation'],
  });

export default i18n; 