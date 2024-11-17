/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#6366F1',
        dark: {
          100: '#1a1a1a',
          200: '#242424',
          300: '#2d2d2d',
        }
      },
      keyframes: {
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      }
    },
  },
  plugins: [],
}

