import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return ['en', 'ru'];
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      en: 'English',
      ru: 'Русский',
    };
    return labels[lang] || lang;
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageLabel,
    isLoading: !i18n.isInitialized,
  };
}; 