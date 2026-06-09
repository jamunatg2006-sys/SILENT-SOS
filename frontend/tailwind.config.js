/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#0EA5E9', light: '#38BDF8', dark: '#0369A1' },
        mint: { DEFAULT: '#10B981', light: '#34D399', dark: '#059669' },
        coral: { DEFAULT: '#F43F5E', light: '#FB7185', dark: '#BE123C' },
        cream: '#F8F6F0',
        slate: { soft: '#F1F5F9', mid: '#94A3B8', deep: '#1E293B' }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    }
  },
  plugins: []
}