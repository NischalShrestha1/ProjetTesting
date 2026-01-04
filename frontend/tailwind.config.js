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
        logoA: '#FF2D78', // Logo 'A' color (primary)
        logoM: '#1F2937', // Logo 'M' color (dark)
        logoText: '#1F2937', // Logo text color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        anime: ['"Exo 2"', 'sans-serif'], // Anime-style font
      },
    },
  },
  plugins: [],
}