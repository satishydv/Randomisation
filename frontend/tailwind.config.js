/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg-dark': '#222733',
        'game-bg-light': '#2a303d',
        'game-green': '#00c781',
        'game-red': '#f94c5b',
        'game-violet': '#b95fff',
        'game-gray': '#8a93a7',
        'game-yellow': '#ffd700',
      }
    },
  },
  plugins: [],
}