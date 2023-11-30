/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        'scale-pulse': 'scalePulse 1s infinite ease-in-out',
      },
    },
    keyframes: {
      scalePulse: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.5)' },
      },
    },
  },
  plugins: [],
}
