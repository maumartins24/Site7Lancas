<template>
  <section id="sobre" class="py-24 md:py-32 bg-ink-50 dark:bg-ink-900">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- TOPO EDITORIAL -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start mb-20 md:mb-28">

        <!-- Texto esquerda -->
        <div>
          <div class="flex items-center gap-3 mb-6">
            <div class="kente-bar-thin w-8" />
            <span class="section-label">Nossa história</span>
          </div>

          <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-ink-900 dark:text-white leading-tight mb-8">
            Sobre o<br>
            <span class="text-gold-400 italic">Terreiro</span>
          </h2>

          <div class="space-y-5 text-ink-700 dark:text-ink-200 leading-relaxed">
            <p class="text-lg md:text-xl font-light">
              <!-- 🔧 Texto principal — substituir após combinar com o pai -->
              Terreiros são territórios afro-brasileiros, espaços de resistência onde se preservam valores ancestrais como memória, circularidade, oralidade e valorização do coletivo.
            </p>
            <p class="text-base text-ink-600 dark:text-ink-300">
              <!-- 🔧 Substituir pelo texto real -->
              O Terreiro Ogum 7 Lanças é um espaço de produção de saberes e reorganização de sentidos, onde se constrói e fortalece nossa identidade espiritual e comunitária. Cada gira, cada encontro, cada partilha é axé que nos une.
            </p>
          </div>

          <!-- Valores em destaque -->
          <div class="grid grid-cols-2 gap-4 mt-10">
            <div
              v-for="valor in valores"
              :key="valor.label"
              class="group p-5 border border-gold-400/20 hover:border-gold-400 transition-colors duration-300"
            >
              <span class="text-2xl mb-2 block">{{ valor.icon }}</span>
              <p class="text-sm font-semibold text-ink-800 dark:text-white uppercase tracking-wider">{{ valor.label }}</p>
            </div>
          </div>
        </div>

        <!-- Foto direita -->
        <div class="relative">
          <!-- Moldura decorativa -->
          <div class="absolute -top-4 -right-4 w-full h-full border border-gold-400/30" />
          <div class="absolute -top-2 -right-2 w-full h-full border border-crimson-400/20" />

          <!-- 🔧 Substitua por <img src="/images/terreiro.jpg" ...> quando tiver a foto -->
          <div class="relative aspect-[3/4] bg-gradient-to-b from-ink-200 to-ink-300 dark:from-ink-700 dark:to-ink-800 overflow-hidden">
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <svg class="w-16 h-16 text-ink-400 dark:text-ink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-ink-400 dark:text-ink-500 text-sm tracking-widest uppercase">Foto do Terreiro</p>
              <p class="text-ink-300 dark:text-ink-600 text-xs">🔧 /images/terreiro.jpg</p>
            </div>

            <!-- Sobreposição decorativa -->
            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink-900/80 to-transparent">
              <div class="kente-bar-thin w-full mb-3" />
              <p class="font-serif text-white text-lg italic">Axé · Fé · Comunidade</p>
            </div>
          </div>

          <!-- Losango decorativo -->
          <div class="absolute -bottom-5 -left-5 w-10 h-10 bg-gold-400 rotate-45" />
        </div>
      </div>

      <!-- GALERIA EDITORIAL — 3 fotos -->
      <div class="grid grid-cols-3 gap-2 md:gap-4">
        <div
          v-for="(foto, i) in fotosGaleria"
          :key="i"
          class="aspect-square overflow-hidden"
          :class="i === 1 ? 'md:aspect-[3/4]' : ''"
        >
          <!-- 🔧 Substitua por <img :src="foto.src" :alt="foto.alt" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /> -->
          <div
            class="w-full h-full flex items-center justify-center text-ink-400 dark:text-ink-600 text-xs uppercase tracking-wider"
            :class="foto.bg"
          >
            {{ foto.label }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const valores = [
  { icon: '🤝', label: 'Comunidade' },
  { icon: '⚔️', label: 'Espiritualidade' },
  { icon: '🌿', label: 'Cultura' },
  { icon: '💛', label: 'Acolhimento' },
]

const fotosGaleria = [
  { label: 'Foto 1', bg: 'bg-ink-200 dark:bg-ink-700', src: '/images/insta1.jpg', alt: 'Gira' },
  { label: 'Foto 2', bg: 'bg-ink-300 dark:bg-ink-800', src: '/images/insta2.jpg', alt: 'Comunidade' },
  { label: 'Foto 3', bg: 'bg-ink-200 dark:bg-ink-700', src: '/images/insta3.jpg', alt: 'Trabalho' },
]
</script>
