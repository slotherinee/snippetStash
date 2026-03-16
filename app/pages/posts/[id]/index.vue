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
      <h2 class="text-xl font-semibold" style="color: var(--text-secondary)">{{ t('post.notFound') }}</h2>
      <NuxtLink to="/posts" class="btn-primary mt-6 inline-block">{{ t('post.backToBrowse') }}</NuxtLink>
    </div>

    <!-- Post -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <!-- Title row — stacks on mobile -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span
                v-if="post.language"
                class="text-xs font-mono px-2 py-0.5 rounded-full border"
                style="border-color: var(--color-border); color: var(--text-muted)"
              >{{ post.language }}</span>
              <NuxtLink
                v-for="tag in (post.tags ?? [])"
                :key="tag"
                :to="`/posts?tag=${encodeURIComponent(tag)}`"
                class="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
              >#{{ tag }}</NuxtLink>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold leading-tight" style="color: var(--text-primary)">{{ post.title }}</h1>
          </div>

          <!-- Actions: Like + Bookmark always visible, rest in ⋯ dropdown -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <!-- Like -->
            <button
              @click="handleLike"
              :disabled="!isLoggedIn"
              class="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-all"
              :class="userLiked ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'border-surface-border hover:bg-surface-hover'"
              :style="!userLiked ? 'color: var(--text-muted)' : ''"
              :title="isLoggedIn ? (userLiked ? t('post.unlike') : t('post.like')) : t('post.loginToLike')"
            >
              <svg class="w-4 h-4" :fill="userLiked ? 'currentColor' : 'none'" viewBox="0 0 20 20" stroke="currentColor" stroke-width="1.5">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
              {{ likesCount }}
            </button>

            <!-- Bookmark -->
            <button
              @click="handleBookmark"
              :disabled="!isLoggedIn"
              class="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg border transition-all"
              :class="bookmarked ? 'bg-accent/10 border-accent/40 text-accent' : 'border-surface-border hover:bg-surface-hover'"
              :style="!bookmarked ? 'color: var(--text-muted)' : ''"
              :title="isLoggedIn ? (bookmarked ? t('post.removeBookmark') : t('post.bookmark')) : t('post.loginToBookmark')"
            >
              <svg class="w-4 h-4" :fill="bookmarked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>

            <!-- ⋯ Actions dropdown -->
            <div class="relative" ref="actionsRef">
              <button
                @click="actionsOpen = !actionsOpen"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-border hover:bg-surface-hover transition-colors text-lg leading-none font-bold"
                style="color: var(--text-muted)"
                :title="actionsOpen ? '' : 'More actions'"
              >⋯</button>

              <Transition name="dropdown">
                <div
                  v-if="actionsOpen"
                  class="absolute right-0 top-full mt-1.5 w-44 rounded-xl border shadow-lg overflow-hidden z-50"
                  style="background: var(--color-card); border-color: var(--color-border)"
                >
                  <!-- Share -->
                  <button @click="sharePost; actionsOpen = false" class="action-item w-full">
                    <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span :class="copied ? 'text-accent-green' : ''">{{ copied ? t('post.copied') : t('post.share') }}</span>
                  </button>

                  <!-- Download -->
                  <button @click="downloadCode; actionsOpen = false" class="action-item w-full">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Download
                  </button>

                  <!-- Fork -->
                  <button v-if="isLoggedIn" @click="forkPost; actionsOpen = false" class="action-item w-full">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    {{ t('post.fork') }}
                  </button>

                  <!-- Edit -->
                  <NuxtLink v-if="canEdit" :to="`/posts/${post.id}/edit`" class="action-item" @click="actionsOpen = false">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {{ t('post.edit') }}
                  </NuxtLink>

                  <!-- Delete -->
                  <template v-if="isAdmin">
                    <div class="border-t mx-3 my-1" style="border-color: var(--color-border)" />
                    <button @click="handleDelete; actionsOpen = false" class="action-item w-full text-red-400 hover:text-red-400">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      {{ t('post.delete') }}
                    </button>
                  </template>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Meta row -->
        <div class="flex items-center gap-4 text-sm flex-wrap" style="color: var(--text-muted)">
          <NuxtLink :to="`/users/${post.author_id}`" class="flex items-center gap-1.5 hover:text-accent transition-colors">
            <span class="w-6 h-6 rounded-full overflow-hidden border border-surface-border flex-shrink-0">
              <img v-if="post.users?.avatar" :src="post.users.avatar" :alt="post.users.name" class="w-full h-full object-cover" />
              <span v-else class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold">
                {{ (post.users?.name ?? 'U').charAt(0).toUpperCase() }}
              </span>
            </span>
            {{ post.users?.name ?? t('post.unknown') }}
          </NuxtLink>
          <time>{{ formatDate(post.createdAt) }}</time>
          <span v-if="post.views" class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            {{ t('post.views', { n: post.views }) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-surface-card border border-surface-border rounded-xl p-6 mb-6">
        <p class="leading-relaxed whitespace-pre-wrap" style="color: var(--text-secondary)">{{ post.description }}</p>
      </div>

      <!-- Code / Preview tabs -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div class="flex gap-1">
            <button
              @click="activeTab = 'preview'"
              class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border"
              :class="activeTab === 'preview' ? 'bg-accent-green/10 border-accent-green/40 text-accent-green' : 'border-surface-border hover:bg-surface-hover'"
              :style="activeTab !== 'preview' ? 'color: var(--text-secondary)' : ''"
            >{{ t('post.preview') }}</button>
            <button
              @click="activeTab = 'code'"
              class="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors border"
              :class="activeTab === 'code' ? 'bg-accent/10 border-accent/40 text-accent' : 'border-surface-border hover:bg-surface-hover'"
              :style="activeTab !== 'code' ? 'color: var(--text-secondary)' : ''"
            >{{ t('post.code') }}</button>
          </div>
          <button
            @click="showModal = true"
            class="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs px-3 py-2 sm:py-1.5 rounded-lg border transition-colors font-mono"
            style="border-color: var(--color-border); color: var(--text-muted)"
          >{{ t('post.fullscreen') }}</button>
        </div>

        <Transition name="tab" mode="out-in">
          <CodePreview v-if="activeTab === 'preview'" key="preview" :code="post.code" />
          <CodeBlock   v-else                         key="code"    :code="post.code" :language="post.language" />
        </Transition>
      </div>

      <!-- Comments -->
      <div class="mt-10">
        <h2 class="text-xl font-semibold mb-6" style="color: var(--text-primary)">
          {{ t('post.comments') }} <span class="font-normal text-base" style="color: var(--text-muted)">({{ comments.length }})</span>
        </h2>
        <div v-if="isLoggedIn" class="mb-8">
          <CommentForm :loading="commentLoading" @submit="onComment" />
        </div>
        <div v-else class="mb-8 p-4 bg-surface-card border border-surface-border rounded-xl text-center text-sm" style="color: var(--text-muted)">
          <NuxtLink to="/auth/login" class="text-accent hover:underline">{{ t('post.loginToComment') }}</NuxtLink> {{ t('post.toLeaveComment') }}
        </div>
        <CommentList :comments="comments" :loading="commentsLoading" @delete="onDeleteComment" />
      </div>
    </div>

    <PreviewModal v-if="post" v-model="showModal" :code="post.code" :title="post.title" />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const route  = useRoute()
const router = useRouter()
const id     = Number(route.params.id)

const { user, isLoggedIn, isAdmin } = useAuth()
const { error: toastError, success: toastSuccess } = useToast()
const { isBookmarked, toggle: toggleBookmark, loadBookmarks } = useBookmarks()

const post        = ref<Post | null>(null)
const pending     = ref(true)
const activeTab   = ref<'code' | 'preview'>('preview')
const showModal   = ref(false)
const copied      = ref(false)
const actionsOpen = ref(false)
const actionsRef  = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (actionsRef.value && !actionsRef.value.contains(e.target as Node)) {
      actionsOpen.value = false
    }
  })
})
const likesCount  = computed(() => post.value?.likes?.length ?? 0)
const userLiked   = computed(() => !!(user.value && post.value?.likes?.includes(user.value.id)))
const bookmarked  = computed(() => isBookmarked(id))
const canEdit     = computed(() => user.value && post.value && (user.value.id === post.value.author_id || isAdmin.value))

