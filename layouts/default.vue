<template>
  <div class="min-h-screen">
    <!-- HEADER -->
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      :class="scrolled
        ? 'bg-ink-50/95 dark:bg-ink-900/95 backdrop-blur-lg border-b border-gold-400/20 shadow-sm'
        : 'bg-transparent'"
    >
      <!-- Faixa kente no topo -->
      <div class="kente-bar w-full" />

      <div class="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between py-3 md:py-4">

        <!-- LOGO -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative w-12 h-12 md:w-14 md:h-14">
            <!-- 🔧 Substitua pelos logos reais -->
            <!-- <img src="/images/logo-azul.png" alt="Logo" class="dark:hidden w-full h-full object-contain" /> -->
            <!-- <img src="/images/logo-vermelho.png" alt="Logo" class="hidden dark:block w-full h-full object-contain" /> -->
            <div class="w-full h-full rounded-full bg-gold-400/10 border border-gold-400/40 flex items-center justify-center group-hover:border-gold-400 transition-colors duration-300">
              <span class="text-gold-400 font-serif font-black text-lg">⚔</span>
            </div>
          </div>
          <div class="hidden sm:block">
            <p class="font-serif font-bold text-ink-800 dark:text-ink-100 text-base md:text-lg leading-tight tracking-tight">
              Ogum 7 Lanças
            </p>
            <p class="text-[0.6rem] uppercase tracking-widest text-gold-400">Templo Umbandista</p>
          </div>
        </NuxtLink>

        <!-- NAV DESKTOP -->
        <nav class="hidden lg:flex items-center gap-8">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            class="text-xs uppercase tracking-widest font-sans font-medium text-ink-600 dark:text-ink-300 hover:text-gold-400 dark:hover:text-gold-400 transition-colors duration-200"
          >
            {{ item.label }}
          </a>
          <NuxtLink
            to="/arrecadacao"
            class="btn-primary text-xs py-2.5 px-5"
          >
            Apoiar 💛
          </NuxtLink>
        </nav>

        <!-- DIREITA: THEME + INSTAGRAM + HAMBURGER -->
        <div class="flex items-center gap-4">

          <!-- Instagram -->
          <a
            href="https://www.instagram.com/terreiro7lancas/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-ink-600 dark:text-ink-300 hover:text-gold-400 dark:hover:text-gold-400 transition-colors duration-200"
            aria-label="Instagram"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <!-- Theme toggle -->
          <button
            @click="toggleColorMode"
            class="w-8 h-8 flex items-center justify-center text-ink-600 dark:text-ink-300 hover:text-gold-400 dark:hover:text-gold-400 transition-colors duration-200"
            :aria-label="isDark ? 'Modo claro' : 'Modo escuro'"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.772 17.303a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061-1.06l1.59-1.591z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Hamburger mobile -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
          >
            <span class="w-6 h-px bg-current transition-all duration-300" :class="mobileOpen ? 'rotate-45 translate-y-2' : ''" />
            <span class="w-6 h-px bg-current transition-all duration-300" :class="mobileOpen ? 'opacity-0' : ''" />
            <span class="w-6 h-px bg-current transition-all duration-300" :class="mobileOpen ? '-rotate-45 -translate-y-2' : ''" />
          </button>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <Transition name="slide-down">
        <div
          v-if="mobileOpen"
          class="lg:hidden bg-ink-50/98 dark:bg-ink-900/98 backdrop-blur-xl border-t border-gold-400/20"
        >
          <nav class="flex flex-col px-6 py-6 gap-5">
            <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              @click="mobileOpen = false"
              class="text-xs uppercase tracking-widest font-medium text-ink-700 dark:text-ink-200 hover:text-gold-400 transition-colors py-1 border-b border-ink-100/20 dark:border-ink-800/40"
            >
              {{ item.label }}
            </a>
            <NuxtLink
              to="/arrecadacao"
              @click="mobileOpen = false"
              class="btn-primary text-xs py-3 text-center"
            >
              Apoiar a Campanha 💛
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- CONTEÚDO -->
    <main class="pt-[72px]">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="bg-ink-900 dark:bg-black text-ink-100">
      <div class="kente-bar w-full" />
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Identidade -->
        <div class="space-y-4">
          <h3 class="font-serif text-xl text-white">Terreiro Ogum 7 Lanças</h3>
          <p class="text-xs uppercase tracking-widest text-gold-400">Templo Umbandista</p>
          <p class="text-sm text-ink-300 leading-relaxed">
            Umbanda, cultura negra de terreiro.<br>
            Axé · Fé · Comunidade.
          </p>
          <!-- faixinha kente decorativa -->
          <div class="flex gap-1 mt-2">
            <div class="h-1 w-8 bg-gold-400 rounded" />
            <div class="h-1 w-3 bg-crimson-400 rounded" />
            <div class="h-1 w-5 bg-gold-400 rounded" />
            <div class="h-1 w-2 bg-crimson-400 rounded" />
          </div>
        </div>

        <!-- Links -->
        <div class="space-y-3">
          <p class="section-label mb-4">Navegação</p>
          <a v-for="item in navItems" :key="item.label" :href="item.href"
            class="block text-sm text-ink-300 hover:text-gold-400 transition-colors duration-200">
            {{ item.label }}
          </a>
        </div>

        <!-- Contato -->
        <div class="space-y-3">
          <p class="section-label mb-4">Contato</p>
          <p class="text-sm text-ink-300">📍 Av. Itaquera, 1102 –Jardim Maringa</p>
          <p class="text-sm text-ink-300">✉️ terreiroogumsetelancas@gmail.com</p>
          <a
            href="https://www.instagram.com/terreiro7lancas/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-ink-300 hover:text-gold-400 transition-colors duration-200"
          >
            📷 @terreiro7lancas
          </a>
          <div class="pt-2">
            <!-- Mapa embed -->
            <div class="w-full h-36 rounded overflow-hidden border border-gold-400/20">
              <iframe
                title="Localização"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-46.5160,-23.5550,-46.5110,-23.5520&layer=mapnik&marker=-23.55344,-46.51358"
                class="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="kente-bar-thin w-full" />
      <p class="text-center text-xs text-ink-500 py-5">
        © 2025 Terreiro Ogum 7 Lanças — Construindo caminhos, ajudando a comunidade.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const scrolled = ref(false)
const mobileOpen = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 40
  })
})

const navItems = [
  { label: 'Sobre Nós',   href: '/#sobre' },
  { label: 'Sacerdote',   href: '/#sacerdote' },
  { label: 'Conquistas',  href: '/#conquistas' },
  { label: 'Lojinha',     href: '/#lojinha' },
  { label: 'Rifas',       href: '/#rifas' },
  { label: 'Localização', href: '/#localizacao' },
]
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
