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
        // Deep Luxury Black/Dark Palette
        luxury: {
          900: '#050505', // Ultra Dark
          800: '#0A0A0C', // Rich Black
          700: '#121214', // Soft Black
          card: '#0f0f11aa', // Glass Card
        },
        // Crema / Off-White for text
        crema: {
          50: '#F9F9F7',
          100: '#F5F5F0',
          200: '#EBEBE0',
          300: '#DEDECF',
          400: '#C7C7B0',
          500: '#AFA990',
        },
        // Accents
        royal: {
          400: '#7C3AED', // Vivid Purple
          500: '#6D28D9', // Deep Purple
          900: '#4C1D95', // Royal Purple
        },
      },
      fontFamily: {
        serif: ['"Crimson Pro"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'], // For headers
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
