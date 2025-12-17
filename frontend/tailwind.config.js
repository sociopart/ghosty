/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'exo2': ['Exo 2', 'sans-serif'],
        'exo2-bold': ['Exo 2 Bold', 'sans-serif'],
        'exo2-thin': ['Exo 2 Thin', 'sans-serif'],
      },
      animation: {
        'fade-slide': 'fadeSlide 0.6s ease-out forwards',
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        ghosty: {
          "primary": "#EA5247",
          "secondary": "#007EA7",
          "accent": "#4E8098",
          "neutral": "#0A2541",
          "base-100": "#FDFBF9",
          "base-200": "#EFF8FF",
          "base-300": "#CED3DC",
          "info": "#4E8098",
          "success": "#28a745",
          "warning": "#ffc107",
          "error": "#dc3545",
        },
      },
      {
        ghostyDark: {
          "primary": "#EA5247",
          "secondary": "#007EA7",
          "accent": "#4E8098",
          "neutral": "#CED3DC",
          "base-100": "#0A2541",
          "base-200": "#0D2E4A",
          "base-300": "#4E8098",
          "info": "#4E8098",
          "success": "#28a745",
          "warning": "#ffc107",
          "error": "#dc3545",
        },
      },
    ],
    darkTheme: "ghostyDark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
  plugins: [require('daisyui')],
};