/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shrimp-orange': '#FF6B35',
        'shrimp-pink': '#F7931E',
        'ocean-blue': '#1E88E5',
        'sea-green': '#4CAF50',
      },
      fontFamily: {
        'shrimp': ['Metal Mania', 'serif'],
      }
    },
  },
  plugins: [],
}
