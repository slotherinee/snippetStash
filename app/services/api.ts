import type { Post, Comment, User, Bookmark, PaginatedResponse } from '~/types'

const BASE = 'https://36ca592e6586d4b9.mokky.dev'

function url(path: string) {
  return `${BASE}${path}`
}

function authHeaders(): Record<string, string> {
  const token = import.meta.client ? localStorage.getItem('token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Users ──────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  return $fetch(url('/users'))
}

export async function getUsersMap(): Promise<Map<number, User>> {
  const users = await getUsers()
  return new Map(users.map(u => [u.id, u]))
}

export async function getUser(id: number): Promise<User> {
  return $fetch(url(`/users/${id}`))
}

export async function updateUser(id: number, data: Partial<Pick<User, 'name' | 'avatar' | 'language'>>): Promise<User> {
  return $fetch(url(`/users/${id}`), {
    method: 'PATCH',
    body: data,
    headers: authHeaders(),
  })
}

// ── Posts ──────────────────────────────────────────────────────────────────

export interface GetPostsParams {
  page?: number
  limit?: number
  search?: string
  author_id?: number
  sortBy?: string
  language?: string
  tag?: string
}

export async function getPosts(params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  }
  if (params.search)    query['title'] = `*${params.search}*`
  if (params.author_id) query['author_id'] = params.author_id
  if (params.language)  query['language'] = params.language
  if (params.tag)       query['tags'] = params.tag
  query['sortBy'] = params.sortBy ?? 'createdAt'

  const [postsRes, usersMap] = await Promise.all([
    $fetch<PaginatedResponse<Post>>(url('/posts'), { query }),
    getUsersMap().catch(() => new Map<number, User>()),
  ])

  postsRes.items = postsRes.items.map(p => ({
    ...p,
    users: usersMap.get(p.author_id) ?? undefined,
  }))

  return postsRes
}

export async function getPost(id: number): Promise<Post> {
  const [post, usersMap] = await Promise.all([
    $fetch<Post>(url(`/posts/${id}`)),
    getUsersMap().catch(() => new Map<number, User>()),
  ])
  return { ...post, users: usersMap.get(post.author_id) ?? undefined }
}

export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  return $fetch(url('/posts'), {
    method: 'POST',
    body: data,
    headers: authHeaders(),
  })
}

export async function updatePost(id: number, data: Partial<Post>): Promise<Post> {
  return $fetch(url(`/posts/${id}`), {
    method: 'PATCH',
    body: data,
    headers: authHeaders(),
  })
}

export async function deletePost(id: number): Promise<void> {
  return $fetch(url(`/posts/${id}`), {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function incrementViews(id: number, currentViews: number): Promise<void> {
  await $fetch(url(`/posts/${id}`), {
    method: 'PATCH',
    body: { views: currentViews + 1 },
  }).catch(() => {})
}

export async function toggleLike(id: number, currentLikes: number[], userId: number): Promise<Post> {
  const likes = currentLikes.includes(userId)
    ? currentLikes.filter(u => u !== userId)
    : [...currentLikes, userId]
  return $fetch(url(`/posts/${id}`), {
    method: 'PATCH',
    body: { likes },
    headers: authHeaders(),
  })
}

// ── Comments ───────────────────────────────────────────────────────────────

export async function getComments(post_id: number): Promise<Comment[]> {
  const [result, usersMap] = await Promise.all([
    $fetch<Comment[] | PaginatedResponse<Comment>>(url('/comments'), { query: { post_id } }),
    getUsersMap().catch(() => new Map<number, User>()),
  ])
  const comments = Array.isArray(result) ? result : result.items
  return comments.map(c => ({ ...c, users: usersMap.get(c.author_id) ?? undefined }))
}

export async function createComment(data: Omit<Comment, 'id'>): Promise<Comment> {
  return $fetch(url('/comments'), {
    method: 'POST',
    body: data,
    headers: authHeaders(),
  })
}

export async function deleteComment(id: number): Promise<void> {
  return $fetch(url(`/comments/${id}`), {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Bookmarks ──────────────────────────────────────────────────────────────

export async function getBookmarks(_user_id?: number): Promise<Bookmark[]> {
  // Fetch all bookmarks — user_id may be missing on older records,
  // so we skip server-side filtering and handle it client-side
  return $fetch<Bookmark[]>(url('/bookmarks'), {
    headers: authHeaders(),
  })
}

export async function addBookmark(user_id: number, post_id: number): Promise<Bookmark> {
  return $fetch(url('/bookmarks'), {
    method: 'POST',
    body: { user_id, post_id },
    headers: authHeaders(),
  })
}

export async function removeBookmark(id: number): Promise<void> {
  return $fetch(url(`/bookmarks/${id}`), {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<{ token: string; data: User }> {
  return $fetch(url('/register'), {
    method: 'POST',
    body: { ...data, role: 'user' },
  })
}

export async function login(email: string, password: string): Promise<{ token: string; data: User }> {
  return $fetch(url('/auth'), {
    method: 'POST',
    body: { email, password },
  })
}

export async function getMe(): Promise<User> {
  return $fetch(url('/auth_me'), {
    headers: authHeaders(),
  })
}
