/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'main-color': '#000000',
        'secondary-color':'#FFFFFF',
        'main-yellow':'#FBBC04'
      },
      fontFamily: {
        'sans': ['Bodoni Moda', 'serif'],
        // otras fuentes aquí
      },
    },
  },
  plugins: [],
}

