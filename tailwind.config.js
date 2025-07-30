/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // pastikan semua file yang menggunakan tailwind terdaftar di sini
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // plugin lainnya kalau ada
  ],
}
