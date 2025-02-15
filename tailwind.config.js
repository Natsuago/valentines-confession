/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'hsl(var(--border))'
      },
      backgroundColor: {
        background: 'hsl(var(--background))'
      },
      textColor: {
        foreground: 'hsl(var(--foreground))'
      },
      animation: {
        'confetti': 'confetti 5s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}

