<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-8" style="color: var(--text-primary)">Share a Snippet</h1>

    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="label">Title <span class="text-red-400">*</span></label>
        <input v-model="form.title" type="text" class="input" placeholder="A descriptive title…" required />
      </div>

      <div>
        <label class="label">Description <span class="text-red-400">*</span></label>
        <textarea v-model="form.description" class="input resize-none" rows="3" placeholder="Explain what this snippet does…" required />
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
          <input v-model="tagsInput" type="text" class="input" placeholder="css, animation, grid…" />
        </div>
      </div>

      <div>
        <label class="label">
          Code <span class="text-red-400">*</span>
          <span class="text-xs ml-2 font-normal" style="color: var(--text-muted)">HTML, CSS, JS — all supported for live preview</span>
        </label>
        <textarea
          v-model="form.code"
          class="input font-mono resize-none"
          style="font-size: 0.8em"
          rows="16"
          placeholder="// your code here…"
          required
        />
      </div>

      <div v-if="error" class="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        {{ error }}
      </div>

      <div class="flex items-center justify-between pt-2">
        <NuxtLink to="/posts" class="btn-ghost border border-surface-border">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading">Publishing…</span>
          <span v-else>Publish Snippet</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '~/types'

definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Share a Snippet — SnippetStash' })

const { user } = useAuth()
const { success: toastSuccess } = useToast()
const router = useRouter()

const form = reactive({ title: '', description: '', code: '', language: '' })
const tagsInput = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (!user.value) return
  loading.value = true
  error.value = null
  try {
    const { createPost } = await import('~/services/api')
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    const post = await createPost({
      title:       form.title,
      description: form.description,
      code:        form.code,
      language:    form.language || undefined,
      tags:        tags.length ? tags : undefined,
      author_id:   user.value.id,
      createdAt:   new Date().toISOString(),
      likes:       [],
      views:       0,
    })
    toastSuccess('Snippet published!')
    router.push(`/posts/${post.id}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
