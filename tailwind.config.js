/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
      colors: {
        bb: {
          green:  '#217D63',
          green2: '#1a6450',
          yellow: '#FEC71B',
          purple: '#9FA9FF',
          sky:    '#3FA9F5',
          bg:     '#F0F2F4',
          dark:   '#131113',
        },
      },
    },
  },
  plugins: [],
}
