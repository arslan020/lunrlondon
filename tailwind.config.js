/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FCE488',
          'primary-contrast': '#0F0F0F',
          secondary: '#E1BE66',
          'secondary-contrast': '#0F0F0F',
          dark: '#0F0F0F',
          navy: '#0C2479',
        },
        neutral: {
          50: '#FFFFFF',
          100: '#F9F8F8',
          200: '#E0DEDF',
          300: '#C7C4C5',
          400: '#AFA9A9',
          500: '#96918F',
          600: '#7D7975',
          700: '#605F5A',
          800: '#43443F',
          900: '#262724',
          950: '#131312',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
}
