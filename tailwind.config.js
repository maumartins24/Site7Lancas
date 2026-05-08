module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
      },
      colors: {
        gold:    { 50:'#fdf8ec',100:'#f9edc8',200:'#f3d98f',400:'#D4A017',600:'#a37a0e',900:'#3d2e05' },
        crimson: { 50:'#fdf0ee',100:'#f8d0ca',400:'#C0392B',600:'#8b1a1a',900:'#3b0a0a' },
        ink:     { 50:'#f5f3f0',100:'#e8e3dc',200:'#cfc8bc',400:'#8a8070',600:'#4a4438',700:'#2a2520',800:'#1c1812',900:'#0d0b08' },
      },
    },
  },
  plugins: [],
}
