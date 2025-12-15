/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add extra paths here
  ],
  theme: {
    extend: {
      fontFamily: {
        'exo2': ['Exo 2', 'sans-serif'],
        'exo2-bold': ['Exo 2 Bold', 'sans-serif'],
        'exo2-thin': ['Exo 2 Thin', 'sans-serif'],
      },
      colors: {
        'white': '#FDFBF9', 
        'dark-blue': '#0A2541',
        'logo-orange': '#EA5247',
        'grey': '#CED3DC',
        'light-blue': '#4E8098',
        'btn-blue': '#007EA7',
        'place-light-blue': '#EFF8FF',
      },
    },
  },
  plugins: [require('daisyui')],
}
