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
      <button @click="handleError" class="btn-primary px-6">{{ t('error.goHome') }}</button>
      <button
        @click="() => history.back()"
        class="btn-ghost border border-surface-border px-6"
      >{{ t('error.goBack') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError | null }>()
const { t } = useI18n()

const title = computed(() => {
  if (props.error?.statusCode === 404) return t('error.notFound')
  if (props.error?.statusCode === 403) return t('error.accessDenied')
  if (props.error?.statusCode === 500) return t('error.serverError')
  return t('error.unknown')
})

const message = computed(() => {
  if (props.error?.statusCode === 404) return t('error.notFoundMsg')
  if (props.error?.statusCode === 403) return t('error.accessDeniedMsg')
  return props.error?.message ?? t('error.unknownMsg')
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
