/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: ["Quicksand", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
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
