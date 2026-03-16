<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1">
    <button
      @click="emit('go', currentPage - 1)"
      :disabled="currentPage <= 1"
      class="px-3 py-1.5 rounded-lg text-sm border border-surface-border hover:border-accent/50 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      style="color: var(--text-secondary)"
    >← Prev</button>

    <template v-for="p in pages" :key="p">
      <span v-if="p === '...'" class="px-2" style="color: var(--text-muted)">…</span>
      <button
        v-else
        @click="emit('go', p as number)"
        class="w-9 h-9 rounded-lg text-sm border transition-colors"
        :class="p === currentPage
          ? 'border-accent bg-accent/10 text-accent font-medium'
          : 'border-surface-border hover:border-accent/50 hover:text-accent'"
        :style="p !== currentPage ? 'color: var(--text-secondary)' : ''"
      >{{ p }}</button>
    </template>

    <button
      @click="emit('go', currentPage + 1)"
      :disabled="currentPage >= totalPages"
      class="px-3 py-1.5 rounded-lg text-sm border border-surface-border hover:border-accent/50 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      style="color: var(--text-secondary)"
    >Next →</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ currentPage: number; totalPages: number }>()
const emit = defineEmits<{ go: [page: number] }>()

const pages = computed(() => {
  const { currentPage: c, totalPages: t } = props
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const arr: (number | '...')[] = [1]
  if (c > 3) arr.push('...')
  for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) arr.push(i)
  if (c < t - 2) arr.push('...')
  arr.push(t)
  return arr
})
</script>
