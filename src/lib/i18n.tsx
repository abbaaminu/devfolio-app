import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const supportedLocales = ['en', 'fr', 'ar'] as const
export type Locale = (typeof supportedLocales)[number]
export type Direction = 'ltr' | 'rtl'

type TranslationKey = keyof typeof translations.en

const translations = {
  en: {
    language: 'Language',
    english: 'English',
    french: 'French',
    arabic: 'Arabic',
    loading: 'Loading',
    offline: 'You are offline. Cached content remains available.',
    online: 'Back online',
    skipToContent: 'Skip to content',
    home: 'Home',
    dashboard: 'Dashboard',
    signIn: 'Sign in',
  },
  fr: {
    language: 'Langue',
    english: 'Anglais',
    french: 'Francais',
    arabic: 'Arabe',
    loading: 'Chargement',
    offline: 'Vous etes hors ligne. Le contenu en cache reste disponible.',
    online: 'Connexion retablie',
    skipToContent: 'Aller au contenu',
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    signIn: 'Se connecter',
  },
  ar: {
    language: 'اللغة',
    english: 'الإنجليزية',
    french: 'الفرنسية',
    arabic: 'العربية',
    loading: 'جار التحميل',
    offline: 'أنت غير متصل. لا يزال المحتوى المخزن متاحًا.',
    online: 'تمت استعادة الاتصال',
    skipToContent: 'انتقل إلى المحتوى',
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    signIn: 'تسجيل الدخول',
  },
} as const

interface I18nContextValue {
  locale: Locale
  direction: Direction
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (value: number, currency?: string) => string
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLocale(): Locale {
  const stored = window.localStorage.getItem('devfolio.locale')
  if (supportedLocales.includes(stored as Locale)) return stored as Locale
  const browserLocale = navigator.language.split('-')[0] as Locale
  return supportedLocales.includes(browserLocale) ? browserLocale : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr'

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem('devfolio.locale', nextLocale)
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [locale, direction])

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    direction,
    setLocale,
    t: (key) => translations[locale][key],
    formatNumber: (number, options) => new Intl.NumberFormat(locale, options).format(number),
    formatCurrency: (number, currency = 'USD') => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number),
    formatDate: (date, options) => new Intl.DateTimeFormat(locale, options).format(new Date(date)),
  }), [locale, direction])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}
