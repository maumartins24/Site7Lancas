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
        gold:    { 50:'#fdf8ec', 100:'#f9edc8', 200:'#f3d98f', 400:'#D4A017', 600:'#a37a0e', 900:'#3d2e05' },
        crimson: { 50:'#fdf0ee', 100:'#f8d0ca', 400:'#C0392B', 600:'#8b1a1a', 900:'#3b0a0a' },
        // Tema claro: branco + azul royal
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ccff',
          400: '#3366CC',  // azul principal
          500: '#4169E1',  // azul royal alternativo
          600: '#2a52b8',
          800: '#1a3480',
          900: '#0f1f4d',
        },
        ink: {
          50:  '#ffffff',  // fundo branco
          100: '#f5f7ff',
          200: '#dce6ff',
          400: '#3366CC',  // texto principal azul
          500: '#4169E1',
          600: '#2a52b8',
          700: '#1e3fa0',
          800: '#1a3480',
          900: '#0f1f4d',
        },
      },
    },
  },
  plugins: [],
}
