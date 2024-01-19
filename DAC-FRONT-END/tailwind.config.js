/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        'main-color': '#e8e8e8',
        'secondary-color':'#202124',
        'main-yellow':'#78222d',
        'main-blue': '#7d84b2',
        'main-blue-hover': '#0046AC',
        'even-row-table': '#E8E8E8',
        'main-red': '#78222d',
        'main-red-hover': '#DF0000',
        'input':'#FAFAFA',
        'main-bg-plate':'#e7e9f6',
        'color-disabled':'#f5f5f5',

      },
      fontFamily: {
        'sans': ['Montserrat', 'serif'],
        // otras fuentes aquí
      },
      borderRadius: {
        'main': '1rem',
      }
    },
  },
  plugins: [],
}

