/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fredoka"', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          100: '#E0F2FE',
        },
        amber: {
          100: '#FEF08A',
        },
        emerald: {
          100: '#DCFCE7',
        },
        pink: {
          100: '#FCE7F3',
        },
        orange: {
          100: '#FFEDD5',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      borderWidth: {
        6: '6px',
        10: '10px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
