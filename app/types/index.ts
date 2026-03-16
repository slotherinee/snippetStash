export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  avatar?: string
  language?: string
}

export interface Post {
  id: number
  title: string
  description: string
  code: string
  language?: string
  tags?: string[]
  likes?: number[]      // array of user IDs who liked
  views?: number
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

export interface Bookmark {
  id: number
  user_id: number
  post_id: number
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

export const LANGUAGES = [
  'HTML/CSS', 'JavaScript', 'TypeScript',
  'Vue', 'React', 'Python', 'Go', 'Rust',
  'SQL', 'Bash', 'JSON', 'Markdown', 'Other',
] as const

export type Language = typeof LANGUAGES[number]
