/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf8eb',
          100: '#f5eccd',
          200: '#ebd89f',
          300: '#e0c06b',
          400: '#d6a942',
          500: '#c48e2f',
          600: '#a66e24',
          700: '#855220',
          800: '#6d4220',
          900: '#5a371e',
        },
        papyrus: '#f4e4bc',
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
