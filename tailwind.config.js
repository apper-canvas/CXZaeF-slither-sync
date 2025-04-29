/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          dark: 'rgb(var(--color-primary-dark))',
        },
        secondary: 'rgb(var(--color-secondary))',
        accent: 'rgb(var(--color-accent))',
        surface: {
          50: 'rgb(var(--color-surface-50))',
          100: 'rgb(var(--color-surface-100))',
          200: 'rgb(var(--color-surface-200))',
          300: 'rgb(var(--color-surface-300))',
          400: 'rgb(var(--color-surface-400))',
          500: 'rgb(var(--color-surface-500))',
          600: 'rgb(var(--color-surface-600))',
          700: 'rgb(var(--color-surface-700))',
          750: 'rgb(var(--color-surface-750))',
          800: 'rgb(var(--color-surface-800))',
          900: 'rgb(var(--color-surface-900))',
        },
      },
    },
  },
  plugins: [],
}