<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--text-primary)">All Snippets</h1>
        <!-- Active tag badge -->
        <div v-if="tag" class="flex items-center gap-2 mt-1">
          <span class="text-sm" style="color: var(--text-muted)">Tag:</span>
          <span class="flex items-center gap-1 text-sm px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
            #{{ tag }}
            <button @click="tag = ''" class="hover:text-white transition-colors leading-none ml-0.5">✕</button>
          </span>
        </div>
      </div>
      <NuxtLink v-if="isLoggedIn" to="/create" class="btn-primary text-sm text-center">+ New Snippet</NuxtLink>
    </div>

    <!-- Search — full width -->
    <div class="mb-3">
      <SearchBar v-model="search" placeholder="Search by title…" />
    </div>

    <!-- Filters row -->
    <div class="flex gap-3 mb-6">
      <select v-model="language" class="input cursor-pointer flex-1">
        <option value="">All languages</option>
        <option v-for="lang in LANGUAGES" :key="lang" :value="lang">{{ lang }}</option>
      </select>
      <select v-model="sortBy" class="input cursor-pointer flex-1">
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

const route    = useRoute()
const { isLoggedIn } = useAuth()
const { posts, meta, loading, fetchPosts } = usePosts()

const search   = ref('')
const sortBy   = ref('createdAt')
const language = ref('')
const tag      = ref((route.query.tag as string) ?? '')
const page     = ref(1)

async function load() {
  if (tag.value) {
    // Mokky can't filter array fields server-side — fetch all and filter client-side
    await fetchPosts({
      page:     1,
      limit:    200,
      search:   search.value || undefined,
      sortBy:   sortBy.value,
      language: language.value || undefined,
    })
    posts.value = posts.value.filter(p =>
      p.tags?.some(t => t.toLowerCase() === tag.value.toLowerCase())
    )
  } else {
    await fetchPosts({
      page:     page.value,
      limit:    12,
      search:   search.value || undefined,
      sortBy:   sortBy.value,
      language: language.value || undefined,
    })
  }
}

function goToPage(p: number) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
  load()
}

watch(search,   useDebounceFn(() => { page.value = 1; load() }, 350))
watch(sortBy,   () => { page.value = 1; load() })
watch(language, () => { page.value = 1; load() })
watch(tag,      () => { page.value = 1; load() })

// Sync tag from URL query when navigating via NuxtLink
watch(() => route.query.tag, val => { tag.value = (val as string) ?? '' })

onMounted(load)
</script>
