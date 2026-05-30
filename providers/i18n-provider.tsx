'use client';

import { ReactNode, useEffect, useState } from 'react';
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n: i18nFromHook } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initLang = async () => {
      try {
        const savedLang = localStorage.getItem('i18nextLng') || navigator.language.split('-')[0] || 'fr';
        if (['en', 'fr', 'ar'].includes(savedLang) && i18n.language !== savedLang) {
          await i18n.changeLanguage(savedLang);
        }
      } catch (error) {
        console.error('Failed to change language:', error);
      } finally {
        setMounted(true);
      }
    };
    initLang();
  }, []);

  useEffect(() => {
    if (mounted) {
      const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = i18n.language;
      localStorage.setItem('i18nextLng', i18n.language);
    }
  }, [i18n.language, mounted]);

  // To avoid hydration mismatch, we must render exactly what the server rendered
  // on the first pass. The server rendered the children inside the SessionProvider.
  // We use a div to wrap children on the server and on the first client pass.
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <div className="h-full flex flex-col">{children}</div>;
}
