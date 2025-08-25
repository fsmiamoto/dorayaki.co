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
        terminal: {
          bg: '#0a0a0a',
          text: '#39ff14',
          prompt: '#00ff41',
          amber: '#ffa500',
          red: '#ff4444',
          blue: '#4499ff',
          gray: '#666666',
          'gray-light': '#999999',
          'gray-lighter': '#aaaaaa',
          'green-muted': '#66cc66',
          'cyan': '#66cccc',
          'amber-muted': '#cc9900',
          'white': '#ffffff',
          'window-bg': '#1a1a1a',
          'window-border': '#333333',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        blink: 'blink 1s infinite',
        typing: 'typing 3s steps(40, end)',
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