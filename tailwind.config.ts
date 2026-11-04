import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        sheet: token('sheet'),
        raised: token('raised'),
        ink: token('ink'),
        graphite: token('graphite'),
        line: token('line'),
        pen: token('pen'),
        marker: token('marker'),
        margin: token('margin'),
        chalk: token('chalk'),
        chalkline: token('chalkline'),
        noir: '#0A0A0B',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        site: '1680px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
