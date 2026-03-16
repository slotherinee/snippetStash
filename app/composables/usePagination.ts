export function usePagination(initialPage = 1, initialLimit = 10) {
  const page = ref(initialPage)
  const limit = ref(initialLimit)
  const totalPages = ref(0)
  const totalItems = ref(0)

  function setMeta(meta: { total_pages: number; total_items: number; current_page: number }) {
    totalPages.value = meta.total_pages
    totalItems.value = meta.total_items
    page.value = meta.current_page
  }

  function goTo(p: number) {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }

  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < totalPages.value)

  return { page, limit, totalPages, totalItems, hasPrev, hasNext, setMeta, goTo }
}
