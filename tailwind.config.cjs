/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.ts'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        cyan: 'hsl(180, 66%, 49%)',
        'dark-violet': 'hsl(257, 27%, 26%)',
        red: 'hsl(0, 87%, 67%)',
        gray: 'hsl(0, 0%, 75%)',
        'grayish-violet': 'hsl(257, 7%, 63%)',
        'very-dark-blue': 'hsl(255, 11%, 22%)',
        'very-dark-violet': 'hsl(260, 8%, 14%)',
      },
      backgroundImage: {
        'shorten-pattern-desktop': "url('../images/bg-shorten-desktop.svg')",
        'shorten-pattern-mobile': "url('../images/bg-shorten-mobile.svg')",
        'boost-pattern-desktop': "url('../images/bg-boost-desktop.svg')",
        'boost-pattern-mobile': "url('../images/bg-boost-mobile.svg')",
      },
    },
  },
  plugins: [],
};
