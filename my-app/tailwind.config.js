/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cherry Cream Soda", "sans-serif"],
        mono: ["Poppins", 'SFMono-Regular'],
        padding: {
          '1/2': '50%',
          full: '100%',
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};