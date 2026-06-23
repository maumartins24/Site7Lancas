<template>
  <div>
    <!-- INÍCIO -->
    <div v-show="currentTab === 'inicio'"><AppHero /></div>

    <!-- SOBRE -->
    <div v-show="currentTab === 'sobre'" class="page-pad"><AppSobre /></div>

    <!-- SACERDOTE -->
    <div v-show="currentTab === 'sacerdote'" class="page-pad"><AppSacerdote /></div>

    <!-- AGENDA -->
    <div v-show="currentTab === 'agenda'">
      <section class="page-hero adinkra-bg">
        <div class="page-hero-overlay" />
        <div class="relative max-w-3xl mx-auto text-center px-6">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-ink-800 leading-none">Agenda</h1>
          <p class="mt-4 text-ink-600 text-sm">Confira os próximos eventos, giras e encontros</p>
          <div class="flex flex-wrap justify-center gap-4 mt-5">
            <div v-for="tipo in tipos" :key="tipo.id"
              class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-500">
              <div class="w-2 h-2 rotate-45" :style="{ background: tipo.color }" />
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
      <section class="page-hero adinkra-bg">
        <div class="page-hero-overlay" />
        <div class="relative max-w-3xl mx-auto text-center px-6">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-ink-800 leading-none">
            Escala de <span class="text-gold-400 italic">Limpeza</span>
          </h1>
          <p class="mt-4 text-ink-600 text-sm max-w-lg mx-auto leading-relaxed">
            Confira os dias de limpeza, veja quem está na escala e confirme sua presença.
            Quem limpou na semana anterior não é escalado novamente.
          </p>
          <div class="flex flex-wrap justify-center gap-5 mt-5">
            <span class="flex items-center gap-1.5 font-mono text-[9px] text-ink-500"><span class="w-2 h-2 rounded-full border border-ink-500 inline-block"/>Pendente</span>
            <span class="flex items-center gap-1.5 font-mono text-[9px] text-gold-600"><span class="w-2 h-2 rounded-full bg-gold-400 inline-block"/>Confirmado</span>
            <span class="flex items-center gap-1.5 font-mono text-[9px] text-green-600"><span class="w-2 h-2 rounded-full bg-green-500 inline-block"/>Limpou ✓</span>
          </div>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12"><AppLimpeza /></div>
    </div>

    <!-- ANIVERSARIANTES -->
    <div v-show="currentTab === 'aniversariantes'">
      <section class="page-hero adinkra-bg">
        <div class="page-hero-overlay" />
        <div class="relative max-w-3xl mx-auto text-center px-6">
          <div class="hero-label mb-4">Terreiro Ogum 7 Lanças</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-ink-800 leading-none">
            <span class="text-gold-400 italic">Aniversariantes</span>
          </h1>
          <p class="mt-4 text-ink-600 text-sm max-w-lg mx-auto leading-relaxed">
            Celebre com a nossa família! Confira os aniversariantes do mês e os próximos.
          </p>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12"><AppAniversariantes /></div>
    </div>

    <!-- CONQUISTAS -->
    <div v-show="currentTab === 'conquistas'" class="page-pad"><AppConquistas /></div>

    <!-- INSTAGRAM -->
    <div v-show="currentTab === 'instagram'">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <AppPostsInstagram />
        <div class="mt-14"><AppGaleria /></div>
      </div>
    </div>

    <!-- LOJINHA -->
    <div v-show="currentTab === 'lojinha'" class="page-pad"><AppLojinha /></div>

    <!-- RIFAS -->
    <div v-show="currentTab === 'rifas'" class="page-pad"><AppRifas /></div>

    <!-- CONTRIBUIÇÕES -->
    <div v-show="currentTab === 'contribuicoes'">
      <section class="page-hero adinkra-bg">
        <div class="page-hero-overlay" />
        <div class="relative max-w-3xl mx-auto text-center px-6">
          <div class="hero-label mb-4">Família do Terreiro</div>
          <h1 class="font-serif text-5xl md:text-6xl font-black text-ink-800 leading-none">
            Contribuições <span class="text-green-600 italic">do Terreiro</span>
          </h1>
          <p class="mt-4 text-ink-600 text-sm max-w-lg mx-auto leading-relaxed">
            Cada família pode se cadastrar para levar os materiais que o Terreiro precisa.
            Clique no <strong class="text-gold-400">＋</strong> do item e coloque seu nome e quantidade.
          </p>
        </div>
      </section>
      <div class="kente" />
      <div class="max-w-7xl mx-auto px-6 py-12"><AppContribuicoes /></div>
    </div>

    <!-- ARRECADAÇÃO -->
    <div v-show="currentTab === 'arrecadacao'" class="page-pad"><AppArrecadacao /></div>
  </div>
</template>

<script setup lang="ts">
// Usa o mesmo useState do layout — sem prop drilling
const currentTab = useState('currentTab', () => 'inicio')
const { tipos, subscribe: subTipos, unsubscribeAll: unsubTipos } = useTiposEvento()

useSeoMeta({
  title: 'Terreiro Ogum 7 Lanças',
  description: 'Templo Umbandista Sr. Ogum Sete Lanças e Pai João de Aruanda.',
})

onMounted(() => subTipos())
onUnmounted(() => unsubTipos())
</script>

<style scoped>
/* Páginas com padding-top para compensar o header fixo */
.page-pad { @apply pt-20 md:pt-24; }

/* Hero de seção (agenda, limpeza, contribuições) */
.page-hero {
  @apply relative pt-28 pb-14 px-6 text-center overflow-hidden;
}
.page-hero-overlay {
  @apply absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none;
}

.hero-label {
  @apply font-mono text-[10px] uppercase tracking-[0.4em] text-gold-400 flex items-center justify-center gap-3;
}
.hero-label::before, .hero-label::after { content: ''; @apply h-px w-8 bg-gold-400/30; }

.adinkra-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,5 59,32 32,59 5,32' fill='none' stroke='%23D4A017' stroke-width='0.7' opacity='0.12'/%3E%3Cline x1='32' y1='5' x2='32' y2='59' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3Cline x1='5' y1='32' x2='59' y2='32' stroke='%23C0392B' stroke-width='0.4' opacity='0.08'/%3E%3C/svg%3E");
}
</style>
