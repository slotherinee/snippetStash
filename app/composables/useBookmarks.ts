import type { Bookmark } from '~/types'
import * as api from '~/services/api'

export function useBookmarks() {
  const { user } = useAuth()
  const bookmarks = useState<Bookmark[]>('bookmarks', () => [])

  async function loadBookmarks() {
    if (!user.value) return
    try {
      bookmarks.value = await api.getBookmarks(user.value.id)
    } catch {
      bookmarks.value = []
    }
  }

  function isBookmarked(postId: number): boolean {
    return bookmarks.value.some(b => b.post_id === postId)
  }

  function getBookmark(postId: number): Bookmark | undefined {
    return bookmarks.value.find(b => b.post_id === postId)
  }

  async function toggle(postId: number) {
    if (!user.value) return
    const existing = getBookmark(postId)
    if (existing) {
      // optimistic remove
      bookmarks.value = bookmarks.value.filter(b => b.id !== existing.id)
      await api.removeBookmark(existing.id).catch(() => loadBookmarks())
    } else {
      // optimistic add
      const temp: Bookmark = { id: Date.now(), user_id: user.value.id, post_id: postId }
      bookmarks.value.push(temp)
      try {
        const created = await api.addBookmark(user.value.id, postId)
        const idx = bookmarks.value.findIndex(b => b.id === temp.id)
        if (idx !== -1) bookmarks.value[idx] = created
      } catch {
        await loadBookmarks()
      }
    }
  }

  return { bookmarks, loadBookmarks, isBookmarked, toggle }
}
