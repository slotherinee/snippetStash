<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-3">
      <LoadingSkeleton v-for="i in 3" :key="i" class="h-20" />
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8 text-sm" style="color: var(--text-muted)">
      No comments yet. Be the first!
    </div>

    <TransitionGroup v-else name="comment" tag="div" class="space-y-3">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-surface-card border border-surface-border rounded-xl p-4 group"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
              <img
                v-if="comment.users?.avatar"
                :src="comment.users.avatar"
                :alt="comment.users.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-accent-purple to-accent flex items-center justify-center text-white text-xs font-bold"
              >{{ (comment.users?.name ?? 'U').charAt(0).toUpperCase() }}</div>
            </div>
            <span class="text-sm font-medium" style="color: var(--text-primary)">{{ comment.users?.name ?? 'Unknown' }}</span>
            <time class="text-xs" style="color: var(--text-muted)">{{ formatDate(comment.createdAt) }}</time>
          </div>
          <button
            v-if="canDelete(comment)"
            @click="emit('delete', comment.id)"
            class="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 transition-all"
          >Delete</button>
        </div>
        <p class="text-sm leading-relaxed pl-9" style="color: var(--text-secondary)">{{ comment.text }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

const props = defineProps<{ comments: Comment[]; loading?: boolean }>()
const emit = defineEmits<{ delete: [id: number] }>()

const { user, isAdmin } = useAuth()

function canDelete(comment: Comment) {
  if (!user.value) return false
  return isAdmin.value || comment.author_id === user.value.id
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.comment-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.comment-leave-active { transition: all 0.2s ease; }
.comment-enter-from { opacity: 0; transform: scale(0.97) translateY(8px); }
.comment-leave-to { opacity: 0; transform: scale(0.97); }
</style>
