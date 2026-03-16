<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-8" style="color: var(--text-primary)">{{ t('settings.title') }}</h1>

    <div class="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
      <!-- Avatar section -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">{{ t('settings.profilePicture') }}</h2>

        <div class="flex flex-col items-center gap-4">
          <!-- Avatar preview -->
          <div class="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-surface-border">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Avatar preview"
              class="w-full h-full object-cover"
              @error="avatarError = true"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-3xl font-bold"
            >{{ initial }}</div>
          </div>

          <div class="w-full">
            <p class="text-sm mb-2 text-center" style="color: var(--text-secondary)">{{ t('settings.pasteUrl') }}</p>
            <input
              v-model="form.avatar"
              type="url"
              class="input"
              placeholder="https://example.com/avatar.jpg"
              @input="avatarError = false"
            />
            <p v-if="avatarError" class="text-xs text-red-400 mt-1 text-center">{{ t('settings.imageError') }}</p>
          </div>
        </div>
      </div>

      <!-- Name section -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">{{ t('settings.displayName') }}</h2>
        <input
          v-model="form.name"
          type="text"
          class="input"
          :placeholder="t('settings.namePlaceholder')"
          maxlength="50"
        />
      </div>

      <!-- Language section -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">{{ t('settings.language') }}</h2>
        <div class="flex gap-3">
          <button
            v-for="lang in (['en', 'ru'] as const)"
            :key="lang"
            @click="setLocale(lang)"
            class="flex-1 py-2 rounded-lg text-sm font-medium border transition-all"
            :class="locale === lang
              ? 'bg-surface-card border-accent/50 text-accent shadow-sm'
              : 'border-surface-border hover:bg-surface-hover'"
            :style="locale !== lang ? 'color: var(--text-secondary)' : ''"
          >{{ t(`lang.${lang}`) }}</button>
        </div>
      </div>

      <!-- Account info (read-only) -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">{{ t('settings.account') }}</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span style="color: var(--text-muted)">{{ t('settings.email') }}</span>
            <span style="color: var(--text-primary)">{{ user?.email }}</span>
          </div>
          <div class="flex justify-between">
            <span style="color: var(--text-muted)">{{ t('settings.role') }}</span>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="user?.role === 'admin'
                ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                : 'bg-accent/10 text-accent border border-accent/30'"
            >{{ user?.role }}</span>
          </div>
        </div>
      </div>

      <!-- Save button -->
      <div class="p-6 flex items-center justify-between">
        <p v-if="saved" class="text-sm text-accent-green">{{ t('settings.saved') }}</p>
        <p v-else-if="error" class="text-sm text-red-400">{{ error }}</p>
        <span v-else />
        <button
          @click="save"
          :disabled="loading || !isDirty"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">{{ t('settings.saving') }}</span>
          <span v-else>{{ t('settings.save') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateUser } from '~/services/api'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { locale, setLocale } = useLanguage()
const { user } = useAuth()
const { success: toastSuccess } = useToast()

const form = reactive({
  name: user.value?.name ?? '',
  avatar: user.value?.avatar ?? '',
})

const loading = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const avatarError = ref(false)

const initial = computed(() => (user.value?.name ?? 'U').charAt(0).toUpperCase())
const avatarPreview = computed(() => (!avatarError.value && form.avatar.trim()) ? form.avatar.trim() : null)

const isDirty = computed(() =>
  form.name.trim() !== (user.value?.name ?? '') ||
  (form.avatar.trim() || '') !== (user.value?.avatar ?? '')
)

async function save() {
  if (!user.value || !isDirty.value) return
  loading.value = true
  error.value = null
  saved.value = false
  try {
    const updated = await updateUser(user.value.id, {
      name: form.name.trim(),
      avatar: form.avatar.trim() || undefined,
    })
    const userState = useState<typeof user.value>('auth.user')
    userState.value = updated
    saved.value = true
    toastSuccess(t('settings.success'))
    setTimeout(() => (saved.value = false), 3000)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save'
  } finally {
    loading.value = false
  }
}
</script>
