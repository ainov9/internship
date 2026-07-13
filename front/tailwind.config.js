/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#aa3bff',
        'primary-light': 'rgba(170, 59, 255, 0.1)',
        'text-muted': '#6b6375',
        'text-dark': '#08060d',
        border: '#e5e4e7',
        'accent-teal': '#0ea5e9',
        'accent-rose': '#f43f5e',
        'accent-amber': '#f59e0b',
        'accent-indigo': '#6366f1',
        'surface-warm': '#fef9f0',
        'surface-cool': '#f0f4ff',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'bubble-bounce': 'bubbleBounce 0.8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'breathing': 'breathing 3.5s ease-in-out infinite',
        'wave-drift': 'waveDrift 8s ease-in-out infinite alternate',
        'chat-float': 'chatFloat 2.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.5s ease-in-out infinite',
        'tooltip-bounce': 'tooltipBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bubbleBounce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.05)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(170, 59, 255, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(170, 59, 255, 0)' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(170, 59, 255, 0.4)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 20px 5px rgba(170, 59, 255, 0.25)' },
        },
        waveDrift: {
          '0%': { transform: 'translateX(-1.5%)' },
          '100%': { transform: 'translateX(1.5%)' },
        },
        chatFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(170, 59, 255, 0.45)' },
          '100%': { boxShadow: '0 0 0 18px rgba(170, 59, 255, 0)' },
        },
        tooltipBounce: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '60%': { opacity: '1', transform: 'translateY(-2px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
