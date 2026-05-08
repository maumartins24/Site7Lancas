<template>
  <div>
    <!-- ABAS DE NAVEGAÇÃO -->
    <div class="sticky top-[64px] z-40 bg-ink-800/95 backdrop-blur-lg border-b border-gold-400/20">
      <div class="max-w-7xl mx-auto px-6 flex overflow-x-auto">
        <button
          v-for="tab in visibleTabs" :key="tab.id"
          class="page-tab whitespace-nowrap"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          <span>{{ tab.icon }}</span>{{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ABA: AGENDA -->
    <div v-show="currentTab === 'agenda'">
      <section class="relative py-16 px-6 text-center overflow-hidden adinkra-bg">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-ink-900/50 pointer-events-none" />
        <div class="relative max-w-3xl mx-auto">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-7xl font-black text-white leading-none">
            Agenda
          </h1>
          <p class="mt-4 text-ink-400 text-base">
            Confira os próximos eventos, giras e encontros da nossa comunidade
          </p>
          <!-- Legenda dinâmica vinda do Firestore -->
          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <div
              v-for="tipo in tipos"
              :key="tipo.id"
              class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-400"
            >
              <div class="w-2.5 h-2.5 rotate-45" :style="{ background: tipo.color }" />
              {{ tipo.label }}
            </div>
          </div>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12">
        <AppCalendario />
      </div>
    </div>

    <!-- ABA: CONTRIBUIÇÕES -->
    <div v-show="currentTab === 'contribuicoes'">
      <section class="relative py-16 px-6 text-center overflow-hidden adinkra-bg">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-ink-900/50 pointer-events-none" />
        <div class="relative max-w-3xl mx-auto">
          <div class="hero-label mb-4">Família do Terreiro</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-white leading-none">
            Contribuições <span class="text-green-400 italic">do Terreiro</span>
          </h1>
          <p class="mt-4 text-ink-400 text-sm max-w-lg mx-auto leading-relaxed">
            Cada família pode se cadastrar para levar os materiais que o Terreiro precisa.
            Clique no <strong class="text-gold-400">＋</strong> do item e coloque seu nome e quantidade.
          </p>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12">
        <AppContribuicoes />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tipos dinâmicos para a legenda do hero
const { tipos, subscribe, unsubscribeAll } = useTiposEvento()

const visibleTabs = [
  { id: 'agenda',        icon: '📅', label: 'Agenda' },
  { id: 'contribuicoes', icon: '🕯️', label: 'Contribuições' },
  // 🔧 Descomente quando o restante do site estiver pronto:
  // { id: 'home',        icon: '🏠', label: 'Início' },
  // { id: 'arrecadacao', icon: '💛', label: 'Arrecadação' },
]

const currentTab = ref('agenda')

useSeoMeta({
  title: 'Terreiro Ogum 7 Lanças',
  description: 'Agenda e contribuições do Terreiro Ogum 7 Lanças.',
})

onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.page-tab {
  @apply flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-5 py-4 bg-transparent border-none text-ink-400 cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-ink-200;
  margin-bottom: -1px;
}
.page-tab.active { @apply text-gold-400 border-gold-400; }
.hero-label {
  @apply font-mono text-[10px] uppercase tracking-[0.4em] text-gold-400 flex items-center justify-center gap-3;
}
.hero-label::before, .hero-label::after { content: ''; @apply h-px w-8 bg-gold-400/30; }
.adinkra-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,5 59,32 32,59 5,32' fill='none' stroke='%23D4A017' stroke-width='0.7' opacity='0.12'/%3E%3Cline x1='32' y1='5' x2='32' y2='59' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3Cline x1='5' y1='32' x2='59' y2='32' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E");
}
</style>
