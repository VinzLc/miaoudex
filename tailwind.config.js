// eslint-disable-next-line no-undef
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.amber,
        secondary: colors.stone,
        accent: colors.red,
      },
      fontFamily: {
        'pokemon': ['Pokemon', 'sans-serif' ],
        'pixel': ['Pixel', 'sans-serif' ],
      },
      animation: {
        'blurIn': 'blurIn 0.7s ease 1.7s 1 forwards',
        'slideDown': 'slideDown 0.5s ease 0.7s 1 forwards'
      },
      keyframes: {
        blurIn: {
          '0%':  {  backdropFilter: 'blur(24px)', opacity: 1, },
          '100%':  { backdropFilter: 'blur(0)', opacity: 0, display: 'none', overflow: 'hidden', maxHeight: 0 },
        },
        slideDown: {
          '0%':  { transform: 'translate(0, -100%)', opacity: 0 },
          '100%':  { transform: 'translate(0, 0)', opacity: 100 },
        }
      },
    },
  },
  plugins: [],
}
