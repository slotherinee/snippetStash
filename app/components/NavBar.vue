<template>
  <nav class="sticky top-0 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-mono font-bold text-lg hover:text-accent transition-colors flex-shrink-0"
        style="color: var(--text-primary)"
      >
        <span class="text-accent">&lt;/&gt;</span>
        <span class="hidden xs:inline">SnippetStash</span>
      </NuxtLink>

      <!-- Desktop nav links -->
      <div class="hidden sm:flex items-center gap-1 flex-1">
        <NuxtLink to="/posts" class="nav-link">Browse</NuxtLink>
        <NuxtLink to="/trending" class="nav-link">Trending</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/bookmarks" class="nav-link">Bookmarks</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/create" class="nav-link">+ New</NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-1.5">
        <!-- Theme toggle -->
        <button
          @click="toggle"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-surface-hover"
          :title="isDark ? 'Switch to light' : 'Switch to dark'"
        >
          <span class="text-base leading-none">{{ isDark ? '☀️' : '🌙' }}</span>
        </button>

        <template v-if="isLoggedIn">
          <NuxtLink to="/settings" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
              <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold">
                {{ (user?.name ?? 'U').charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="hidden sm:block text-sm font-mono" style="color: var(--text-muted)">{{ user?.name }}</span>
          </NuxtLink>
          <span v-if="isAdmin" class="hidden sm:block text-xs px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30">admin</span>
          <button @click="logout" class="hidden sm:block btn-ghost text-sm">Logout</button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="hidden sm:block btn-ghost text-sm">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary text-sm">Register</NuxtLink>
        </template>

        <!-- Hamburger (mobile only) -->
        <button
          @click="menuOpen = !menuOpen"
          class="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-surface-hover ml-1"
          style="color: var(--text-secondary)"
          aria-label="Menu"
        >
          <svg v-if="!menuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="sm:hidden border-t border-surface-border bg-surface/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1"
      >
        <NuxtLink to="/posts"    class="mobile-nav-link" @click="menuOpen = false">Browse</NuxtLink>
        <NuxtLink to="/trending" class="mobile-nav-link" @click="menuOpen = false">Trending</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/bookmarks" class="mobile-nav-link" @click="menuOpen = false">Bookmarks</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/create"    class="mobile-nav-link" @click="menuOpen = false">+ New Snippet</NuxtLink>
        <div class="border-t border-surface-border my-1" />
        <template v-if="isLoggedIn">
          <NuxtLink to="/settings" class="mobile-nav-link" @click="menuOpen = false">Settings</NuxtLink>
          <button @click="() => { logout(); menuOpen = false }" class="mobile-nav-link text-left">Logout</button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login"    class="mobile-nav-link" @click="menuOpen = false">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="mobile-nav-link" @click="menuOpen = false">Register</NuxtLink>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const { user, isLoggedIn, isAdmin, logout } = useAuth()
const { isDark, toggle } = useTheme()
const menuOpen = ref(false)
const route = useRoute()
watch(route, () => { menuOpen.value = false })
</script>

<style scoped>
.mobile-nav-link {
  @apply px-3 py-2.5 rounded-lg text-sm transition-colors w-full block;
  color: var(--text-secondary);
}
.mobile-nav-link:hover {
  background: var(--color-hover);
  color: var(--text-primary);
}
.mobile-menu-enter-active,
.mobile-menu-leave-active { transition: all 0.18s ease; }
.mobile-menu-enter-from,
.mobile-menu-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
