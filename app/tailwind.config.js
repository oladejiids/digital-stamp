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
            filter: 'blur(3px)',
            transform: 'translateY(-38%) scale(1.45) rotate(-14deg)',
            animationTimingFunction: 'cubic-bezier(0.22, 0.6, 0.4, 0.95)',
          },
          '25%': {
            opacity: '1',
            filter: 'blur(1.5px)',
            transform: 'translateY(-18%) scale(1.25) rotate(-8deg)',
            animationTimingFunction: 'cubic-bezier(0.4, 0.1, 0.5, 1)',
          },
          '50%': {
            filter: 'blur(0)',
            transform: 'translateY(-2%) scale(1.06) rotate(-1deg)',
            animationTimingFunction: 'cubic-bezier(0.55, 0, 0.7, 1)',
          },
          '60%': {
            transform: 'translateY(0) scale(1.10, 0.82) rotate(2deg)',
            animationTimingFunction: 'cubic-bezier(0.2, 0.4, 0.4, 1.6)',
          },
          '78%': {
            transform: 'translateY(-2%) scale(1.03) rotate(-1deg)',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.4, 1)',
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
        'stamp-press': 'stamp-press 640ms linear both',
        'ink-splat':
          'ink-splat 720ms cubic-bezier(0.2, 0.6, 0.3, 1) forwards',
        'grid-shake': 'grid-shake 220ms ease-out',
        'count-pulse': 'count-pulse 360ms ease-out',
      },
    },
  },
  plugins: [],
}
