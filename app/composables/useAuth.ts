import type { User } from '~/types'
import * as api from '~/services/api'

export function useAuth() {
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string | null>('auth.token', () => null)
  const toast = useToast()
  const router = useRouter()

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('token')
    if (!stored || user.value) return
    token.value = stored
    try {
      user.value = await api.getMe()
    } catch {
      logout()
    }
  }

  async function doLogin(email: string, password: string) {
    const res = await api.login(email, password)
    token.value = res.token
    user.value = res.data
    localStorage.setItem('token', res.token)
    toast.success(`Welcome back, ${res.data.name}!`)
    router.push('/')
  }

  async function doRegister(name: string, email: string, password: string) {
    const res = await api.register({ name, email, password })
    token.value = res.token
    user.value = res.data
    localStorage.setItem('token', res.token)
    toast.success(`Welcome, ${res.data.name}!`)
    router.push('/')
  }

  function logout() {
    user.value = null
    token.value = null
    if (import.meta.client) localStorage.removeItem('token')
    toast.info('Logged out')
    router.push('/')
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    isAdmin,
    init,
    doLogin,
    doRegister,
    logout,
  }
}
