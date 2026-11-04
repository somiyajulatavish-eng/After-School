import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F4EE',
        sheet: '#E8EAE2',
        ink: '#131C5E',
        pen: '#2A3FE0',
        marker: '#E9F05A',
        chalk: '#1E3B30',
        chalkline: '#D9E3DC',
        margin: '#E2412E',
        graphite: '#5A6070',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        site: '1600px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
