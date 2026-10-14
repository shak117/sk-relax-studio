/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F5F2',
          100: '#DCE6E0',
          200: '#B8CDBF',
          300: '#8FB09A',
          400: '#5F8E6E',
          500: '#3D6D4D',
          600: '#2C533A',
          700: '#20412D',
          800: '#173222',
          900: '#0F2318',
          950: '#08140D',
          DEFAULT: '#173222',
          dark: '#0E2116',
          light: '#2A563C'
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FCFAF7',
          200: '#F9F5EF',
          300: '#F4ECE2',
          400: '#EEE1D2',
          500: '#E5D3BF',
          DEFAULT: '#FAF7F2'
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5EFE8',
          200: '#EDE3D6',
          300: '#E4D5C2',
          DEFAULT: '#F5EFE8'
        },
        rose: {
          50: '#FDF7F7',
          100: '#F8EBEB',
          200: '#F0D4D4',
          300: '#E3B5B5',
          400: '#D49292',
          500: '#C07474',
          600: '#A95858',
          700: '#8B4343',
          DEFAULT: '#C07474',
          light: '#F8EBEB',
          muted: '#B66E6E'
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F4E7CB',
          300: '#EBD6A7',
          400: '#DEC07E',
          500: '#CAA454',
          600: '#AF883A',
          700: '#8B6A2A',
          DEFAULT: '#CAA454',
          champagne: '#D4B36A',
          light: '#FAF4E8'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        cursive: ['"Caveat"', 'cursive']
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(23, 50, 34, 0.06)',
        'card': '0 10px 30px -10px rgba(23, 50, 34, 0.08)',
        'elevated': '0 20px 40px -15px rgba(23, 50, 34, 0.12)',
        'luxury': '0 25px 50px -12px rgba(15, 35, 24, 0.25)',
      },
      letterSpacing: {
        'widest-xl': '0.25em',
        'widest-2xl': '0.35em',
      }
    },
  },
  plugins: [],
}
