import type { Post, Comment, User, PaginatedResponse } from '~/types'

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

/** Fetch all users and return a Map<id, User> for fast lookups */
export async function getUsersMap(): Promise<Map<number, User>> {
  const users = await getUsers()
  return new Map(users.map(u => [u.id, u]))
}

// ── Posts ──────────────────────────────────────────────────────────────────

export interface GetPostsParams {
  page?: number
  limit?: number
  search?: string
  author_id?: number
  sortBy?: string
}

export async function getPosts(params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  }
  if (params.search) query['title'] = `*${params.search}*`
  if (params.author_id) query['author_id'] = params.author_id
  // sortBy=createdAt → descending (newest), sortBy=-createdAt → ascending (oldest)
  query['sortBy'] = params.sortBy ?? 'createdAt'

  const [postsRes, usersMap] = await Promise.all([
    $fetch<PaginatedResponse<Post>>(url('/posts'), { query }),
    getUsersMap().catch(() => new Map<number, User>()),
  ])

  // Manually attach user data to each post
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

export async function updateUser(id: number, data: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> {
  return $fetch(url(`/users/${id}`), {
    method: 'PATCH',
    body: data,
    headers: authHeaders(),
  })
}
