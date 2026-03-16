import { en } from '~/locales/en'
import { ru } from '~/locales/ru'

export type Locale = 'en' | 'ru'

const MESSAGES = { en, ru }

function getPath(obj: any, path: string): string {
  const val = path.split('.').reduce((o, k) => o?.[k], obj)
  return typeof val === 'string' ? val : path
}

export function useI18n() {
  const locale = useState<Locale>('i18n.locale', () => 'en')

  function t(key: string, params?: Record<string, string | number>): string {
    let val = getPath(MESSAGES[locale.value], key)
    if (params) {
      val = Object.entries(params).reduce(
        (s, [k, v]) => s.replace(`{${k}}`, String(v)),
        val
      )
    }
    return val
  }

  return { t, locale: readonly(locale) }
}
