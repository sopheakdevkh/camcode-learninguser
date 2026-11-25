import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Locale, LocalizedText } from '@/types';
import { getTranslation, type TranslationKeys } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: TranslationKeys;
  pickText: (text: LocalizedText | string) => string;
  formatNumber: (num: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'camcodelearn_user_locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'km' || saved === 'en') return saved;
    } catch {
      // ignore storage errors
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);
  const toggleLocale = () => setLocaleState((prev) => (prev === 'en' ? 'km' : 'en'));

  const value = useMemo<I18nContextValue>(() => {
    const t = getTranslation(locale) as TranslationKeys;

    const pickText = (text: LocalizedText | string): string => {
      if (typeof text === 'string') return text;
      if (locale === 'km' && text.km && text.km.trim().length > 0) {
        return text.km;
      }
      return text.en;
    };

    const formatNumber = (num: number): string => {
      return new Intl.NumberFormat(locale === 'km' ? 'km-KH' : 'en-US').format(num);
    };

    return { locale, setLocale, toggleLocale, t, pickText, formatNumber };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}

