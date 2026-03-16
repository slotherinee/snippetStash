<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-3"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="close" />

        <!-- Modal -->
        <div
          class="relative z-10 flex flex-col rounded-2xl overflow-hidden border shadow-2xl"
          style="
            width: calc(100vw - 1.5rem);
            height: calc(100vh - 1.5rem);
            background: var(--color-card);
            border-color: var(--color-border);
          "
        >
          <!-- Toolbar -->
          <div
            class="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
            style="border-color: var(--color-border)"
          >
            <div class="flex gap-1.5">
              <button @click="close" class="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors" title="Close (Esc)" />
              <div class="w-3.5 h-3.5 rounded-full bg-yellow-500/50" />
              <div class="w-3.5 h-3.5 rounded-full bg-green-500/50" />
            </div>
            <span class="text-sm font-mono flex-1 text-center" style="color: var(--text-muted)">
              {{ title ?? 'Live Preview' }}
            </span>
            <button
              @click="reloadKey++"
              class="text-xs px-2.5 py-1 rounded-md border transition-colors font-mono"
              style="border-color: var(--color-border); color: var(--text-muted)"
            >↺</button>
          </div>

          <!-- Iframe -->
          <div class="flex-1 bg-white overflow-hidden">
            <iframe
              :key="reloadKey"
              :srcdoc="srcdoc"
              sandbox="allow-scripts"
              class="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; code: string; title?: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const reloadKey = ref(0)

const srcdoc = computed(() => {
  const c = props.code.trim()
  const isFullHtml = /<!doctype|<html|<body/i.test(c)
  if (isFullHtml) return c
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #fff; color: #333; padding: 1.5rem; }
</style></head>
<body>${c}</body></html>`
})

function close() {
  emit('update:modelValue', false)
}

// Close on Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.modal-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.15s ease; }
.modal-enter-from { opacity: 0; transform: scale(0.95); }
.modal-leave-to   { opacity: 0; transform: scale(0.97); }
</style>
