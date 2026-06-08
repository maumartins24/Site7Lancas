<template>
  <div class="min-h-screen">

    <!-- ══ HEADER ══ -->
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      :class="scrolled
        ? 'bg-ink-900/95 backdrop-blur-lg border-b border-gold-400/20 shadow-lg'
        : 'bg-transparent'"
    >
      <!-- Faixa kente -->
      <div class="kente-bar w-full" />

      <div class="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-[68px]">

        <!-- LOGO -->
        <button @click="goTo('inicio')" class="flex items-center gap-3 group shrink-0">
          <div class="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gold-400/10 border border-gold-400/40 flex items-center justify-center group-hover:border-gold-400 transition-colors duration-300">
            <span class="text-gold-400 font-serif font-black text-base">⚔</span>
          </div>
          <div class="hidden sm:block leading-tight">
            <p class="font-serif font-bold text-white text-sm md:text-base tracking-tight">Ogum 7 Lanças</p>
            <p class="font-mono text-[9px] uppercase tracking-widest text-gold-400">Templo Umbandista</p>
          </div>
        </button>

        <!-- NAV DESKTOP -->
        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="item in navItems" :key="item.id"
            @click="goTo(item.id)"
            class="nav-link"
            :class="{ active: currentTab === item.id }"
          >
            {{ item.label }}
          </button>
        </nav>

        <!-- DIREITA -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- Apoiar CTA -->
          <button
            @click="goTo('arrecadacao')"
            class="hidden md:flex btn-apoiar"
            :class="{ active: currentTab === 'arrecadacao' }"
          >
            Apoiar 💛
          </button>

          <!-- Instagram -->
          <a href="https://www.instagram.com/terreiro7lancas/" target="_blank" rel="noopener noreferrer"
            class="icon-btn" aria-label="Instagram">
            <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <!-- Theme toggle -->
          <button @click="toggleColorMode" class="icon-btn" :aria-label="isDark ? 'Modo claro' : 'Modo escuro'">
            <svg v-if="isDark" class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.772 17.303a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 5.106a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061-1.06l1.59-1.591z"/>
            </svg>
            <svg v-else class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Hamburger mobile -->
          <button @click="mobileOpen = !mobileOpen" class="lg:hidden icon-btn" aria-label="Menu">
            <span class="flex flex-col gap-[5px]">
              <span class="w-5 h-px bg-current block transition-all duration-300"
                :class="mobileOpen ? 'rotate-45 translate-y-[6px]' : ''" />
              <span class="w-5 h-px bg-current block transition-all duration-300"
                :class="mobileOpen ? 'opacity-0' : ''" />
              <span class="w-5 h-px bg-current block transition-all duration-300"
                :class="mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''" />
            </span>
          </button>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <Transition name="slide-down">
        <div v-if="mobileOpen" class="lg:hidden bg-ink-900/98 backdrop-blur-xl border-t border-gold-400/15">
          <nav class="flex flex-col px-6 py-5 gap-1">
            <button
              v-for="item in allItems" :key="item.id"
              @click="goTo(item.id); mobileOpen = false"
              class="mobile-nav-link"
              :class="{ active: currentTab === item.id }"
            >
              <span class="text-lg leading-none">{{ item.icon }}</span>
              {{ item.label }}
            </button>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- CONTEÚDO — sem pt pois o Hero é full-screen -->
    <main>
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="bg-ink-900 text-ink-100">
      <div class="kente-bar w-full" />
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="space-y-4">
          <h3 class="font-serif text-xl text-white">Terreiro Ogum 7 Lanças</h3>
          <p class="font-mono text-[9px] uppercase tracking-widest text-gold-400">Templo Umbandista</p>
          <p class="text-sm text-ink-300 leading-relaxed">Umbanda, cultura negra de terreiro.<br>Axé · Fé · Comunidade.</p>
          <div class="flex gap-1 pt-1">
            <div class="h-1 w-8 bg-gold-400 rounded" />
            <div class="h-1 w-3 bg-crimson-400 rounded" />
            <div class="h-1 w-5 bg-gold-400 rounded" />
            <div class="h-1 w-2 bg-crimson-400 rounded" />
          </div>
        </div>
        <div class="space-y-2">
          <p class="font-mono text-[9px] uppercase tracking-widest text-gold-400 mb-4">Navegação</p>
          <button v-for="item in allItems" :key="item.id"
            @click="goTo(item.id)"
            class="block text-sm text-ink-300 hover:text-gold-400 transition-colors duration-200 text-left">
            {{ item.label }}
          </button>
        </div>
        <div class="space-y-3">
          <p class="font-mono text-[9px] uppercase tracking-widest text-gold-400 mb-4">Contato</p>
          <p class="text-sm text-ink-300">📍 Av. Itaquera, 1102 – Parque Maria Luiza</p>
          <p class="text-sm text-ink-300">✉️ terreiroogumsetelancas@gmail.com</p>
          <a href="https://www.instagram.com/terreiro7lancas/" target="_blank" rel="noopener noreferrer"
            class="block text-sm text-ink-300 hover:text-gold-400 transition-colors duration-200">
            📷 @terreiro7lancas
          </a>
          <div class="pt-1 w-full h-32 border border-gold-400/20 overflow-hidden">
            <iframe title="Localização"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-46.4985%2C-23.5525%2C-46.4935%2C-23.5480&layer=mapnik&marker=-23.5505%2C-46.4960"
              class="w-full h-full" />
          </div>
        </div>
      </div>
      <div class="kente-bar-thin w-full" />
      <p class="text-center font-mono text-[10px] text-ink-600 py-4 tracking-widest uppercase">
        © 2025 Terreiro Ogum 7 Lanças — Construindo caminhos, ajudando a comunidade.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Tab ativo compartilhado com index.vue via useState
