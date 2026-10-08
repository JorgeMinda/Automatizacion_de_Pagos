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
        cyber: {
          bg: '#05030a',
          surface: '#0a0512',
          panel: 'rgba(15, 8, 26, 0.7)',
          border: 'rgba(255, 255, 255, 0.08)',
          purple: '#9d4edd',
          purpleGlow: 'rgba(157, 78, 221, 0.35)',
          pink: '#f72585',
          pinkGlow: 'rgba(247, 37, 133, 0.35)',
          cyan: '#4cc9f0',
          emerald: '#10b981',
          rose: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace']
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        xl: '16px',
        '2xl': '24px'
      },
      boxShadow: {
        'neon-purple': '0 0 25px -5px rgba(157, 78, 221, 0.4)',
        'neon-pink': '0 0 25px -5px rgba(247, 37, 133, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    }
  },
  plugins: []
};
