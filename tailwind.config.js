/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0f7f2',
          100: '#dcefe0',
          200: '#b9dfc1',
          300: '#8fcba0',
          400: '#65b77f',
          500: '#4a9c64',
          600: '#3b8051',
          700: '#2d643f',
          800: '#1f482d',
          900: '#1a4d2e',
          950: '#0a1a10',
        },
      },
    },
  },
  plugins: [],
}