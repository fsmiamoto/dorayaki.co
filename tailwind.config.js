/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-muted': 'var(--color-surface-muted)',
          'surface-elevated': 'var(--color-surface-elevated)',
          'surface-soft': 'var(--color-surface-soft)',
          border: 'var(--color-border)',
          'border-subtle': 'var(--color-border-subtle)',
          foreground: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          soft: 'var(--color-text-soft)',
          faint: 'var(--color-text-faint)',
          accent: 'var(--color-accent)',
          'accent-strong': 'var(--color-accent-strong)',
          amber: 'var(--color-amber)',
          success: 'var(--color-success)',
          info: 'var(--color-info)',
          danger: 'var(--color-danger)',
          shadow: 'var(--color-shadow)',
        },
        terminal: {
          bg: 'var(--color-bg)',
          text: 'var(--color-accent-strong)',
          prompt: 'var(--color-accent)',
          amber: 'var(--color-amber)',
          red: 'var(--color-danger)',
          blue: 'var(--color-info)',
          gray: 'var(--color-text-muted)',
          'gray-light': 'var(--color-text-soft)',
          'gray-lighter': 'var(--color-text-faint)',
          'green-muted': 'var(--color-accent)',
          cyan: 'var(--color-info)',
          'amber-muted': 'var(--color-amber)',
          white: 'var(--color-text)',
          'window-bg': 'var(--color-surface)',
          'window-border': 'var(--color-border)',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        blink: 'blink 1s infinite',
        typing: 'typing 3s steps(40, end)',
      },
      boxShadow: {
        pane: '0 36px 120px -60px var(--color-shadow)',
        'pane-soft': '0 20px 60px -40px var(--color-shadow)',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