const currentTab = useState('currentTab', () => 'inicio')

const allItems = [
  { id: 'inicio',        icon: '🏠', label: 'Início'        },
  { id: 'sobre',         icon: '🌿', label: 'Sobre Nós'     },
  { id: 'sacerdote',     icon: '⚔️', label: 'Sacerdote'     },
  { id: 'agenda',        icon: '📅', label: 'Agenda'        },
  { id: 'limpeza',       icon: '🧹', label: 'Limpeza'       },
  { id: 'conquistas',    icon: '🌟', label: 'Conquistas'    },
  { id: 'instagram',     icon: '📷', label: 'Instagram'     },
  { id: 'lojinha',       icon: '🛒', label: 'Lojinha'       },
  { id: 'rifas',         icon: '🎟️', label: 'Rifas'        },
  { id: 'contribuicoes', icon: '🕯️', label: 'Contribuições' },
  { id: 'arrecadacao',   icon: '💛', label: 'Arrecadação'   },
]

// Apenas os 4 no menu de cima desktop
const navItems = allItems.filter(i =>
  ['sobre', 'agenda', 'limpeza', 'arrecadacao'].includes(i.id)
)

function goTo(id: string) {
  currentTab.value = id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const colorMode    = useColorMode()
const isDark       = computed(() => colorMode.value === 'dark')
const toggleColorMode = () => { colorMode.preference = isDark.value ? 'light' : 'dark' }

const scrolled    = ref(false)
const mobileOpen  = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 60 }, { passive: true })
})
</script>

<style scoped>
/* Nav link desktop */
.nav-link {
  @apply font-mono text-[10px] uppercase tracking-widest px-4 py-2 text-ink-400 cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-gold-400 bg-transparent;
}
.nav-link.active { @apply text-gold-400 border-gold-400; }

/* Botão apoiar */
.btn-apoiar {
  @apply font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 bg-gold-400 text-ink-900 border-none cursor-pointer transition-all duration-200 hover:bg-gold-200 font-medium;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}

/* Ícone btn */
.icon-btn {
  @apply w-8 h-8 flex items-center justify-center text-ink-400 hover:text-gold-400 transition-colors duration-200 cursor-pointer bg-transparent border-none;
}

/* Mobile nav */
.mobile-nav-link {
  @apply flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-400 py-3 px-2 border-b border-ink-800 hover:text-gold-400 transition-colors duration-200 cursor-pointer bg-transparent border-l-0 border-r-0 border-t-0 w-full text-left;
}
.mobile-nav-link.active { @apply text-gold-400; }
.mobile-nav-link:last-child { @apply border-b-0; }

/* Animação mobile */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
