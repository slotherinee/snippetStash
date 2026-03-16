<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-1" style="color: var(--text-primary)">Trending Snippets</h1>
      <p class="text-sm" style="color: var(--text-muted)">Most liked and viewed snippets from the community</p>
    </div>

    <!-- Sort tabs -->
    <div class="flex flex-col sm:flex-row gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="sortMode = tab.value"
        class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border"
        :class="sortMode === tab.value
          ? 'bg-accent/10 border-accent/40 text-accent'
          : 'border-surface-border hover:bg-surface-hover'"
        :style="sortMode !== tab.value ? 'color: var(--text-secondary)' : ''"
      >{{ tab.label }}</button>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton v-for="n in 6" :key="n" class="h-64 rounded-xl" />
    </div>

    <div v-else-if="sorted.length === 0" class="text-center py-20">
      <p class="text-4xl mb-3">📭</p>
      <p style="color: var(--text-muted)">No snippets yet</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(post, i) in sorted"
        :key="post.id"
        class="animate-in rounded-xl"
        :class="rankClass(i)"
        :style="{ animationDelay: `${i * 40}ms` }"
      >
        <PostCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Trending — SnippetStash' })

const tabs = [
  { value: 'likes',  label: '♥ Most Liked'   },
  { value: 'views',  label: '👁 Most Viewed'  },
  { value: 'newest', label: '✦ Newest'        },
]

// gold / silver / bronze outlines + glows
function rankClass(i: number) {
  if (i === 0) return 'ring-2 ring-yellow-400/70 shadow-[0_0_20px_-4px_rgba(250,204,21,0.45)]'
  if (i === 1) return 'ring-2 ring-slate-400/60 shadow-[0_0_20px_-4px_rgba(148,163,184,0.35)]'
  if (i === 2) return 'ring-2 ring-amber-700/60 shadow-[0_0_20px_-4px_rgba(180,83,9,0.35)]'
  return ''
}

const sortMode = ref<'likes' | 'views' | 'newest'>('likes')
const posts    = ref<Post[]>([])
const loading  = ref(true)

const sorted = computed(() => {
  const arr = [...posts.value]
  if (sortMode.value === 'likes')  return arr.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
  if (sortMode.value === 'views')  return arr.sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

onMounted(async () => {
  try {
    const { getPosts } = await import('~/services/api')
    // Fetch up to 50 posts for client-side ranking
    const res = await getPosts({ page: 1, limit: 50, sortBy: 'createdAt' })
    posts.value = res.items
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
})
</script>
