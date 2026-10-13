/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#EAF3DE',
          100: '#C0DD97',
          400: '#639922',
          600: '#3B6D11',
          800: '#27500A',
          900: '#173404',
        },
        gold: {
          300: '#E3CFA0',
          400: '#C9A96D',
          500: '#B8975A',
          700: '#8A6F3C',
        },
        amber: {
          50:  '#FAEEDA',
          200: '#F0C87A',
          600: '#854F0B',
          800: '#633806',
        },
        teal: {
          50:  '#E1F5EE',
          600: '#0F6E56',
          800: '#085041',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 0.25s ease',
        'fade-in':    'fadeIn 0.4s ease',
      },
      keyframes: {
        slideDown: {
          '0%':   { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
