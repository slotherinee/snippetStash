/**
 * Server-side rate limiter using a sliding-window counter per IP.
 * Applies to all Nuxt server routes (SSR pages, /api/*, etc.)
 *
 * Limits:
 *  - 120 requests / 60 seconds per IP  (general)
 *  - Returns 429 with Retry-After header on breach
 */

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

const WINDOW_MS  = 60_000  // 1 minute
const MAX_REQ    = 120     // requests per window

// Prune expired entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, win] of store) {
    if (now > win.resetAt) store.delete(key)
  }
}, 300_000)

export default defineEventHandler((event) => {
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ??
    getRequestHeader(event, 'x-real-ip') ??
    event.node.req.socket?.remoteAddress ??
    'unknown'

  const now = Date.now()
  let win = store.get(ip)

  if (!win || now > win.resetAt) {
    win = { count: 1, resetAt: now + WINDOW_MS }
    store.set(ip, win)
    return
  }

  win.count++

  if (win.count > MAX_REQ) {
    const retryAfter = Math.ceil((win.resetAt - now) / 1000)
    setResponseHeaders(event, {
      'Retry-After': String(retryAfter),
      'X-RateLimit-Limit': String(MAX_REQ),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(win.resetAt / 1000)),
    })
    throw createError({
      statusCode: 429,
      statusMessage: `Too Many Requests — retry in ${retryAfter}s`,
    })
  }

  // Attach rate-limit info headers on every response
  setResponseHeaders(event, {
    'X-RateLimit-Limit': String(MAX_REQ),
    'X-RateLimit-Remaining': String(MAX_REQ - win.count),
    'X-RateLimit-Reset': String(Math.ceil(win.resetAt / 1000)),
  })
})