useHead(() => ({
  title: post.value ? `${post.value.title} — SnippetStash` : 'SnippetStash',
  meta: [
    { name: 'description', content: post.value?.description ?? '' },
    { property: 'og:title', content: post.value?.title ?? '' },
    { property: 'og:description', content: post.value?.description ?? '' },
  ],
}))

onMounted(async () => {
  try {
    const { getPost, incrementViews } = await import('~/services/api')
    post.value = await getPost(id)
    incrementViews(id, post.value.views ?? 0)
    post.value.views = (post.value.views ?? 0) + 1
  } catch {
    post.value = null
  } finally {
    pending.value = false
  }
  loadBookmarks()
})

async function handleLike() {
  if (!user.value || !post.value) return
  const { toggleLike } = await import('~/services/api')
  try {
    const updated = await toggleLike(id, post.value.likes ?? [], user.value.id)
    post.value = { ...post.value, likes: updated.likes }
  } catch { toastError('Failed to update like') }
}

async function handleBookmark() {
  if (!user.value) return
  await toggleBookmark(id)
  toastSuccess(bookmarked.value ? t('post.bookmark') : t('post.removeBookmark'))
}

async function sharePost() {
  await navigator.clipboard.writeText(window.location.href)
  copied.value = true
  toastSuccess(t('post.copyLink'))
  setTimeout(() => { copied.value = false }, 2000)
}

function downloadCode() {
  if (!post.value) return
  const ext = post.value.language?.toLowerCase() === 'html' ? 'html'
    : post.value.language?.toLowerCase() === 'css' ? 'css'
    : post.value.language?.toLowerCase() === 'python' ? 'py'
    : 'js'
  const blob = new Blob([post.value.code], { type: 'text/plain' })
  const a    = document.createElement('a')
  a.href     = URL.createObjectURL(blob)
  a.download = `${post.value.title.replace(/\s+/g, '-').toLowerCase()}.${ext}`
  a.click()
  URL.revokeObjectURL(a.href)
}

async function forkPost() {
  if (!user.value || !post.value) return
  try {
    const { createPost } = await import('~/services/api')
    const forked = await createPost({
      title:       `${t('post.forkOf')} ${post.value.title}`,
      description: post.value.description,
      code:        post.value.code,
      language:    post.value.language,
      tags:        post.value.tags,
      author_id:   user.value.id,
      createdAt:   new Date().toISOString(),
      likes:       [],
      views:       0,
    })
    toastSuccess(t('post.forkSuccess'))
    router.push(`/posts/${forked.id}`)
  } catch { toastError(t('post.forkFailed')) }
}

async function handleDelete() {
  if (!confirm(t('post.deleteConfirm'))) return
  try {
    const { deletePost } = await import('~/services/api')
    await deletePost(id)
    toastSuccess(t('post.deleteSuccess'))
    router.push('/posts')
  } catch { toastError(t('post.deleteFailed')) }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
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

.action-item {
  @apply flex items-center gap-2.5 px-3 py-2 text-sm transition-colors w-full;
  color: var(--text-secondary);
}
.action-item:hover {
  background: var(--color-hover);
  color: var(--text-primary);
}

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>
