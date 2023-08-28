/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'main-color': '#000000',
        'secondary-color':'#FFFFFF',
        'main-yellow':'#FBBC04',
        'main-blue': '#0066CC',
        'even-row-table': '#E8E8E8',
        'main-red': '#FF0000',
        'input':'#FAFAFA'

      },
      fontFamily: {
        'sans': ['Montserrat', 'serif'],
        // otras fuentes aquí
      },
    },
  },
  plugins: [],
}

