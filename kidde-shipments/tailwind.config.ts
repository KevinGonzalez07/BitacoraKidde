import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kidde: {
          red: '#C8102E',
          'red-dark': '#9B0C22',
          'red-light': '#E8314F',
          black: '#1A1A1A',
          gray: '#F5F5F5',
          'gray-mid': '#E0E0E0',
          'gray-dark': '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'kidde': '0 4px 24px rgba(200,16,46,0.12)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
