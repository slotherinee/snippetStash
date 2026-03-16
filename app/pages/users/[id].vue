<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <LoadingSkeleton class="h-24 w-full rounded-xl" />
      <LoadingSkeleton class="h-48 w-full rounded-xl" />
    </div>

    <!-- Error -->
    <div v-else-if="!profile" class="text-center py-20">
      <p class="text-5xl mb-4">👤</p>
      <h2 class="text-xl font-semibold" style="color: var(--text-secondary)">{{ t('profile.notFound') }}</h2>
      <NuxtLink to="/posts" class="btn-primary mt-6 inline-block">{{ t('profile.browseAll') }}</NuxtLink>
    </div>

    <template v-else>
      <!-- Profile card -->
      <div class="bg-surface-card border border-surface-border rounded-xl p-6 mb-6 flex flex-col items-center text-center gap-4">
        <!-- Avatar -->
        <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-surface-border flex-shrink-0">
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            :alt="profile.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-3xl font-bold"
          >{{ profile.name.charAt(0).toUpperCase() }}</div>
        </div>

        <!-- Name + role -->
        <div>
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <h1
              class="text-xl font-bold"
              :style="profile.role === 'admin'
                ? 'background: linear-gradient(90deg, #bc8cff, #79c0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text'
                : 'color: var(--text-primary)'"
            >{{ profile.name }}</h1>
          </div>
        </div>

        <!-- Stats row -->
        <div class="flex items-center justify-center gap-4 sm:gap-6 text-sm flex-wrap">
          <div class="flex flex-col items-center gap-0.5">
            <span class="font-bold text-lg font-mono" style="color: var(--text-primary)">{{ totalPosts }}</span>
            <span style="color: var(--text-muted)">{{ t('profile.snippets') }}</span>
          </div>
          <div class="w-px h-8" style="background: var(--color-border)" />
          <div class="flex flex-col items-center gap-0.5">
            <span class="font-bold text-lg font-mono" style="color: var(--text-primary)">{{ totalLikes }}</span>
            <span style="color: var(--text-muted)">{{ t('profile.likes') }}</span>
          </div>
          <div class="w-px h-8" style="background: var(--color-border)" />
          <div class="flex flex-col items-center gap-0.5">
            <span class="font-bold text-lg font-mono" style="color: var(--text-primary)">{{ totalViews }}</span>
            <span style="color: var(--text-muted)">{{ t('profile.views') }}</span>
          </div>
          <template v-if="isSelf">
            <div class="w-px h-8" style="background: var(--color-border)" />
            <div class="flex flex-col items-center gap-0.5">
              <span class="font-bold text-lg font-mono" style="color: var(--text-primary)">{{ bookmarkedPosts.length }}</span>
              <span style="color: var(--text-muted)">{{ t('profile.saved') }}</span>
            </div>
          </template>
        </div>

        <!-- Edit profile button (own profile) -->
        <NuxtLink
          v-if="isSelf"
          to="/settings"
          class="btn-ghost text-sm border border-surface-border"
        >{{ t('profile.editProfile') }}</NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="flex flex-col sm:flex-row gap-1 mb-5 p-1 rounded-xl bg-surface-hover border border-surface-border">
        <button
          @click="activeTab = 'snippets'"
          class="flex-1 px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between sm:justify-center gap-2"
          :class="activeTab === 'snippets' ? 'bg-surface-card border border-surface-border text-primary shadow-sm' : 'text-secondary hover:bg-surface-card border border-transparent'"
        >
          <span>{{ t('profile.snippetsTab') }}</span>
          <span
            class="text-xs px-1.5 py-0.5 rounded-full font-mono"
            :class="activeTab === 'snippets' ? 'bg-surface-hover border border-surface-border text-secondary' : 'bg-surface-card border border-surface-border text-muted'"
          >{{ totalPosts }}</span>
        </button>
        <button
          v-if="isSelf"
          @click="onBookmarksTab"
          class="flex-1 px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between sm:justify-center gap-2"
          :class="activeTab === 'bookmarks' ? 'bg-surface-card border border-surface-border text-primary shadow-sm' : 'text-secondary hover:bg-surface-card border border-transparent'"
        >
          <span>{{ t('profile.bookmarksTab') }}</span>
          <span
            v-if="bookmarkedPosts.length || bookmarksLoaded"
            class="text-xs px-1.5 py-0.5 rounded-full font-mono"
            :class="activeTab === 'bookmarks' ? 'bg-surface-hover border border-surface-border text-secondary' : 'bg-surface-card border border-surface-border text-muted'"
          >{{ bookmarkedPosts.length }}</span>
        </button>
      </div>

      <!-- Snippets tab -->
      <template v-if="activeTab === 'snippets'">
        <PostList
          :posts="posts"
          :loading="postsLoading"
          :empty-message="`${profile.name} ${t('profile.noSnippets')}`"
        />
      </template>

      <!-- Bookmarks tab -->
      <template v-else-if="activeTab === 'bookmarks'">
        <div v-if="bookmarksLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton v-for="i in 3" :key="i" class="h-48 rounded-xl" />
        </div>
        <PostList
          v-else
          :posts="bookmarkedPosts"
          :loading="false"
          :empty-message="t('profile.noBookmarks')"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { User, Post } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const route = useRoute()
const userId = Number(route.params.id)

const { user: me } = useAuth()
const isSelf = computed(() => me.value?.id === userId)

const profile = ref<User | null>(null)
const posts   = ref<Post[]>([])
const pending = ref(true)
const postsLoading = ref(false)

const activeTab = ref<'snippets' | 'bookmarks'>('snippets')

const bookmarkedPosts  = ref<Post[]>([])
const bookmarksLoading = ref(false)
const bookmarksLoaded  = ref(false)

const totalPosts = computed(() => posts.value.length)
const totalLikes = computed(() => posts.value.reduce((s, p) => s + (p.likes?.length ?? 0), 0))
const totalViews = computed(() => posts.value.reduce((s, p) => s + (p.views ?? 0), 0))

useHead(() => ({
  title: profile.value ? `${profile.value.name} — SnippetStash` : 'User — SnippetStash',
}))

onMounted(async () => {
  try {
    const { getUser, getPosts } = await import('~/services/api')
    const [u, postsRes] = await Promise.all([
      getUser(userId),
      getPosts({ author_id: userId, limit: 100 }),
    ])
    profile.value = u
    posts.value   = postsRes.items
  } catch {
    profile.value = null
  } finally {
    pending.value = false
  }
})

async function onBookmarksTab() {
  activeTab.value = 'bookmarks'
  if (bookmarksLoaded.value) return
  bookmarksLoading.value = true
  try {
    const { getBookmarks, getPost } = await import('~/services/api')
    const bms = await getBookmarks()
    const results = await Promise.allSettled(bms.map(b => getPost(b.post_id)))
    bookmarkedPosts.value = results
      .filter((r): r is PromiseFulfilledResult<Post> => r.status === 'fulfilled')
      .map(r => r.value)
    bookmarksLoaded.value = true
  } catch {
    bookmarkedPosts.value = []
  } finally {
    bookmarksLoading.value = false
  }
}
</script>
