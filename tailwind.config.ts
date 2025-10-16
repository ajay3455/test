import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f3b5b',
          light: '#305a87',
          muted: '#9fb6d1',
          surface: '#f1f5f9'
        },
        success: '#16a34a',
        warning: '#eab308',
        danger: '#dc2626'
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
