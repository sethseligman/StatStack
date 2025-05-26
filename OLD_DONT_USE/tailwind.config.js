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
        'chalk-green': '#3B7D2E',
        'stadium-gray': '#1F2937',
        'playoff-blue': '#1D4ED8',
        'neutral-white': '#F9F9F9',
        main: {
          DEFAULT: '#1a1a1a',
          dark: '#ffffff'
        },
        muted: {
          DEFAULT: '#666666',
          dark: '#a3a3a3'
        },
        default: {
          DEFAULT: '#ffffff',
          dark: '#1a1a1a'
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'info-pulse': {
          '0%, 33%, 66%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '16.5%, 49.5%, 82.5%': { transform: 'scale(1.15)', opacity: '1' }
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'info-pulse': 'info-pulse 4.5s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 