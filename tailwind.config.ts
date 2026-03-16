import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Semantic text colors — driven by CSS variables, change with theme
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        // Surface colors — also CSS-variable driven
        surface: {
          DEFAULT: 'var(--color-surface)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          hover: 'var(--color-hover)',
        },
        // Accent colors stay fixed across themes
        accent: {
          DEFAULT: '#58a6ff',
          green: '#3fb950',
          purple: '#bc8cff',
          orange: '#d29922',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
