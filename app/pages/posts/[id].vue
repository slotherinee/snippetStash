<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="space-y-6 max-w-4xl mx-auto">
      <LoadingSkeleton class="h-12 w-2/3" />
      <LoadingSkeleton class="h-6 w-1/2" />
      <LoadingSkeleton class="h-80" />
    </div>

    <!-- Error -->
    <div v-else-if="!post" class="text-center py-20">
      <p class="text-5xl mb-4">🔍</p>
      <h2 class="text-xl font-semibold" style="color: var(--text-secondary)">Snippet not found</h2>
      <NuxtLink to="/posts" class="btn-primary mt-6 inline-block">Back to Browse</NuxtLink>
    </div>

    <!-- Post -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-start justify-between gap-4 mb-3">
          <h1 class="text-3xl font-bold leading-tight" style="color: var(--text-primary)">{{ post.title }}</h1>
          <button
            v-if="isAdmin"
            @click="handleDelete"
            class="flex-shrink-0 text-sm px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >Delete</button>
        </div>
        <div class="flex items-center gap-4 text-sm flex-wrap" style="color: var(--text-muted)">
          <span class="flex items-center gap-1.5">
            <span class="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold">
              {{ (post.users?.name ?? 'U').charAt(0).toUpperCase() }}
            </span>
            {{ post.users?.name ?? 'Unknown' }}
          </span>
          <time>{{ formatDate(post.createdAt) }}</time>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-surface-card border border-surface-border rounded-xl p-6 mb-6">
        <p class="leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary)">{{ post.description }}</p>
      </div>

      <!-- Code / Preview tabs -->
      <div class="mb-8">
        <!-- Tab bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex gap-1">
            <button
              @click="activeTab = 'preview'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border"
              :class="activeTab === 'preview'
                ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                : 'border-surface-border hover:bg-surface-hover'"
              :style="activeTab !== 'preview' ? 'color: var(--text-secondary)' : ''"
            >▶ Preview</button>
            <button
              @click="activeTab = 'code'"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border"
              :class="activeTab === 'code'
                ? 'bg-accent/10 border-accent/40 text-accent'
                : 'border-surface-border hover:bg-surface-hover'"
              :style="activeTab !== 'code' ? 'color: var(--text-secondary)' : ''"
            >⟨/⟩ Code</button>
          </div>

          <!-- Fullscreen button -->
          <button
            @click="showModal = true"
            class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors font-mono"
            style="border-color: var(--color-border); color: var(--text-muted)"
          >⛶ Fullscreen</button>
        </div>

        <!-- Tab content -->
        <Transition name="tab" mode="out-in">
          <CodePreview v-if="activeTab === 'preview'" :key="'preview'" :code="post.code" />
          <CodeBlock   v-else                         :key="'code'"    :code="post.code" />
        </Transition>
      </div>

      <!-- Comments -->
      <div class="mt-10">
        <h2 class="text-xl font-semibold mb-6" style="color: var(--text-primary)">
          Comments <span class="font-normal text-base" style="color: var(--text-muted)">({{ comments.length }})</span>
        </h2>
        <div v-if="isLoggedIn" class="mb-8">
          <CommentForm :loading="commentLoading" @submit="onComment" />
        </div>
        <div v-else class="mb-8 p-4 bg-surface-card border border-surface-border rounded-xl text-center text-sm" style="color: var(--text-muted)">
          <NuxtLink to="/auth/login" class="text-accent hover:underline">Log in</NuxtLink> to leave a comment.
        </div>
        <CommentList :comments="comments" :loading="commentsLoading" @delete="onDeleteComment" />
      </div>
    </div>

    <!-- Fullscreen preview modal -->
    <PreviewModal
      v-if="post"
      v-model="showModal"
      :code="post.code"
      :title="post.title"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { user, isLoggedIn, isAdmin } = useAuth()
const { error: toastError, success } = useToast()

const post = ref<import('~/types').Post | null>(null)
const pending = ref(true)
const activeTab = ref<'code' | 'preview'>('preview')  // ← default to preview
const showModal = ref(false)

onMounted(async () => {
  try {
    const { getPost } = await import('~/services/api')
    post.value = await getPost(id)
  } catch {
    post.value = null
  } finally {
    pending.value = false
  }
})

async function handleDelete() {
  if (!confirm('Delete this snippet?')) return
  try {
    const { deletePost } = await import('~/services/api')
    await deletePost(id)
    success('Snippet deleted')
    router.push('/posts')
  } catch {
    toastError('Failed to delete snippet')
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

const { comments, loading: commentsLoading, fetchComments, addComment, removeComment } = useComments(id)
const commentLoading = ref(false)
onMounted(fetchComments)

async function onComment(text: string) {
  if (!user.value) return
  commentLoading.value = true
  try {
    await addComment({ post_id: id, author_id: user.value.id, text, createdAt: new Date().toISOString() })
  } catch { toastError('Failed to post comment') }
  finally { commentLoading.value = false }
}

async function onDeleteComment(commentId: number) {
  try { await removeComment(commentId) }
  catch { toastError('Failed to delete comment') }
}
</script>

<style scoped>
.tab-enter-active, .tab-leave-active { transition: all 0.15s ease; }
.tab-enter-from { opacity: 0; transform: translateY(4px); }
.tab-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
