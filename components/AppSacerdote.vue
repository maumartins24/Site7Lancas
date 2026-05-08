<template>
  <section id="sacerdote" class="relative py-24 md:py-32 bg-ink-900 overflow-hidden">

    <!-- Padrão geométrico fundo -->
    <div class="absolute inset-0 adinkra-bg pointer-events-none" />

    <!-- Triângulos decorativos -->
    <svg class="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none" viewBox="0 0 300 300">
      <polygon points="0,300 300,0 300,300" fill="#D4A017"/>
      <polygon points="0,300 200,0 200,300" fill="none" stroke="#C0392B" stroke-width="2"/>
    </svg>
    <svg class="absolute bottom-0 right-0 w-80 h-80 opacity-10 pointer-events-none" viewBox="0 0 300 300">
      <polygon points="300,0 0,300 0,0" fill="#8B1A1A"/>
    </svg>

    <!-- Símbolo Adinkra -->
    <svg class="absolute top-8 right-8 w-28 h-28 opacity-20 pointer-events-none" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#D4A017" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#C0392B" stroke-width="1"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#D4A017" stroke-width="1.5"/>
      <line x1="50" y1="6" x2="50" y2="94" stroke="#D4A017" stroke-width="0.8"/>
      <line x1="6" y1="50" x2="94" y2="50" stroke="#D4A017" stroke-width="0.8"/>
      <line x1="19" y1="19" x2="81" y2="81" stroke="#C0392B" stroke-width="0.6"/>
      <line x1="81" y1="19" x2="19" y2="81" stroke="#C0392B" stroke-width="0.6"/>
    </svg>

    <!-- Faixas kente -->
    <div class="absolute top-0 left-0 right-0 kente-bar" />
    <div class="absolute bottom-0 left-0 right-0 kente-bar" />

    <!-- CONTEÚDO -->
    <div class="relative max-w-7xl mx-auto px-6 md:px-10">

      <!-- Label separador -->
      <div class="flex items-center gap-4 mb-14 md:mb-20">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400/40" />
        <span class="section-label text-gold-400">Nosso Sacerdote</span>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/40" />
      </div>

      <!-- GRID PRINCIPAL -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">

        <!-- FOTO -->
        <div class="relative flex justify-center lg:justify-start">
          <div class="relative">

            <!-- Molduras decorativas rotacionadas -->
            <div class="absolute -inset-6 border border-gold-400/20 rotate-2" />
            <div class="absolute -inset-3 border border-crimson-400/30 -rotate-1" />

            <!-- Container da foto -->
            <div class="relative w-72 h-96 md:w-80 md:h-[440px] overflow-hidden">

              <!-- 🔧 Substitua pelo <img> quando tiver a foto -->
              <!-- <img src="/images/sacerdote.jpg" alt="Rodrigo Bertozzi" class="w-full h-full object-cover object-top" /> -->
              <div class="w-full h-full bg-gradient-to-b from-ink-700 to-ink-800 flex flex-col items-center justify-center gap-4">
                <div class="w-20 h-20 rounded-full border-2 border-gold-400/40 bg-gold-400/10 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gold-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <p class="text-gold-400/40 text-xs tracking-widest3 uppercase font-sans">Foto em breve</p>
                <p class="text-ink-500 text-[0.65rem] font-mono">🔧 /images/sacerdote.jpg</p>
              </div>

              <!-- Overlay inferior com nome -->
              <div class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                <p class="text-gold-400 text-[0.6rem] uppercase tracking-widest3 mb-1">Sacerdote</p>
                <p class="text-white font-serif text-xl font-bold">Rodrigo Bertozzi</p>
              </div>
            </div>

            <!-- Losangos decorativos -->
            <div class="absolute -bottom-5 -right-5 w-8 h-8 bg-gold-400 rotate-45" />
            <div class="absolute -bottom-9 -right-9 w-5 h-5 bg-crimson-400/70 rotate-45" />
            <div class="absolute -top-4 -left-4 w-7 h-7 border-2 border-gold-400/60 rotate-45" />
          </div>
        </div>

        <!-- TEXTO -->
        <div class="space-y-8">

          <!-- Nome -->
          <div>
            <p class="section-label mb-3">Sacerdote</p>
            <h2 class="font-serif text-5xl md:text-6xl font-black text-white leading-none">
              Rodrigo<br>
              <span class="text-gold-400 italic">Bertozzi</span>
            </h2>

            <!-- Faixa kente decorativa -->
            <div class="flex gap-1 mt-5">
              <div class="h-1 w-10 bg-gold-400 rounded" />
              <div class="h-1 w-4 bg-crimson-400 rounded" />
              <div class="h-1 w-7 bg-gold-400 rounded" />
              <div class="h-1 w-2 bg-crimson-400 rounded" />
              <div class="h-1 w-16 bg-gold-400/30 rounded" />
            </div>
          </div>

          <!-- Texto bio -->
          <div class="space-y-4 font-serif">
            <p class="text-lg text-ink-200 leading-relaxed">
              <!-- 🔧 Substituir pelo texto real do sacerdote -->
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p class="text-base text-ink-400 leading-relaxed">
              <!-- 🔧 Substituir pelo texto real -->
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.
            </p>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in tags"
              :key="tag"
              class="text-[0.65rem] px-3 py-1.5 border border-gold-400/40 text-gold-400 tracking-wider uppercase font-mono"
            >
              {{ tag }}
            </span>
          </div>

          <!-- CTA com símbolo -->
          <div class="flex items-center gap-5 pt-2">
            <svg width="44" height="44" viewBox="0 0 48 48" class="opacity-50 shrink-0">
              <polygon points="24,2 46,24 24,46 2,24" fill="none" stroke="#D4A017" stroke-width="1.5"/>
              <polygon points="24,10 38,24 24,38 10,24" fill="none" stroke="#C0392B" stroke-width="1"/>
              <circle cx="24" cy="24" r="5" fill="#D4A017" opacity="0.6"/>
              <line x1="24" y1="2" x2="24" y2="46" stroke="#D4A017" stroke-width="0.5" opacity="0.4"/>
              <line x1="2" y1="24" x2="46" y2="24" stroke="#D4A017" stroke-width="0.5" opacity="0.4"/>
            </svg>

            <a
              href="https://www.instagram.com/terreiro7lancas/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
            >
              Conheça o Terreiro ⚔️
            </a>
          </div>
        </div>
      </div>

      <!-- Frase de rodapé -->
      <div class="flex items-center gap-4 mt-20 justify-center">
        <div class="h-px w-12 bg-gold-400/30" />
        <p class="section-label text-gold-400/50">Axé · Fé · Comunidade</p>
        <div class="h-px w-12 bg-gold-400/30" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const tags = ['Umbanda', 'Ogum 7 Lanças', 'Pai João de Aruanda', 'Sacerdote']
</script>
