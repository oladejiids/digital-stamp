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
        'stamp-press': {
          '0%': {
            opacity: '0',
            filter: 'blur(4px)',
            transform: 'translateY(-40%) scale(1.5) rotate(-16deg)',
          },
          '30%': {
            opacity: '1',
            filter: 'blur(1px)',
            transform: 'translateY(-15%) scale(1.3) rotate(-10deg)',
          },
          '50%': {
            opacity: '1',
            filter: 'blur(0)',
            transform: 'translateY(0) scale(1.02) rotate(0deg)',
          },
          '58%': {
            transform: 'translateY(0) scale(1.08, 0.82) rotate(2deg)',
          },
          '72%': {
            transform: 'translateY(-3%) scale(1.03) rotate(-1deg)',
          },
          '100%': { transform: 'translateY(0) scale(1) rotate(0)' },
        },
        'ink-splat': {
          '0%': { opacity: '0', transform: 'scale(0.45)' },
          '35%': { opacity: '1', transform: 'scale(1.0)' },
          '100%': { opacity: '0', transform: 'scale(1.6)' },
        },
        'grid-shake': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(3px)' },
          '50%': { transform: 'translateY(-2px)' },
          '75%': { transform: 'translateY(1px)' },
        },
        'count-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
        },
      },
      animation: {
        'stamp-press':
          'stamp-press 720ms cubic-bezier(0.45, 0, 0.25, 1.2) both',
        'ink-splat':
          'ink-splat 720ms cubic-bezier(0.2, 0.6, 0.3, 1) forwards',
        'grid-shake': 'grid-shake 220ms ease-out',
        'count-pulse': 'count-pulse 360ms ease-out',
      },
    },
  },
  plugins: [],
}
