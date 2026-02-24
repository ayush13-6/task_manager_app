/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        base:    '#0d0d14',
        surface: '#13131e',
        card:    '#1a1a28',
        border:  '#252538',
        accent:  '#6f4ef2',
        'accent-light': '#9b7ff7',
      },
      animation: {
        'fade-up': 'fadeUp 0.2s ease',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px) scale(0.97)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
      },
    },
  },
  plugins: [],
};
