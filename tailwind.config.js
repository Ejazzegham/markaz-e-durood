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
        // Primary brand green — used for nav, footer, hero backgrounds
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
          // Non-standard extra stops below preserve exact shades that were
          // previously scattered through the codebase as raw hex, so they
          // can now be reached as named classes (e.g. bg-green-850).
          825: '#1a3d2a',
          850: '#112c1b',
          875: '#0b3a2d',
          900: '#1a4d2e',
          950: '#0a1a10',
        },
        // Brand gold accent. gold-500 is the canonical brand gold that was
        // previously hardcoded as #D4AF37 throughout the site.
        gold: {
          50: '#fbf7e9',
          100: '#f3e8c0',
          200: '#e8d592',
          300: '#dfc468',
          400: '#dab53e',
          500: '#D4AF37', // canonical brand gold
          600: '#c79f22', // hover / darker gold
          700: '#a67f1a',
          800: '#7a5f14',
          900: '#4f3d0e',
        },
        ink: {
          950: '#02070d',
          900: '#071018',
          800: '#090d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.2), 0 8px 24px -8px rgba(212,175,55,0.25)',
      },
    },
  },
  plugins: [],
}
