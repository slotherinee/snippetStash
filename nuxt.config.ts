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
      meta: [{ name: 'description', content: 'Share and discover code snippets' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
