import type { Comment } from '~/types'
import * as api from '~/services/api'

export function useComments(postId: number) {
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchComments() {
    loading.value = true
    error.value = null
    try {
      comments.value = await api.getComments(postId)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load comments'
    } finally {
      loading.value = false
    }
  }

  async function addComment(data: Omit<Comment, 'id'>) {
    // Optimistic insert
    const temp: Comment = { ...data, id: Date.now() }
    comments.value.push(temp)
    try {
      const created = await api.createComment(data)
      const idx = comments.value.findIndex(c => c.id === temp.id)
      if (idx !== -1) comments.value[idx] = created
    } catch (e) {
      // rollback
      comments.value = comments.value.filter(c => c.id !== temp.id)
      throw e
    }
  }

  async function removeComment(id: number) {
    const backup = [...comments.value]
    comments.value = comments.value.filter(c => c.id !== id)
    try {
      await api.deleteComment(id)
    } catch {
      comments.value = backup
      throw new Error('Failed to delete comment')
    }
  }

  return { comments, loading, error, fetchComments, addComment, removeComment }
}
