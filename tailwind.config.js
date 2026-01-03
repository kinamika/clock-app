/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure this matches your folder names!
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};