import { Languages } from 'lucide-react'
import { useI18n, supportedLocales, type Locale } from '../lib/i18n'

export default function LanguageSwitcher() {
  const { locale, t, setLocale } = useI18n()
  const labels: Record<Locale, string> = {
    en: t('english'),
    fr: t('french'),
    ar: t('arabic'),
  }

  return (
    <label className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-dark-200 bg-white px-3 text-sm text-dark-700 dark:border-dark-700 dark:bg-dark-800 dark:text-dark-200">
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        aria-label={t('language')}
        className="min-h-11 bg-transparent font-medium outline-none"
      >
        {supportedLocales.map((supportedLocale) => <option key={supportedLocale} value={supportedLocale}>{labels[supportedLocale]}</option>)}
      </select>
    </label>
  )
}
