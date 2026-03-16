<template>
  <div class="min-h-screen bg-surface font-sans" style="color: var(--text-primary)">
    <NavBar />
    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const { init: initAuth } = useAuth()
const { init: initTheme } = useTheme()
const { init: initLang } = useLanguage()
onMounted(() => {
  initTheme()
  initAuth()
  initLang()
})
</script>
