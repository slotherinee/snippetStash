<template>
  <NuxtLink
    :to="`/posts/${post.id}`"
    class="flex flex-col h-full group bg-surface-card border border-surface-border rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5"
  >
    <!-- Mini live preview -->
    <div class="border-b border-surface-border flex-shrink-0 relative">
      <MiniPreview :code="post.code" :height="152" />
      <!-- Language badge -->
      <span
        v-if="post.language"
        class="absolute top-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-white backdrop-blur-sm border border-white/10"
      >{{ post.language }}</span>
    </div>

    <!-- Card body -->
    <div class="flex flex-col flex-1 p-4">
      <h3
        class="font-semibold group-hover:text-accent transition-colors line-clamp-1 mb-1"
        style="color: var(--text-primary)"
      >{{ post.title }}</h3>

      <p class="text-sm line-clamp-2" style="color: var(--text-secondary)">
        {{ post.description }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags?.length" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          @click.prevent.stop="navigateTo(`/posts?tag=${encodeURIComponent(tag)}`)"
          class="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer"
        >#{{ tag }}</span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-3 text-xs" style="color: var(--text-muted)">
        <!-- Author -->
        <span
          class="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
          @click.prevent.stop="navigateTo(`/users/${post.author_id}`)"
        >
          <span class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
            <img
              v-if="post.users?.avatar"
              :src="post.users.avatar"
              :alt="post.users.name"
              class="w-full h-full object-cover"
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
            />
            <span
              v-else
              class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-[10px] font-bold"
            >{{ (post.users?.name ?? 'U').charAt(0).toUpperCase() }}</span>
          </span>
          {{ post.users?.name ?? 'Unknown' }}
        </span>

        <!-- Stats -->
        <div class="flex items-center gap-2.5">
          <span v-if="post.views" class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            {{ post.views }}
          </span>
          <span v-if="likesCount > 0" class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            {{ likesCount }}
          </span>
          <time>{{ formatDate(post.createdAt) }}</time>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const props = defineProps<{ post: Post }>()
const likesCount = computed(() => props.post.likes?.length ?? 0)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
