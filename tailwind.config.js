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
    },
    fontFamily: {
      'pokemon': ['Pokemon' ],
    },
  },
  plugins: [],
}
