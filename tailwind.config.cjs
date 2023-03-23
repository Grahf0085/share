/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      rubik: 'Rubik',
      inter: 'Inter',
      atkinson: 'Atkinson Hyperlegible',
      lexend: 'Lexend',
      merriweather: 'Merriweather',
      bookerly: 'Bookerly',
    },
    extend: {
      colors: {
        backgroundColor: 'var(--background-color)',
        menuColor: 'var(--menu-color)',
        textColor: 'var(--text-color)',
        subMenuColor: 'var(--sub-menu-color)',
        sliderColor: 'var(--slider-color)',
      },
      backgroundImage: {
        menuBackground: 'var(--menu-background)',
      },
    },
  },
  plugins: [],
}
