/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060d18',
          900: '#0a1628',
          800: '#12243d',
          700: '#1c3554',
        },
        parchment: {
          50: '#faf8f4',
          100: '#f4efe6',
          200: '#e8dfd0',
        },
        seal: {
          DEFAULT: '#c9a227',
          light: '#e4c76a',
          dark: '#9a7b1a',
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(10, 22, 40, 0.12), 0 0 0 1px rgba(10, 22, 40, 0.04)',
        glow: '0 0 40px -8px rgba(201, 162, 39, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
