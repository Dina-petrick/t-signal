/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'rsp-',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Mukta', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5bbff',
          400: '#8195ff',
          500: '#0043ff',
          600: '#0038e6',
          700: '#002dcc',
          800: '#0022b3',
          900: '#001799',
        },
      },
      keyframes: {
        'modal-appear': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'modal-appear': 'modal-appear 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      wordBreak: {
        'break-all': 'break-all',
      },
    },
  },
  plugins: [],
};