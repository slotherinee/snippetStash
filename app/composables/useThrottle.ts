/**
 * useThrottle — prevents duplicate / rapid-fire API mutations.
 *
 * Usage:
 *   const { guard } = useThrottle()
 *   await guard('like', () => api.toggleLike(...), 1000)
 */
export function useThrottle() {
  const lastCall = new Map<string, number>()

  /**
   * @param key     Unique action name (e.g. 'like', 'comment')
   * @param fn      Async function to execute
   * @param waitMs  Minimum ms between calls (default 1 000)
   */
  async function guard<T>(key: string, fn: () => Promise<T>, waitMs = 1_000): Promise<T | null> {
    const now = Date.now()
    const last = lastCall.get(key) ?? 0

    if (now - last < waitMs) return null

    lastCall.set(key, now)
    return fn()
  }

  return { guard }
}
