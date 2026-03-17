<template>
  <div class="rounded-xl overflow-hidden border border-surface-border">
    <!-- Toolbar -->
    <div
      class="flex items-center justify-between px-4 py-2 border-b"
      style="background: var(--color-card); border-color: var(--color-border)"
    >
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-red-500/70" />
        <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div class="w-3 h-3 rounded-full bg-green-500/70" />
      </div>
      <span class="text-xs font-mono" style="color: var(--text-muted)">live preview</span>
      <button
        @click="reloadKey++"
        class="text-xs px-2.5 py-1 rounded-md border transition-colors font-mono"
        style="border-color: var(--color-border); color: var(--text-muted)"
      >↺ Reload</button>
    </div>

    <!-- Resizable preview area -->
    <div class="bg-white" :style="{ height: height + 'px' }">
      <iframe
        :key="reloadKey"
        :srcdoc="srcdoc"
        title="Live code preview"
        sandbox="allow-scripts"
        class="w-full h-full border-0"
      />
    </div>

    <!-- Drag handle -->
    <div
      class="h-2.5 flex items-center justify-center cursor-row-resize transition-colors border-t"
      style="background: var(--color-hover); border-color: var(--color-border)"
      @mousedown="startResize"
    >
      <div class="w-10 h-0.5 rounded-full" style="background: var(--color-border)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ code: string }>()

const height = ref(360)
const reloadKey = ref(0)

const srcdoc = computed(() => {
  const c = props.code.trim()
  if (/<!doctype|<html|<body/i.test(c)) return c
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #fff; color: #333; padding: 1.5rem; }
</style></head>
<body>${c}</body></html>`
})

let startY = 0, startH = 0

function startResize(e: MouseEvent) {
  startY = e.clientY; startH = height.value
  const onMove = (e: MouseEvent) => { height.value = Math.max(120, startH + (e.clientY - startY)) }
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>
