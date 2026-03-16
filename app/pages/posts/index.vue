<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold" style="color: var(--text-primary)">All Snippets</h1>
      <NuxtLink v-if="isLoggedIn" to="/create" class="btn-primary text-sm">+ New Snippet</NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6">
      <div class="flex-1 min-w-0">
        <SearchBar v-model="search" placeholder="Search by title…" />
      </div>
      <select
        v-model="sortBy"
        class="input flex-shrink-0 cursor-pointer"
        style="width: 160px"
      >
        <option value="createdAt">Newest first</option>
        <option value="-createdAt">Oldest first</option>
      </select>
    </div>

    <!-- Posts -->
    <PostList :posts="posts" :loading="loading" empty-message="No snippets match your search." />

    <!-- Pagination -->
    <div v-if="meta" class="mt-8 flex flex-col items-center gap-3">
      <Pagination :current-page="meta.current_page" :total-pages="meta.total_pages" @go="goToPage" />
      <p class="text-xs" style="color: var(--text-muted)">
        Showing {{ posts.length }} of {{ meta.total_items }} snippets
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { isLoggedIn } = useAuth()
const { posts, meta, loading, fetchPosts } = usePosts()

const search = ref('')
const sortBy = ref('createdAt')
const page = ref(1)

async function load() {
  await fetchPosts({ page: page.value, limit: 12, search: search.value || undefined, sortBy: sortBy.value })
}

function goToPage(p: number) {
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
  load()
}

watch(search, useDebounceFn(() => { page.value = 1; load() }, 350))
watch(sortBy, () => { page.value = 1; load() })

onMounted(load)
</script>
