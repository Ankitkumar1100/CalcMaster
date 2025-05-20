/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flipY: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'flip-y': 'flipY 1.5s ease-in-out',
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [],
};