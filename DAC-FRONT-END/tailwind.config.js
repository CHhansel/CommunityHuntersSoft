/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        'main-color': '#000000',
        'secondary-color':'#FFFFFF',
        'main-yellow':'#FBBC04',
        'main-blue': '#0066CC',
        'main-blue-hover': '#0046AC',
        'even-row-table': '#E8E8E8',
        'main-red': '#FF0000',
        'main-red-hover': '#DF0000',
        'input':'#FAFAFA'

      },
      fontFamily: {
        'sans': ['Montserrat', 'serif'],
        // otras fuentes aquí
      },
      borderRadius: {
        'main': '.4rem',
      }
    },
  },
  plugins: [],
}

