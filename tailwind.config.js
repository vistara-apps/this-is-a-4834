/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 40% 96.1%)',
        accent: 'hsl(262.1 83.3% 54.9%)',
        primary: 'hsl(220 89.9% 56.1%)',
        surface: 'hsl(0 0% 100%)',
        neutral: {
          100: 'hsl(210 40% 98%)',
          200: 'hsl(210 40% 96%)',
          300: 'hsl(210 40% 94%)',
          400: 'hsl(210 40% 90%)',
          500: 'hsl(210 40% 80%)',
          600: 'hsl(210 40% 60%)',
          700: 'hsl(210 40% 40%)',
          800: 'hsl(210 40% 20%)',
          900: 'hsl(210 40% 10%)',
        },
        // Dark theme colors
        dark: {
          bg: 'hsl(220 13% 9%)',
          surface: 'hsl(220 13% 11%)',
          border: 'hsl(220 13% 18%)',
          text: 'hsl(220 13% 85%)',
          textMuted: 'hsl(220 13% 60%)',
        }
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
      },
      spacing: {
        lg: '1.5rem',
        md: '1rem',
        sm: '0.5rem',
        xl: '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}