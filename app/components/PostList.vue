<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LoadingSkeleton v-for="i in skeletonCount" :key="i" class="h-52" />
    </div>

    <!-- Empty state -->
    <div v-else-if="posts.length === 0" class="text-center py-20 text-gray-500">
      <div class="text-5xl mb-4">📭</div>
      <p class="text-lg font-medium text-gray-400">No snippets found</p>
      <p class="text-sm mt-1">{{ emptyMessage }}</p>
    </div>

    <!-- Post grid with staggered animation -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(post, i) in posts"
        :key="post.id"
        class="animate-in h-full"
        :style="{ animationDelay: `${i * 60}ms` }"
      >
        <PostCard :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

withDefaults(defineProps<{
  posts: Post[]
  loading?: boolean
  skeletonCount?: number
  emptyMessage?: string
}>(), {
  skeletonCount: 6,
  emptyMessage: 'Be the first to share a snippet!',
})
</script>

<style scoped>
.animate-in {
  animation: slideUp 0.4s ease both;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
