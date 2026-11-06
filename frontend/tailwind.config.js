/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF5E9', beige: '#F5EAD6', beigeCard: '#EEE0C4', beigeDeep: '#E4CE9E',
        ink: '#241708', inkSoft: '#5C4A2E', gold: '#E1A22B', goldDeep: '#B8791A',
        goldPale: '#F0C36A', rust: '#B65B2A', emerald: '#3F5A3D', emeraldPale: '#DCE7D3', line: '#D9C39A',
      },
      fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter', 'sans-serif'], mono: ['IBM Plex Mono', 'monospace'] },
    },
  },
};