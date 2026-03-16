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
      <h2 class="text-xl font-semibold" style="color: var(--text-secondary)">User not found</h2>
      <NuxtLink to="/posts" class="btn-primary mt-6 inline-block">Browse Snippets</NuxtLink>
    </div>

    <template v-else>
      <!-- Profile card -->
      <div class="bg-surface-card border border-surface-border rounded-xl p-6 mb-8 flex items-center gap-5">
        <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-surface-border flex-shrink-0">
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            :alt="profile.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-2xl font-bold"
          >{{ profile.name.charAt(0).toUpperCase() }}</div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-bold" style="color: var(--text-primary)">{{ profile.name }}</h1>
            <span
              v-if="profile.role === 'admin'"
              class="text-xs px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
            >admin</span>
          </div>
          <div class="flex items-center gap-4 mt-1 text-sm" style="color: var(--text-muted)">
            <span>{{ totalPosts }} snippet{{ totalPosts !== 1 ? 's' : '' }}</span>
            <span>{{ totalLikes }} total likes</span>
            <span>{{ totalViews }} total views</span>
          </div>
        </div>
        <NuxtLink
          v-if="isSelf"
          to="/settings"
          class="btn-ghost text-sm border border-surface-border"
        >Edit Profile</NuxtLink>
      </div>

      <!-- Posts grid -->
      <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary)">
        Snippets by {{ profile.name }}
      </h2>
      <PostList :posts="posts" :loading="postsLoading" :empty-message="`${profile.name} hasn't shared any snippets yet.`" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { User, Post } from '~/types'

definePageMeta({ layout: 'default' })

const route = useRoute()
const userId = Number(route.params.id)

const { user: me } = useAuth()
const isSelf = computed(() => me.value?.id === userId)

const profile = ref<User | null>(null)
const posts = ref<Post[]>([])
const pending = ref(true)
const postsLoading = ref(false)

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
</script>
