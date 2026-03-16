<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-8" style="color: var(--text-primary)">Settings</h1>

    <div class="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
      <!-- Avatar section -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">Profile Picture</h2>

        <div class="flex items-center gap-5">
          <!-- Avatar preview -->
          <div class="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-surface-border">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Avatar preview"
              class="w-full h-full object-cover"
              @error="avatarError = true"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-2xl font-bold"
            >{{ initial }}</div>
          </div>

          <div class="flex-1">
            <p class="text-sm mb-2" style="color: var(--text-secondary)">Paste a direct image URL</p>
            <input
              v-model="form.avatar"
              type="url"
              class="input"
              placeholder="https://example.com/avatar.jpg"
              @input="avatarError = false"
            />
            <p v-if="avatarError" class="text-xs text-red-400 mt-1">Image failed to load — check the URL</p>
          </div>
        </div>
      </div>

      <!-- Name section -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">Display Name</h2>
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="Your display name"
          maxlength="50"
        />
      </div>

      <!-- Account info (read-only) -->
      <div class="p-6 border-b border-surface-border">
        <h2 class="text-sm font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">Account</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span style="color: var(--text-muted)">Email</span>
            <span style="color: var(--text-primary)">{{ user?.email }}</span>
          </div>
          <div class="flex justify-between">
            <span style="color: var(--text-muted)">Role</span>
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
        <p v-if="saved" class="text-sm text-accent-green">✓ Changes saved</p>
        <p v-else-if="error" class="text-sm text-red-400">{{ error }}</p>
        <span v-else />
        <button
          @click="save"
          :disabled="loading || !isDirty"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Saving…</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateUser } from '~/services/api'

definePageMeta({ layout: 'default', middleware: 'auth' })

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
    // Sync back into global user state
    const userState = useState<typeof user.value>('auth.user')
    userState.value = updated
    saved.value = true
    toastSuccess('Profile updated!')
    setTimeout(() => (saved.value = false), 3000)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save'
  } finally {
    loading.value = false
  }
}
</script>
