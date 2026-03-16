export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'https://36ca592e6586d4b9.mokky.dev',
    },
  },
  app: {
    head: {
      title: 'SnippetStash',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'description', content: 'Share and discover code snippets' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // ── Security headers on every route ────────────────────────────────────
  routeRules: {
    '/**': {
      headers: {
        // Clickjacking protection
        'X-Frame-Options': 'SAMEORIGIN',
        // Prevent MIME-type sniffing
        'X-Content-Type-Options': 'nosniff',
        // Referrer policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Disable browser features that aren't needed
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
        // XSS filter (legacy browsers)
        'X-XSS-Protection': '1; mode=block',
        // HSTS — enable once you have HTTPS
        // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        // Content Security Policy
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",         // Nuxt needs inline scripts
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",          // blob: for avatar previews
          "connect-src 'self' https://36ca592e6586d4b9.mokky.dev",
          "frame-src 'none'",                           // iframes via srcdoc don't need this
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    },
  },
})
