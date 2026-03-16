export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  avatar?: string
}

export interface Post {
  id: number
  title: string
  description: string
  code: string
  iframeUrl?: string
  author_id: number
  createdAt: string
  users?: User
}

export interface Comment {
  id: number
  post_id: number
  author_id: number
  text: string
  createdAt: string
  users?: User
}

export interface PaginationMeta {
  total_items: number
  total_pages: number
  current_page: number
  per_page: number
  remaining_count: number
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta
  items: T[]
}

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}
