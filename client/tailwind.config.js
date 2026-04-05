/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Quicksand", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#ffffff",
          black: "#000000",
          soft: "#faefec",
          grey: "#F8F8F8",
          red: "#ff0000",
          dark: "#333333",
        },
      },
    },
  },
  plugins: [],
};
