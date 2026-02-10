/** @type {import('tailwindcss').Config} */
const { COLORS } = require("./constants/colors.js");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: COLORS.primary,
        app: {
          bg: COLORS.background,
          text: COLORS.text,
          border: COLORS.border,
          muted: COLORS.textLight,
          card: COLORS.card,
        },
        danger: COLORS.expense,
        success: COLORS.income,
      },
    },
  },
  plugins: [],
};
