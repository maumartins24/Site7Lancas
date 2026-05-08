<template>
  <section class="relative min-h-screen flex flex-col overflow-hidden bg-ink-900">

    <!-- Padrão geométrico fundo -->
    <div class="absolute inset-0 adinkra-bg opacity-60 pointer-events-none" />

    <!-- Gradiente sobre o fundo -->
    <div class="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/60 to-ink-900 pointer-events-none" />

    <!-- Imagem de fundo — carrossel simples -->
    <div class="absolute inset-0 overflow-hidden">
      <Transition name="hero-fade" mode="out-in">
        <div
          :key="currentSlide"
          class="absolute inset-0"
        >
          <!-- 🔧 Substitua pelos src reais das fotos -->
          <!-- <img :src="slides[currentSlide].src" class="w-full h-full object-cover" /> -->
          <div
            class="w-full h-full"
            :class="slides[currentSlide].bg"
          />
        </div>
      </Transition>
    </div>

    <!-- Overlay escuro lateral -->
    <div class="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-900/30 to-transparent pointer-events-none" />

    <!-- CONTEÚDO -->
    <div class="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 md:px-10 pb-20 md:pb-28">

      <div class="max-w-2xl fade-up">

        <!-- Label -->
        <div class="flex items-center gap-4 mb-6">
          <div class="kente-bar-thin w-10" />
          <span class="section-label text-gold-400">Templo Umbandista</span>
        </div>

        <!-- Título principal -->
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6">
          Terreiro<br>
          <span class="text-gold-400 italic">Ogum</span><br>
          7 Lanças
        </h1>

        <!-- Subtítulo -->
        <p class="text-base md:text-xl text-ink-200 leading-relaxed mb-10 max-w-md fade-up fade-up-delay-1">
          ⚔️ Umbanda, cultura negra de terreiro.<br>
          Sr. Ogum Sete Lanças e Pai João de Aruanda.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-4 fade-up fade-up-delay-2">
          <a href="#sobre" class="btn-primary">
            Conheça o Terreiro
          </a>
          <NuxtLink to="/arrecadacao" class="btn-outline border-white/40 text-white hover:bg-white hover:text-ink-900">
            Apoiar a Campanha 💛
          </NuxtLink>
        </div>
      </div>

      <!-- Indicadores de slide -->
      <div class="absolute right-8 md:right-12 bottom-20 flex flex-col gap-2">
        <button
          v-for="(_, i) in slides"
          :key="i"
          @click="currentSlide = i"
          class="w-1 rounded-full transition-all duration-300"
          :class="currentSlide === i ? 'h-8 bg-gold-400' : 'h-3 bg-white/30'"
          :aria-label="`Slide ${i + 1}`"
        />
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 fade-up fade-up-delay-3">
      <span class="text-[0.6rem] uppercase tracking-widest3">Role</span>
      <div class="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
    </div>

    <!-- Faixa kente inferior -->
    <div class="absolute bottom-0 left-0 right-0 kente-bar" />
  </section>
</template>

<script setup lang="ts">
// 🔧 Quando tiver fotos reais, substitua os bg por src de imagens
const slides = [
  { bg: 'bg-gradient-to-br from-ink-800 via-ink-900 to-crimson-900/30' },
  { bg: 'bg-gradient-to-br from-crimson-900/40 via-ink-900 to-ink-800' },
  { bg: 'bg-gradient-to-br from-ink-900 via-ink-800 to-gold-900/20' },
]

const currentSlide = ref(0)

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.2s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}
</style>
