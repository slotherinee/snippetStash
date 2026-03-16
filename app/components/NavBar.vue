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
          <!-- User dropdown trigger (desktop only) -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="hidden sm:flex items-center gap-2 px-1.5 py-1 rounded-lg transition-colors hover:bg-surface-hover"
            >
              <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
                <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold">
                  {{ (user?.name ?? 'U').charAt(0).toUpperCase() }}
                </div>
              </div>
              <span
                class="hidden sm:block text-sm font-mono font-semibold"
                :style="isAdmin
                  ? 'background: linear-gradient(90deg, #bc8cff, #79c0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text'
                  : 'color: var(--text-muted)'"
              >{{ user?.name }}</span>
              <svg
                class="hidden sm:block w-3.5 h-3.5 transition-transform duration-150"
                :class="dropdownOpen ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
                style="color: var(--text-muted)"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-full mt-1.5 w-48 rounded-xl border shadow-lg overflow-hidden z-50"
                style="background: var(--color-card); border-color: var(--color-border)"
              >
                <NuxtLink
                  :to="`/users/${user?.id}`"
                  class="dropdown-item"
                  @click="dropdownOpen = false"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                  My Profile
                </NuxtLink>
                <NuxtLink
                  to="/settings"
                  class="dropdown-item"
                  @click="dropdownOpen = false"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Settings
                </NuxtLink>
                <div class="border-t mx-3 my-1" style="border-color: var(--color-border)" />
                <button
                  @click="() => { logout(); dropdownOpen = false }"
                  class="dropdown-item w-full text-left text-red-400 hover:text-red-400"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
                  </svg>
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="hidden sm:block btn-ghost text-sm">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary text-sm">Register</NuxtLink>
        </template>

        <!-- Avatar (mobile only, no dropdown — use burger menu) -->
        <div v-if="isLoggedIn" class="sm:hidden w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
          <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold">
            {{ (user?.name ?? 'U').charAt(0).toUpperCase() }}
          </div>
        </div>

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
        <NuxtLink v-if="isLoggedIn" to="/create"    class="mobile-nav-link" @click="menuOpen = false">+ New</NuxtLink>
        <div class="border-t border-surface-border my-1" />
        <template v-if="isLoggedIn">
          <NuxtLink :to="`/users/${user?.id}`" class="mobile-nav-link" @click="menuOpen = false">My Profile</NuxtLink>
          <NuxtLink to="/settings" class="mobile-nav-link" @click="menuOpen = false">Settings</NuxtLink>
          <button @click="() => { logout(); menuOpen = false }" class="mobile-nav-link text-left text-red-400">Logout</button>
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

const menuOpen    = ref(false)
const dropdownOpen = ref(false)
const dropdownRef  = ref<HTMLElement | null>(null)
const route = useRoute()

watch(route, () => { menuOpen.value = false; dropdownOpen.value = false })

// Close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  })
})
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
.dropdown-item {
  @apply flex items-center gap-2.5 px-3 py-2 text-sm transition-colors w-full;
  color: var(--text-secondary);
}
.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--text-primary);
}
.mobile-menu-enter-active,
.mobile-menu-leave-active { transition: all 0.18s ease; }
.mobile-menu-enter-from,
.mobile-menu-leave-to { opacity: 0; transform: translateY(-6px); }

.dropdown-enter-active,
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>
