/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF2D78', // Anime pink color
        secondary: '#3B82F6', // Blue accent
        dark: '#1F2937', // Dark background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        anime: ['"Exo 2"', 'sans-serif'], // Anime-style font
      },
    },
  },
  plugins: [],
}