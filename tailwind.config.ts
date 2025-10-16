import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          muted: '#a5b4fc',
          surface: '#f8fafc'
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 25px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};

export default config;
