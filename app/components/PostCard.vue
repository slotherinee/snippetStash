<template>
  <NuxtLink
    :to="`/posts/${post.id}`"
    class="flex flex-col h-full group bg-surface-card border border-surface-border rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5"
  >
    <!-- Mini live preview (fixed height) -->
    <div class="border-b border-surface-border flex-shrink-0">
      <MiniPreview :code="post.code" :height="152" />
    </div>

    <!-- Card body — grows to fill, footer always at bottom -->
    <div class="flex flex-col flex-1 p-4">
      <h3
        class="font-semibold group-hover:text-accent transition-colors line-clamp-1 mb-1"
        style="color: var(--text-primary)"
      >{{ post.title }}</h3>

      <p
        class="text-sm line-clamp-2 flex-1"
        style="color: var(--text-secondary)"
      >{{ post.description }}</p>

      <!-- Footer always pinned to bottom -->
      <div class="flex items-center justify-between mt-3 text-xs" style="color: var(--text-muted)">
        <span class="flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
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
        <time>{{ formatDate(post.createdAt) }}</time>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~/types'
defineProps<{ post: Post }>()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
