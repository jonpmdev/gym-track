/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          dark: '#16a34a',
          light: '#86efac',
        },
        text: {
          dark: '#1a1a1a',
          muted: '#4a5568',
        },
        background: {
          light: '#f7fafc',
          dark: '#2c3e50',
        },
        border: '#e2e8f0',
        success: '#48bb78',
        error: '#ef4444',
        warning: '#ed8936',
      },
      fontFamily: {
        'teko': ['Teko', 'sans-serif'],
        'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'auth': '0 0 20px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

