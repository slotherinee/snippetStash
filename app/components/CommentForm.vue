<template>
  <form @submit.prevent="submit" class="space-y-3">
    <textarea
      ref="textareaRef"
      v-model="text"
      placeholder="Write a comment… (⌘+Enter to submit)"
      rows="3"
      class="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/60 resize-none transition-colors"
      style="color: var(--text-primary)"
      @keydown.meta.enter="submit"
      @keydown.ctrl.enter="submit"
    />
    <div class="flex items-center justify-between">
      <span class="text-xs" style="color: var(--text-muted)">⌘+Enter to submit</span>
      <button
        type="submit"
        :disabled="!text.trim() || loading"
        class="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Posting…</span>
        <span v-else>Post Comment</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{ submit: [text: string] }>()
const props = defineProps<{ loading?: boolean }>()

const text = ref('')

function submit() {
  if (!text.value.trim() || props.loading) return
  emit('submit', text.value.trim())
  text.value = ''
}
</script>
