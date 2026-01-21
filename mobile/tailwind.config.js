/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: "#0277BD",
        app: {
          bg: "#E1F5FE",
          text: "#01579B",
          border: "#B3E5FC",
          muted: "#4FC3F7",
          card: "#FFFFFF",
        },
        danger: "#EF5350",
        success: "#26A69A",
      },
    },
  },
  plugins: [],
};
