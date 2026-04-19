/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d9efff',
          500: '#0f5fa8',
          600: '#0b4f8d',
          700: '#093f70',
        },
        accent: '#0e8f72',
        ink: '#111827',
        muted: '#6b7280',
        surface: '#f8fafc',
      },
      boxShadow: {
        soft: '0 10px 35px rgba(15, 95, 168, 0.08)',
      },
    },
  },
  plugins: [],
};
