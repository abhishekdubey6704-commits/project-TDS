/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fire: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd9a6',
          300: '#f7bc73',
          400: '#f1943a',
          500: '#ea6c1b',
          600: '#db5010',
          700: '#b63e11',
          800: '#933315',
          900: '#762b14',
          950: '#431507',
        },
        ice: {
          50: '#f1f9fe',
          100: '#e1f1fc',
          200: '#bde3f9',
          300: '#85ccf4',
          400: '#46b0ec',
          500: '#1e94d9',
          600: '#1177b8',
          700: '#125f95',
          800: '#15507a',
          900: '#174366',
          950: '#0f2b44',
        },
      },
      fontFamily: {
        reading: ['Charter', 'Georgia', 'Times New Roman', 'serif'],
        interface: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
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
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
