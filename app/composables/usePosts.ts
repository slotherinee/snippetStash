import type { Post, PaginatedResponse } from '~/types'
import * as api from '~/services/api'
import type { GetPostsParams } from '~/services/api'

export function usePosts() {
  const posts = ref<Post[]>([])
  const meta = ref<PaginatedResponse<Post>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts(params: GetPostsParams = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await api.getPosts(params)
      posts.value = res.items
      meta.value = res.meta
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load posts'
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(id: number) {
    loading.value = true
    error.value = null
    const post = ref<Post | null>(null)
    try {
      post.value = await api.getPost(id)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Post not found'
    } finally {
      loading.value = false
    }
    return post
  }

  async function create(data: Omit<Post, 'id'>) {
    return api.createPost(data)
  }

  async function update(id: number, data: Partial<Post>) {
    return api.updatePost(id, data)
  }

  async function remove(id: number) {
    return api.deletePost(id)
  }

  return { posts, meta, loading, error, fetchPosts, fetchPost, create, update, remove }
}
