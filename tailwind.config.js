/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0D1164',
        'card-main': '#EF5170',
        'accent': '#B13BFF',
        'soft-pink': '#FFD8DF',
        'light-bg': '#EEE9F2',
        'neutral-gray': '#D9D9D9',
        'highlight': '#FFA1B3',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
