/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', '"Quicksand"', 'sans-serif'],
        sans: ['"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        saka: {
          navy: "#1B4965",
          yellow: "#F9D968",
          pink: "#F48B94",
          green: "#95D5B2",
          blue: "#8FB8ED",
          peach: "#F4978E",
          canvas: "#FFFDF9",
        },
      },
    },
  },
  plugins: [],
};
