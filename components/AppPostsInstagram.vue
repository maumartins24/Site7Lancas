<template>
  <section id="posts" class="py-24 md:py-28 bg-ink-50 dark:bg-ink-900">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- CABEÇALHO -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="kente-bar-thin w-8" />
            <span class="section-label">Direto do Instagram</span>
          </div>
          <h2 class="font-serif text-4xl md:text-5xl font-black text-ink-900 dark:text-white">
            Últimas<br>
            <span class="text-gold-400 italic">Publicações</span>
          </h2>
        </div>
        <a
          href="https://www.instagram.com/terreiro7lancas/"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-outline border-ink-300 dark:border-ink-600 text-ink-700 dark:text-ink-200 hover:bg-ink-800 hover:text-white dark:hover:bg-white dark:hover:text-ink-900 self-start md:self-auto"
        >
          Ver perfil ↗
        </a>
      </div>

      <!-- CARDS DOS POSTS — estilo editorial largo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <a
          v-for="post in posts"
          :key="post.id"
          :href="post.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group block overflow-hidden bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 hover:border-gold-400 dark:hover:border-gold-400 transition-all duration-400"
        >
          <!-- Imagem -->
          <div class="relative aspect-[4/3] overflow-hidden">
            <!-- 🔧 Substitua por: <img :src="post.imagem" :alt="post.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> -->
            <div class="w-full h-full bg-ink-100 dark:bg-ink-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
              <svg class="w-12 h-12 text-ink-300 dark:text-ink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>

            <!-- Badge -->
            <div class="absolute top-4 left-4 bg-ink-900/80 text-gold-400 text-[0.6rem] uppercase tracking-widest px-2.5 py-1 font-mono">
              @terreiro7lancas
            </div>
          </div>

          <!-- Rodapé do card -->
          <div class="p-5 flex items-center justify-between">
            <p class="text-sm text-ink-600 dark:text-ink-300 leading-relaxed max-w-xs">
              {{ post.legenda }}
            </p>
            <div class="shrink-0 ml-4 w-8 h-8 border border-gold-400/40 group-hover:border-gold-400 group-hover:bg-gold-400 flex items-center justify-center transition-all duration-300">
              <span class="text-gold-400 group-hover:text-ink-900 text-sm transition-colors duration-300">↗</span>
            </div>
          </div>

          <div class="kente-bar-thin w-full group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const posts = [
  {
    id: 1,
    url: 'https://www.instagram.com/p/DWl8Nr_D3vl/',
    imagem: '/images/insta1.jpg',
    alt: 'Post Instagram 1 — Terreiro Ogum 7 Lanças',
    legenda: 'Acompanhe nossa caminhada e fique por dentro das novidades do Terreiro.',
  },
  {
    id: 2,
    url: 'https://www.instagram.com/p/DWEwKJkjwEm/',
    imagem: '/images/insta2.jpg',
    alt: 'Post Instagram 2 — Terreiro Ogum 7 Lanças',
    legenda: 'Cada gira, cada encontro, cada momento de axé compartilhado com nossa comunidade.',
  },
]
</script>
