/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B1E2D',
        'primary-dark': '#6B1622',
      }
    },
  },
  plugins: [],
}