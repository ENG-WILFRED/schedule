import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out forwards',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        'base-dark': '#0F111A',
        'card-base': '#1A1C2B',
        'electric-blue': '#3D5AFE',
        'cyan-teal': '#00E5FF',
        'vivid-magenta': '#D500F9',
        'neon-green': '#00E676',
        'amber-warning': '#FFAB00',
        'hot-red': '#FF1744',
        'text-primary': '#F5F5F5',
        'text-secondary': '#CFCFCF',
        'white-off': '#FEFEFA'
      },
    },
  },
  plugins: [],
};

export default config;
