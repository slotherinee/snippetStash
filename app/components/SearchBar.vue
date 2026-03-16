<template>
  <div class="relative w-full">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-lg leading-none" style="color: var(--text-muted)">⌕</span>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="search"
      :placeholder="placeholder ?? 'Search…'"
      class="w-full pl-9 pr-4 py-2.5 bg-surface-card border border-surface-border rounded-lg text-sm focus:outline-none focus:border-accent/60 transition-colors"
      style="color: var(--text-primary)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
input::placeholder { color: var(--text-muted); }
</style>
