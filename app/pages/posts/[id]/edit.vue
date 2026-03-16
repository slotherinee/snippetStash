<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink :to="`/posts/${id}`" class="text-accent hover:underline text-sm">← Back to snippet</NuxtLink>
      <span style="color: var(--text-muted)">/</span>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary)">Edit Snippet</h1>
    </div>

    <div v-if="pending" class="space-y-4">
      <LoadingSkeleton class="h-12 w-full" />
      <LoadingSkeleton class="h-32 w-full" />
      <LoadingSkeleton class="h-64 w-full" />
    </div>

    <div v-else-if="!post" class="text-center py-20">
      <p style="color: var(--text-muted)">Snippet not found or you don't have permission to edit it.</p>
    </div>

    <form v-else @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="label">Title <span class="text-red-400">*</span></label>
        <input v-model="form.title" type="text" class="input" required />
      </div>

      <div>
        <label class="label">Description <span class="text-red-400">*</span></label>
        <textarea v-model="form.description" class="input resize-none" rows="3" required />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="label">Language</label>
          <select v-model="form.language" class="input cursor-pointer">
            <option value="">Select language…</option>
            <option v-for="lang in LANGUAGES" :key="lang" :value="lang">{{ lang }}</option>
          </select>
        </div>
        <div>
          <label class="label">
            Tags
            <span class="text-xs font-normal ml-1" style="color: var(--text-muted)">comma separated</span>
          </label>
          <input v-model="tagsInput" type="text" class="input" placeholder="css, animation…" />
        </div>
      </div>

      <div>
        <label class="label">Code <span class="text-red-400">*</span></label>
        <textarea
          v-model="form.code"
          class="input font-mono resize-none"
          style="font-size: 0.8em"
          rows="16"
          required
        />
      </div>

      <div v-if="error" class="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        {{ error }}
      </div>

      <div class="flex items-center justify-between pt-2">
        <NuxtLink :to="`/posts/${id}`" class="btn-ghost border border-surface-border">Cancel</NuxtLink>
        <button type="submit" :disabled="saving" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="saving">Saving…</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '~/types'
import type { Post } from '~/types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const route  = useRoute()
const router = useRouter()
const id     = Number(route.params.id)

const { user, isAdmin } = useAuth()
const { success: toastSuccess, error: toastError } = useToast()

const post    = ref<Post | null>(null)
const pending = ref(true)
const saving  = ref(false)
const error   = ref<string | null>(null)

const form = reactive({ title: '', description: '', code: '', language: '' })
const tagsInput = ref('')

onMounted(async () => {
  try {
    const { getPost } = await import('~/services/api')
    const p = await getPost(id)
    // Access control — only owner or admin
    if (p.author_id !== user.value?.id && !isAdmin.value) {
      router.replace(`/posts/${id}`)
      return
    }
    post.value           = p
    form.title           = p.title
    form.description     = p.description
    form.code            = p.code
    form.language        = p.language ?? ''
    tagsInput.value      = (p.tags ?? []).join(', ')
  } catch {
    post.value = null
  } finally {
    pending.value = false
  }
})

async function submit() {
  saving.value = true
  error.value  = null
  try {
    const { updatePost } = await import('~/services/api')
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    await updatePost(id, {
      title:       form.title,
      description: form.description,
      code:        form.code,
      language:    form.language || undefined,
      tags:        tags.length ? tags : undefined,
    })
    toastSuccess('Snippet updated!')
    router.push(`/posts/${id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save'
  } finally {
    saving.value = false
  }
}
</script>
