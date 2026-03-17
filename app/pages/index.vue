<template>
  <div>
    <!-- Hero -->
    <section class="text-center py-16 mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-accent to-accent-purple bg-clip-text text-transparent">
        SnippetStash
      </h1>
      <p class="text-lg max-w-xl mx-auto mb-8" style="color: var(--text-secondary)">
        {{ t('home.description') }}
      </p>
      <div class="flex items-center justify-center gap-4 flex-wrap">
        <NuxtLink to="/posts" class="btn-primary text-base px-6 py-3">{{ t('home.browse') }}</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/create" class="btn-ghost text-base px-6 py-3 border border-surface-border">
          {{ t('home.shareCode') }}
        </NuxtLink>
        <NuxtLink v-else to="/auth/register" class="btn-ghost text-base px-6 py-3 border border-surface-border">
          {{ t('home.joinCommunity') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Stats -->
    <section class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface-card border border-surface-border rounded-xl p-4 text-center stat-card"
      >
        <div class="text-3xl font-bold text-accent font-mono">{{ stat.value }}</div>
        <div class="text-sm mt-1" style="color: var(--text-secondary)">{{ stat.label }}</div>
      </div>
    </section>

    <!-- Search -->
    <div class="mb-8">
      <SearchBar v-model="search" :placeholder="t('home.searchPlaceholder')" />
    </div>

    <!-- Recent posts -->
    <section>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-semibold" style="color: var(--text-primary)">
          {{ search ? t('home.resultsFor', { q: search }) : t('home.recent') }}
        </h2>
        <NuxtLink to="/posts" class="text-sm text-accent hover:text-accent/80 transition-colors">{{ t('home.viewAll') }}</NuxtLink>
      </div>
      <PostList :posts="posts" :loading="loading" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { getPosts, getUsers } from '~/services/api'

definePageMeta({ layout: 'default' })
useHead({
  title: 'Share & Discover Code Snippets',
  meta: [
    { name: 'description', content: 'A community-driven library of reusable code snippets. Share, discover, and learn from HTML, CSS, JavaScript and more.' },
    { property: 'og:title', content: 'SnippetStash — Share & Discover Code Snippets' },
    { property: 'og:description', content: 'A community-driven library of reusable code snippets.' },
  ],
})

const { t } = useI18n()
const { isLoggedIn } = useAuth()
const { posts, loading, fetchPosts } = usePosts()
const search = ref('')
const totalPosts = ref(0)
const totalUsers = ref(0)

const stats = computed(() => [
  { label: t('home.stats.snippets'), value: totalPosts.value },
  { label: t('home.stats.members'), value: totalUsers.value },
  { label: t('home.stats.languages'), value: '10+' },
  { label: t('home.stats.free'), value: '∞' },
])

watch(search, useDebounceFn(() => fetchPosts({ page: 1, limit: 6, search: search.value || undefined, sortBy: '-createdAt' }), 300))

onMounted(async () => {
  await fetchPosts({ page: 1, limit: 6, sortBy: '-createdAt' })
  try {
    const allRes = await getPosts({ page: 1, limit: 1 })
    totalPosts.value = allRes.meta.total_items
    const users = await getUsers()
    totalUsers.value = users.length
  } catch {}
})
</script>

<style scoped>
.stat-card { animation: fadeUp 0.5s ease both; }
.stat-card:nth-child(1) { animation-delay: 0ms; }
.stat-card:nth-child(2) { animation-delay: 80ms; }
.stat-card:nth-child(3) { animation-delay: 160ms; }
.stat-card:nth-child(4) { animation-delay: 240ms; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
