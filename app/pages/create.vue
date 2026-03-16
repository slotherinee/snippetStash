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
        <textarea
          v-model="form.description"
          class="input resize-none"
          rows="4"
          placeholder="Explain what this snippet does…"
          required
        />
      </div>

      <div>
        <label class="label">
          Code <span class="text-red-400">*</span>
          <span class="text-xs ml-2 font-normal" style="color: var(--text-muted)">HTML, CSS, JS — all supported for live preview</span>
        </label>
        <textarea
          v-model="form.code"
          class="input font-mono text-xs resize-none"
          rows="14"
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
definePageMeta({ layout: 'default', middleware: 'auth' })

const { user } = useAuth()
const { success: toastSuccess } = useToast()
const router = useRouter()

const form = reactive({ title: '', description: '', code: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (!user.value) return
  loading.value = true
  error.value = null
  try {
    const { createPost } = await import('~/services/api')
    const post = await createPost({
      title: form.title,
      description: form.description,
      code: form.code,
      author_id: user.value.id,
      createdAt: new Date().toISOString(),
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
