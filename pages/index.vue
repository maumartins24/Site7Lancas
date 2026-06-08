<template>
  <div>

    <!-- ══ ABAS ══ -->
    <div class="sticky top-[64px] z-40 bg-ink-900/95 backdrop-blur-lg border-b border-gold-400/20">
      <div class="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
        <button
          v-for="tab in allTabs" :key="tab.id"
          class="page-tab"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          <span>{{ tab.icon }}</span>{{ tab.label }}
        </button>
      </div>
    </div>

    <!-- INÍCIO -->
    <div v-show="currentTab === 'inicio'"><AppHero /></div>

    <!-- SOBRE -->
    <div v-show="currentTab === 'sobre'"><AppSobre /></div>

    <!-- SACERDOTE -->
    <div v-show="currentTab === 'sacerdote'"><AppSacerdote /></div>

    <!-- AGENDA -->
    <div v-show="currentTab === 'agenda'">
      <section class="relative py-14 px-6 text-center overflow-hidden adinkra-bg">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-ink-900/50 pointer-events-none" />
        <div class="relative max-w-3xl mx-auto">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-7xl font-black text-white leading-none">
            Agenda <span class="text-gold-400 italic">do Axé</span>
          </h1>
          <p class="mt-4 text-ink-400 text-base">Confira os próximos eventos, giras e encontros</p>
          <div class="flex flex-wrap justify-center gap-4 mt-6">
            <div v-for="tipo in tipos" :key="tipo.id"
              class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-400">
              <div class="w-2.5 h-2.5 rotate-45" :style="{ background: tipo.color }" />
              {{ tipo.label }}
            </div>
          </div>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12"><AppCalendario /></div>
    </div>

    <!-- LIMPEZA -->
    <div v-show="currentTab === 'limpeza'">
      <section class="relative py-14 px-6 text-center overflow-hidden adinkra-bg">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-ink-900/50 pointer-events-none" />
        <div class="relative max-w-3xl mx-auto">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-white leading-none">
            Escala de <span class="text-gold-400 italic">Limpeza</span>
          </h1>
          <p class="mt-4 text-ink-400 text-sm max-w-lg mx-auto leading-relaxed">
            Confira os dias de limpeza do mês, veja quem está na escala e confirme sua presença. 
            Quem limpou na semana anterior não é escalado para a próxima.
          </p>
          <div class="flex flex-wrap justify-center gap-5 mt-6">
            <div class="flex items-center gap-2 font-mono text-[9px] text-ink-400">
              <span class="w-2 h-2 rounded-full border border-ink-400 inline-block" />Pendente
            </div>
            <div class="flex items-center gap-2 font-mono text-[9px] text-gold-400">
              <span class="w-2 h-2 rounded-full bg-gold-400 inline-block" />Confirmado
            </div>
            <div class="flex items-center gap-2 font-mono text-[9px] text-green-400">
              <span class="w-2 h-2 rounded-full bg-green-400 inline-block" />Limpou ✓
            </div>
          </div>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12"><AppLimpeza /></div>
    </div>

    <!-- CONQUISTAS -->
    <div v-show="currentTab === 'conquistas'"><AppConquistas /></div>

    <!-- INSTAGRAM -->
    <div v-show="currentTab === 'instagram'">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <AppPostsInstagram />
        <div class="mt-12"><AppGaleria /></div>
      </div>
    </div>

    <!-- LOJINHA -->
    <div v-show="currentTab === 'lojinha'"><AppLojinha /></div>

    <!-- RIFAS -->
    <div v-show="currentTab === 'rifas'"><AppRifas /></div>

    <!-- CONTRIBUIÇÕES -->
    <div v-show="currentTab === 'contribuicoes'">
      <section class="relative py-14 px-6 text-center overflow-hidden adinkra-bg">
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
      <div class="max-w-7xl mx-auto px-6 py-12"><AppContribuicoes /></div>
    </div>

    <!-- ARRECADAÇÃO -->
    <div v-show="currentTab === 'arrecadacao'"><AppArrecadacao /></div>

  </div>
</template>

<script setup lang="ts">
const { tipos, subscribe: subTipos, unsubscribeAll: unsubTipos } = useTiposEvento()

const allTabs = [
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

const currentTab = ref('inicio')

useSeoMeta({
  title: 'Terreiro Ogum 7 Lanças',
  description: 'Templo Umbandista Sr. Ogum Sete Lanças e Pai João de Aruanda.',
})

onMounted(() => subTipos())
onUnmounted(() => unsubTipos())
</script>

<style scoped>
.page-tab {
  @apply flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-4 bg-transparent border-none text-ink-400 cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:text-ink-200 shrink-0 whitespace-nowrap;
  margin-bottom: -1px;
}
.page-tab.active { @apply text-gold-400 border-gold-400; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.hero-label {
  @apply font-mono text-[10px] uppercase tracking-[0.4em] text-gold-400 flex items-center justify-center gap-3;
}
.hero-label::before, .hero-label::after { content: ''; @apply h-px w-8 bg-gold-400/30; }
.adinkra-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,5 59,32 32,59 5,32' fill='none' stroke='%23D4A017' stroke-width='0.7' opacity='0.12'/%3E%3Cline x1='32' y1='5' x2='32' y2='59' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3Cline x1='5' y1='32' x2='59' y2='32' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E");
}
</style>
