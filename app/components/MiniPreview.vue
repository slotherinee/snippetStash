<template>
  <div
    ref="containerRef"
    class="w-full overflow-hidden bg-white relative"
    :style="{ height: containerHeight + 'px' }"
  >
    <!-- Skeleton while loading -->
    <div v-if="!ready" class="absolute inset-0 bg-gray-100 animate-pulse" />

    <!-- Scaled iframe -->
    <iframe
      v-if="shouldRender"
      :srcdoc="srcdoc"
      sandbox="allow-scripts"
      class="absolute top-0 left-0 border-0 pointer-events-none"
      :style="{
        width: iframeW + 'px',
        height: iframeH + 'px',
        transformOrigin: '0 0',
        transform: `scale(${scale})`,
      }"
      @load="ready = true"
    />

    <!-- Overlay with preview icon -->
    <div
      v-if="ready"
      class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
      style="background: rgba(0,0,0,0.3)"
    >
      <span class="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">▶ Preview</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ code: string; height?: number }>()

const containerRef = ref<HTMLDivElement>()
const containerHeight = computed(() => props.height ?? 160)
const shouldRender = ref(false)
const ready = ref(false)

// Scale so the 1280px-wide iframe fits the container
const IFRAME_W = 1280
const scale = ref(0.25)
const iframeW = IFRAME_W
const iframeH = computed(() => Math.ceil(containerHeight.value / scale.value))

function updateScale() {
  if (!containerRef.value) return
  scale.value = containerRef.value.clientWidth / IFRAME_W
}

// Detect if the code has visible HTML content worth previewing
const srcdoc = computed(() => {
  const c = props.code.trim()
  const isFullHtml = /<!doctype|<html|<body/i.test(c)
  if (isFullHtml) return c
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #fff; color: #333; padding: 1rem; }
</style></head>
<body>${c}</body></html>`
})

// Lazy-load with IntersectionObserver
let observer: IntersectionObserver | null = null

onMounted(() => {
  updateScale()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        shouldRender.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' }
  )
  if (containerRef.value) observer.observe(containerRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>
