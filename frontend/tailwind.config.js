/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Gold Palette
        gold: {
          50: '#FDFCF5',
          100: '#FBF8EB',
          200: '#F5ECC8',
          300: '#EBD89F',
          400: '#D6A942',
          500: '#C48E2F', // Primary Gold
          600: '#A66E24',
          700: '#855220',
          800: '#6D4220',
          900: '#5A371E',
          950: '#38220F',
        },
        // Frontend Overhaul New Colors
        ivory: {
          50: '#FFFFF5',
          100: '#FFFFF0', // Base Background
          200: '#FAF9E6',
          300: '#EBE9D0',
          400: '#DBD8B6',
          500: '#CCC9A0',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53', // Secondary Calm Navy
          900: '#102A43',
        },
        charcoal: {
          50: '#F5F7FA',
          100: '#E4E7EB',
          200: '#CBD2D9',
          300: '#9AA5B1',
          400: '#7B8794',
          500: '#616E7C',
          600: '#52606D',
          700: '#3E4C59',
          800: '#323F4B',
          900: '#1F2933', // Deep Charcoal Text
          950: '#0F151A',
        },
        // Legacy Support
        luxury: {
          900: '#1F2933', // Mapped to Charcoal for light mode compatibility
          800: '#323F4B',
          700: '#3E4C59',
          card: 'rgba(255, 255, 240, 0.8)', // Glass Card Light
        },
        crema: {
          50: '#1F2933', // Inverted for light mode (Text color usually)
          100: '#323F4B',
          200: '#3E4C59',
          300: '#52606D',
          400: '#616E7C',
          500: '#7B8794',
        },
      },
      fontFamily: {
        serif: ['"Merriweather"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'], // For headers
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-mesh': 'radial-gradient(at 0% 0%, rgba(255, 215, 0, 0.03) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(107, 144, 128, 0.05) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
