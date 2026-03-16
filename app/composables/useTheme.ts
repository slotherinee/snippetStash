export type Theme = 'dark' | 'light'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  function apply(t: Theme) {
    theme.value = t
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
    }
  }

  function init() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('theme') as Theme | null
    apply(saved ?? 'dark')
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  const isDark = computed(() => theme.value === 'dark')

  return { theme, isDark, toggle, init }
}
