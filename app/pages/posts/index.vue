<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-primary)">All Snippets</h1>
      <NuxtLink v-if="isLoggedIn" to="/create" class="btn-primary text-sm">+ New Snippet</NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1 min-w-0">
        <SearchBar v-model="search" placeholder="Search by title…" />
      </div>
      <select v-model="language" class="input cursor-pointer" style="width: auto; min-width: 140px; max-width: 180px">
        <option value="">All languages</option>
        <option v-for="lang in LANGUAGES" :key="lang" :value="lang">{{ lang }}</option>
      </select>
      <select v-model="sortBy" class="input cursor-pointer" style="width: auto; min-width: 140px; max-width: 160px">
        <option value="createdAt">Newest first</option>
        <option value="-createdAt">Oldest first</option>
      </select>
    </div>

    <PostList :posts="posts" :loading="loading" empty-message="No snippets match your search." />

    <div v-if="meta && meta.total_pages > 1" class="mt-8 flex flex-col items-center gap-3">
      <Pagination :current-page="meta.current_page" :total-pages="meta.total_pages" @go="goToPage" />
      <p class="text-xs" style="color: var(--text-muted)">
        Showing {{ posts.length }} of {{ meta.total_items }} snippets
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGES } from '~/types'

definePageMeta({ layout: 'default' })
useHead({ title: 'Browse Snippets — SnippetStash' })

const { isLoggedIn } = useAuth()
const { posts, meta, loading, fetchPosts } = usePosts()

const search   = ref('')
const sortBy   = ref('createdAt')
const language = ref('')
const page     = ref(1)

async function load() {
  await fetchPosts({
    page:     page.value,
    limit:    12,
    search:   search.value || undefined,
    sortBy:   sortBy.value,
    language: language.value || undefined,
  })
}

function goToPage(p: number) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
  load()
}

watch(search,   useDebounceFn(() => { page.value = 1; load() }, 350))
watch(sortBy,   () => { page.value = 1; load() })
watch(language, () => { page.value = 1; load() })

onMounted(load)
</script>
