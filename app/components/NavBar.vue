<template>
  <nav class="sticky top-0 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-mono font-bold text-lg hover:text-accent transition-colors"
        style="color: var(--text-primary)"
      >
        <span class="text-accent">&lt;/&gt;</span>
        SnippetStash
      </NuxtLink>

      <!-- Nav links -->
      <div class="hidden sm:flex items-center gap-1">
        <NuxtLink to="/posts" class="nav-link">Browse</NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/create" class="nav-link">+ New Post</NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Theme toggle -->
        <button
          @click="toggle"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-surface-hover"
          :title="isDark ? 'Switch to light' : 'Switch to dark'"
        >
          <span class="text-base leading-none">{{ isDark ? '☀️' : '🌙' }}</span>
        </button>

        <template v-if="isLoggedIn">
          <!-- Avatar + name -->
          <NuxtLink to="/settings" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-surface-border">
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white text-xs font-bold"
              >{{ (user?.name ?? 'U').charAt(0).toUpperCase() }}</div>
            </div>
            <span class="hidden sm:block text-sm font-mono" style="color: var(--text-muted)">{{ user?.name }}</span>
          </NuxtLink>

          <span v-if="isAdmin" class="hidden sm:block text-xs px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30">admin</span>
          <button @click="logout" class="btn-ghost text-sm">Logout</button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="btn-ghost text-sm">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary text-sm">Register</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, isLoggedIn, isAdmin, logout } = useAuth()
const { isDark, toggle } = useTheme()
</script>
