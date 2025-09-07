/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#7CB342',
        accent: '#FF6B6B',
        surface: '#2C3E50',
        background: '#1A1A2E',
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6',
      },
      fontFamily: {
        display: ['Bebas Neue', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounce 1s infinite ease-in-out',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}