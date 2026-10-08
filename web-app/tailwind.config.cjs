/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.css'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lux: {
          bg: '#ede8e1',
          bgWarm: '#f8f5f0',
          card: 'rgba(255, 255, 255, 0.65)',
          amber: '#d97706',
          amberLight: '#f59e0b',
          goldBorder: 'rgba(217, 119, 6, 0.35)',
          dark: '#1c1917',
          muted: '#78716c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace']
      },
      boxShadow: {
        'glass-slab': '0 30px 60px -12px rgba(180, 140, 100, 0.28), 0 18px 36px -18px rgba(0, 0, 0, 0.1), inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -1.5px 2px rgba(217, 119, 6, 0.2)',
        'glass-float': '0 20px 40px -10px rgba(180, 140, 100, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
        'btn-gold': '0 10px 25px -5px rgba(217, 119, 6, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
      }
    }
  },
  plugins: []
};
