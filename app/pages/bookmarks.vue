<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">{{ t('bookmarks.title') }}</h1>
        <p class="text-sm mt-1" style="color: var(--text-muted)">{{ t('bookmarks.subtitle') }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton v-for="n in 6" :key="n" class="h-64 rounded-xl" />
    </div>

    <!-- Empty -->
    <div v-else-if="posts.length === 0" class="text-center py-24">
      <p class="text-5xl mb-4">🔖</p>
      <h2 class="text-lg font-semibold mb-2" style="color: var(--text-primary)">{{ t('bookmarks.empty') }}</h2>
      <p class="text-sm mb-6" style="color: var(--text-muted)">{{ t('bookmarks.emptyHint') }}</p>
      <NuxtLink to="/posts" class="btn-primary">{{ t('bookmarks.browseAll') }}</NuxtLink>
    </div>

    <!-- Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(post, i) in posts"
        :key="post.id"
        class="animate-in h-full"
        :style="{ animationDelay: `${i * 40}ms` }"
      >
        <PostCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Bookmarks — SnippetStash' })

const { t } = useI18n()
const { user } = useAuth()

const posts   = ref<Post[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!user.value) return
  try {
    const { getBookmarks, getPost } = await import('~/services/api')
    const bookmarks = await getBookmarks(user.value.id)
    const settled   = await Promise.allSettled(bookmarks.map(b => getPost(b.post_id)))
    posts.value     = settled
      .filter((r): r is PromiseFulfilledResult<Post> => r.status === 'fulfilled')
      .map(r => r.value)
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})
</script>
