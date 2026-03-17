const SITE_URL = 'https://snippet-stash-ten.vercel.app'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      apiBase: 'https://36ca592e6586d4b9.mokky.dev',
    },
  },

  // ── Sitemap ────────────────────────────────────────────────────────────
  sitemap: {
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'daily' },
      { loc: '/posts', priority: 0.9, changefreq: 'daily' },
      { loc: '/trending', priority: 0.8, changefreq: 'daily' },
    ],
    exclude: [
      '/auth/**',
      '/settings',
      '/bookmarks',
      '/create',
      '/posts/*/edit',
    ],
  },

  app: {
    head: {
      title: 'SnippetStash',
      titleTemplate: '%s — SnippetStash',
      htmlAttrs: { lang: 'en' },
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: SITE_URL },
      ],
      meta: [
        { name: 'description', content: 'Share and discover code snippets with syntax highlighting, forking, and community features.' },
        { name: 'keywords', content: 'code snippets, programming, javascript, python, html, css, share code, developer tools' },
        { name: 'author', content: 'SnippetStash' },
        { name: 'robots', content: 'index, follow' },

        // Search Console verifications
        { name: 'google-site-verification', content: 'vRqsy_AxCElmxrpiKLFlxeBKlK5dLJe9usJ_WJmSc2Y' },
        { name: 'yandex-verification', content: '6e7724a0e6ab1dee' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SnippetStash' },
        { property: 'og:title', content: 'SnippetStash — Share and discover code snippets' },
        { property: 'og:description', content: 'Share and discover code snippets with syntax highlighting, forking, and community features.' },
        { property: 'og:url', content: SITE_URL },

        // Twitter / X Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'SnippetStash — Share and discover code snippets' },
        { name: 'twitter:description', content: 'Share and discover code snippets with syntax highlighting, forking, and community features.' },
      ],
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
