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
          bg: '#08050e',
          surface: 'rgba(18, 10, 30, 0.45)',
          amber: '#f59e0b',
          amberGlow: 'rgba(245, 158, 11, 0.4)',
          orange: '#ff6b35',
          purple: '#9d4edd',
          pink: '#f72585',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace']
      },
      boxShadow: {
        'glass-luxury': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        'glass-layer': '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 2px 2px rgba(255, 255, 255, 0.35)',
        'btn-amber': '0 10px 25px -5px rgba(245, 158, 11, 0.5)',
        'btn-purple': '0 10px 25px -5px rgba(157, 78, 221, 0.5)'
      }
    }
  },
  plugins: []
};
