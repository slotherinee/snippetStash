<template>
  <div class="max-w-sm mx-auto pt-8">
    <div class="text-center mb-8">
      <div class="text-4xl mb-3">✨</div>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary)">{{ t('auth.createAccount') }}</h1>
      <p class="text-sm mt-1" style="color: var(--text-muted)">{{ t('auth.joinSubtitle') }}</p>
    </div>

    <form @submit.prevent="submit" class="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4">
      <div>
        <label class="label">{{ t('auth.name') }}</label>
        <input v-model="name" type="text" class="input" :placeholder="t('auth.namePlaceholder')" required autocomplete="name" />
      </div>
      <div>
        <label class="label">{{ t('auth.email') }}</label>
        <input v-model="email" type="email" class="input" placeholder="you@example.com" required autocomplete="email" />
      </div>
      <div>
        <label class="label">{{ t('auth.password') }}</label>
        <input v-model="password" type="password" class="input" :placeholder="t('auth.passwordPlaceholder')" required minlength="6" autocomplete="new-password" />
      </div>

      <div v-if="error" class="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="loading">{{ t('auth.creating') }}</span>
        <span v-else>{{ t('auth.create') }}</span>
      </button>

      <p class="text-center text-sm" style="color: var(--text-muted)">
        {{ t('auth.alreadyRegistered') }} <NuxtLink to="/auth/login" class="text-accent hover:underline">{{ t('auth.signInLink') }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { doRegister } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  loading.value = true
  error.value = null
  try {
    await doRegister(name.value, email.value, password.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('auth.registerFailed')
  } finally {
    loading.value = false
  }
}
</script>
