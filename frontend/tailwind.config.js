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
    },
  },
  plugins: [],
}

