<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* ── Theme variables ───────────────────────────────────────────────────── */
:root,
[data-theme="dark"] {
  --text-primary:   #e6edf3;
  --text-secondary: #8b949e;
  --text-muted:     #6e7681;
  --color-surface:  #0f1117;
  --color-card:     #161b22;
  --color-border:   #21262d;
  --color-hover:    #1c2128;

  /* Syntax highlighting — dark (GitHub Dark) */
  --hljs-bg:      #0d1117;
  --hljs-fg:      #c9d1d9;
  --hljs-keyword: #ff7b72;
  --hljs-title:   #d2a8ff;
  --hljs-attr:    #79c0ff;
  --hljs-string:  #a5d6ff;
  --hljs-builtin: #ffa657;
  --hljs-comment: #8b949e;
  --hljs-tag:     #7ee787;
  --hljs-bullet:  #f2cc60;
  --hljs-border:  #30363d;
}

[data-theme="light"] {
  --text-primary:   #1f2328;
  --text-secondary: #57606a;
  --text-muted:     #818c99;
  --color-surface:  #f6f8fa;
  --color-card:     #ffffff;
  --color-border:   #d0d7de;
  --color-hover:    #eaeef2;

  /* Syntax highlighting — light (GitHub Light) */
  --hljs-bg:      #f6f8fa;
  --hljs-fg:      #24292e;
  --hljs-keyword: #d73a49;
  --hljs-title:   #6f42c1;
  --hljs-attr:    #005cc5;
  --hljs-string:  #032f62;
  --hljs-builtin: #e36209;
  --hljs-comment: #6a737d;
  --hljs-tag:     #22863a;
  --hljs-bullet:  #735c0f;
  --hljs-border:  #d0d7de;
}

html { scroll-behavior: smooth; }
body { background: var(--color-surface); transition: background 0.2s; }

/* ── Page transitions ──────────────────────────────────────────────────── */
.page-enter-active, .page-leave-active { transition: all 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }

/* ── Global utilities ──────────────────────────────────────────────────── */
.btn-primary {
  @apply px-4 py-2 bg-accent font-semibold rounded-lg hover:bg-accent/90 transition-colors;
  color: #ffffff;
}
.btn-ghost { @apply px-3 py-1.5 rounded-lg transition-colors; color: var(--text-secondary); }
.btn-ghost:hover { background: var(--color-hover); color: var(--text-primary); }
.nav-link { @apply px-3 py-1.5 rounded-lg text-sm transition-colors; color: var(--text-secondary); }
.nav-link:hover { background: var(--color-hover); color: var(--text-primary); }
.input {
  @apply w-full bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent/60 transition-colors text-sm;
  color: var(--text-primary);
}
.input::placeholder { color: var(--text-muted); }
.label { @apply block text-sm font-medium mb-1.5; color: var(--text-secondary); }

/* ── Highlight.js via CSS custom properties ────────────────────────────── */
pre code.hljs {
  display: block; overflow-x: auto; padding: 1.2em;
  background: var(--hljs-bg);
  color: var(--hljs-fg);
  border-radius: 0;
  font-size: 0.8em;
  line-height: 1.6;
}
.hljs-doctag, .hljs-keyword, .hljs-template-tag,
.hljs-template-variable, .hljs-type, .hljs-variable.language_ { color: var(--hljs-keyword); }
.hljs-title, .hljs-title.class_, .hljs-title.class_.inherited__,
.hljs-title.function_ { color: var(--hljs-title); }
.hljs-attr, .hljs-attribute, .hljs-literal, .hljs-meta,
.hljs-number, .hljs-operator, .hljs-variable,
.hljs-selector-attr, .hljs-selector-class,
.hljs-selector-id { color: var(--hljs-attr); }
.hljs-regexp, .hljs-string, .hljs-meta .hljs-string { color: var(--hljs-string); }
.hljs-built_in, .hljs-symbol { color: var(--hljs-builtin); }
.hljs-comment, .hljs-code, .hljs-formula { color: var(--hljs-comment); font-style: italic; }
.hljs-name, .hljs-quote, .hljs-selector-tag,
.hljs-selector-pseudo { color: var(--hljs-tag); }
.hljs-bullet { color: var(--hljs-bullet); }
.hljs-emphasis { font-style: italic; }
.hljs-strong   { font-weight: bold; }
.hljs-subst    { color: var(--hljs-fg); }
.hljs-section  { color: var(--hljs-attr); font-weight: bold; }
.hljs-addition { color: var(--hljs-tag); background: color-mix(in srgb, var(--hljs-tag) 15%, transparent); }
.hljs-deletion { color: var(--hljs-keyword); background: color-mix(in srgb, var(--hljs-keyword) 15%, transparent); }
</style>
