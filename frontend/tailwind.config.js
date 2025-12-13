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
        // Premium Light/Cream Palette
        crema: {
          50: '#F9F9F7',
          100: '#F5F5F0',
          200: '#EBEBE0',
          300: '#DEDECF',
          400: '#C7C7B0',
          500: '#AFA990',
        },
        // Sophisticated Slate/Dark Palette
        slate: {
          800: '#1A1C23',
          850: '#14161B',
          900: '#0F1115',
          950: '#08090B',
        },
        // Accents
        royal: {
          400: '#60A5FA', // Soft Blue
          500: '#3B82F6',
          900: '#1E3A8A',
        },
        sage: {
          400: '#A4C3B2',
          500: '#6B9080',
        }
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
