/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        guardian: {
          bg: '#090D16',
          surface: '#0F172A',
          card: '#111928',
          elevated: '#1A2234',
          border: '#26354D',
          borderLight: '#3B4A66',
          emerald: '#10B981',
          emeraldDark: '#059669',
          emeraldContainer: '#064E3B',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
          blue: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
};
