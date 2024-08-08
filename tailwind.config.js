/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans'],
        roboto: ['Roboto', 'sans']
      },
      boxShadow: {
        'custom-dark': '0 1px 3px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}

