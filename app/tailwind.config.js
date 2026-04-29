/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f5efe2',
        ink: '#1a1a1a',
        stampRed: '#c0392b',
        stampBlue: '#2961ad',
      },
      fontFamily: {
        display: ['"Noto Serif JP"', 'serif'],
        body: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'stamp-in': {
          '0%': { transform: 'scale(1.6) rotate(-10deg)', opacity: '0' },
          '40%': { transform: 'scale(0.95) rotate(2deg)', opacity: '1' },
          '70%': { transform: 'scale(1.04) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
      },
      animation: {
        'stamp-in': 'stamp-in 600ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
      },
    },
  },
  plugins: [],
}
