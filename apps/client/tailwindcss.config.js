// packages/config/tailwind.config.js
module.exports = {
  content: [
    "./apps/client/src/**/*.{js,ts,jsx,tsx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',   // Light mint
          600: '#059669',  // Deep Islamic Emerald Green
          700: '#047857',  // Primary Header Green
          900: '#064e3b',  // Rich Dark Forest Green
        },
        gold: {
          500: '#f59e0b',  // Golden Honey Accent
          600: '#d97706',  // Warm Amber
        }
      },
    },
  },
  plugins: [],
}