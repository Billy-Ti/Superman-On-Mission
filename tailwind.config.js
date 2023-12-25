/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      animation: {
      'slide-in-3d': 'slideIn3D 2s ease-out',
    },
    },
    keyframes: {
      scalePulse: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.5)' },
      },
      slideIn3D: {
        '0%': {
          transform: 'translateX(100%) rotateY(-90deg) scale(1)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateX(0) rotateY(0deg) scale(1.5)',
          opacity: 1,
        },
      },
      spin: {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },
      fontFamily: {
        custom: [
          '"Segoe UI"',
          '"Noto Sans TC"',
          '"Roboto"',
          '"Helvetica Neue"',
          'Arial',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
