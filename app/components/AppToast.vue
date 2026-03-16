<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium min-w-64 max-w-sm"
          :class="{
            'bg-accent-green/10 border border-accent-green/30 text-accent-green': toast.type === 'success',
            'bg-red-500/10 border border-red-500/30 text-red-400': toast.type === 'error',
            'bg-accent/10 border border-accent/30 text-accent': toast.type === 'info',
          }"
        >
          <span class="text-base">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          <span>{{ toast.message }}</span>
          <button class="ml-auto opacity-60 hover:opacity-100" @click="remove(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(2rem) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(2rem); }
</style>
