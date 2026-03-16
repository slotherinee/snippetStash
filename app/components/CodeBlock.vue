<template>
  <div class="rounded-xl overflow-hidden border" style="border-color: var(--hljs-border)">
    <!-- Header bar -->
    <div
      class="flex items-center justify-between px-4 py-2 border-b"
      style="background: var(--color-card); border-color: var(--hljs-border)"
    >
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-red-500/70" />
        <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div class="w-3 h-3 rounded-full bg-green-500/70" />
      </div>
      <span class="text-xs font-mono" style="color: var(--text-muted)">{{ lang ?? 'code' }}</span>
      <button
        @click="copy"
        class="text-xs px-2.5 py-1 rounded-md border transition-all duration-150 font-mono"
        :style="copied
          ? 'border-color: #3fb950; color: #3fb950; background: rgba(63,185,80,0.1)'
          : 'border-color: var(--hljs-border); color: var(--text-muted)'"
      >{{ copied ? '✓ Copied' : 'Copy' }}</button>
    </div>

    <!-- Code with collapse -->
    <div class="relative" style="background: var(--hljs-bg)">
      <div
        class="overflow-hidden transition-all duration-300"
        :style="{ maxHeight: isLong && !expanded ? '240px' : 'none' }"
      >
        <pre class="m-0 overflow-x-auto"><code
          v-if="highlighted"
          v-html="highlighted"
          class="hljs"
        /><code
          v-else
          class="block p-5 text-sm font-mono leading-relaxed"
          style="color: var(--hljs-fg)"
        >{{ code }}</code></pre>
      </div>

      <!-- Fade + expand button -->
      <Transition name="fade">
        <div v-if="isLong && !expanded" class="absolute bottom-0 inset-x-0">
          <div
            class="h-16 pointer-events-none"
            :style="`background: linear-gradient(to top, var(--hljs-bg), transparent)`"
          />
          <div class="px-4 pb-3 flex justify-center" style="background: var(--hljs-bg)">
            <button
              @click="expanded = true"
              class="text-xs px-4 py-1.5 rounded-full border transition-all font-mono"
              style="border-color: var(--hljs-border); color: var(--text-secondary); background: var(--color-card)"
            >Show all {{ lineCount }} lines ↓</button>
          </div>
        </div>
      </Transition>

      <!-- Collapse button (shown when expanded) -->
      <div v-if="isLong && expanded" class="px-4 py-2 flex justify-center border-t" style="border-color: var(--hljs-border); background: var(--hljs-bg)">
        <button
          @click="expanded = false"
          class="text-xs px-4 py-1.5 rounded-full border transition-all font-mono"
          style="border-color: var(--hljs-border); color: var(--text-secondary); background: var(--color-card)"
        >Collapse ↑</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ code: string; lang?: string }>()

const highlighted = ref('')
const copied = ref(false)
const expanded = ref(false)
const { success } = useToast()

const lineCount = computed(() => props.code.split('\n').length)
const isLong = computed(() => lineCount.value > 12)

onMounted(async () => {
  try {
    const hljs = (await import('highlight.js/lib/core')).default
    const langs: Record<string, () => Promise<{ default: unknown }>> = {
      javascript: () => import('highlight.js/lib/languages/javascript'),
      typescript: () => import('highlight.js/lib/languages/typescript'),
      python:     () => import('highlight.js/lib/languages/python'),
      css:        () => import('highlight.js/lib/languages/css'),
      html:       () => import('highlight.js/lib/languages/xml'),
      xml:        () => import('highlight.js/lib/languages/xml'),
      json:       () => import('highlight.js/lib/languages/json'),
      bash:       () => import('highlight.js/lib/languages/bash'),
      sql:        () => import('highlight.js/lib/languages/sql'),
      rust:       () => import('highlight.js/lib/languages/rust'),
      go:         () => import('highlight.js/lib/languages/go'),
    }
    for (const [name, loader] of Object.entries(langs)) {
      hljs.registerLanguage(name, (await loader()).default as Parameters<typeof hljs.registerLanguage>[1])
    }
    const lang = props.lang && langs[props.lang] ? props.lang : undefined
    const result = lang
      ? hljs.highlight(props.code, { language: lang })
      : hljs.highlightAuto(props.code)
    highlighted.value = result.value
  } catch { /* fallback to plain text */ }
})

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    success('Code copied!')
    setTimeout(() => (copied.value = false), 2000)
  } catch { /* clipboard unavailable */ }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
