/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    divideWidths: {
      DEFAULT: "1px",
      "0": "0",
      "2": "2px",
      "4": "4px",
      "8": "8px",
    },
    extend: {},
  },
  plugins: [],
}