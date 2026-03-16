import type { Locale } from '~/composables/useI18n'

export function useLanguage() {
  const locale = useState<Locale>('i18n.locale', () => 'en')
  const { user } = useAuth()

  function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('language') as Locale | null
    if (stored === 'en' || stored === 'ru') {
      locale.value = stored
      return
    }
    const userLang = (user.value as any)?.language
    if (userLang === 'en' || userLang === 'ru') {
      locale.value = userLang
      localStorage.setItem('language', locale.value)
    }
  }

  async function setLocale(lang: Locale) {
    locale.value = lang
    if (!import.meta.client) return
    localStorage.setItem('language', lang)
    if (user.value) {
      try {
        const { updateUser } = await import('~/services/api')
        await updateUser(user.value.id, { language: lang } as any)
      } catch {}
    }
  }

  function toggleLocale() {
    setLocale(locale.value === 'en' ? 'ru' : 'en')
  }

  return { locale: readonly(locale), init, setLocale, toggleLocale }
}
