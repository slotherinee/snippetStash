<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 text-center"
    style="background: var(--color-surface)"
  >
    <!-- Glowing code bracket -->
    <div class="font-mono font-bold text-8xl mb-6 select-none" style="color: var(--color-border)">
      <span class="text-accent">&lt;</span>
      <span style="color: var(--text-muted)">{{ error?.statusCode ?? 404 }}</span>
      <span class="text-accent">/&gt;</span>
    </div>

    <h1 class="text-2xl font-bold mb-2" style="color: var(--text-primary)">
      {{ title }}
    </h1>
    <p class="text-sm max-w-sm mb-8" style="color: var(--text-muted)">
      {{ message }}
    </p>

    <div class="flex flex-col sm:flex-row items-center gap-3">
      <button @click="handleError" class="btn-primary px-6">Go Home</button>
      <button
        @click="() => history.back()"
        class="btn-ghost border border-surface-border px-6"
      >Go Back</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError | null }>()

const title = computed(() => {
  if (props.error?.statusCode === 404) return 'Page not found'
  if (props.error?.statusCode === 403) return 'Access denied'
  if (props.error?.statusCode === 500) return 'Server error'
  return 'Something went wrong'
})

const message = computed(() => {
  if (props.error?.statusCode === 404)
    return "The snippet or page you're looking for doesn't exist or was removed."
  if (props.error?.statusCode === 403)
    return "You don't have permission to view this page."
  return props.error?.message ?? 'An unexpected error occurred. Please try again.'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
