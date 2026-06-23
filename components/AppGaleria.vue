<template>
  <section id="galeria" class="py-24 md:py-28 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- CABEÇALHO -->
      <div class="flex items-end justify-between mb-12">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="kente-bar-thin w-8" />
            <span class="section-label text-gold-400">Nossa Jornada</span>
          </div>
          <h2 class="font-serif text-4xl md:text-5xl font-black text-ink-800">
            Momentos<br>
            <span class="text-gold-400 italic">de Axé</span>
          </h2>
        </div>

        <!-- Controles -->
        <div class="flex gap-2">
          <button
            @click="prev"
            class="w-12 h-12 border border-gold-400/40 text-gold-400 hover:bg-gold-400 hover:text-ink-900 transition-all duration-200 flex items-center justify-center text-lg"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            @click="next"
            class="w-12 h-12 border border-gold-400/40 text-gold-400 hover:bg-gold-400 hover:text-ink-900 transition-all duration-200 flex items-center justify-center text-lg"
            aria-label="Próximo"
          >
            →
          </button>
        </div>
      </div>

      <!-- CARROSSEL -->
      <div
        class="relative overflow-hidden rounded-none"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <a
            v-for="(slide, i) in slides"
            :key="i"
            href="https://www.instagram.com/terreiro7lancas/"
            target="_blank"
            rel="noopener noreferrer"
            class="min-w-full aspect-[16/9] md:aspect-[21/9] block overflow-hidden relative group"
          >
            <!-- 🔧 Substitua por <img :src="slide.src" :alt="slide.alt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> -->
            <div
              class="w-full h-full flex items-center justify-center"
              :class="slide.bg"
            >
              <span class="text-ink-400/60 text-sm uppercase tracking-widest">{{ slide.alt }}</span>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-brand-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>
      </div>

      <!-- Indicadores e link -->
      <div class="flex items-center justify-between mt-6">
        <div class="flex gap-2">
          <button
            v-for="(_, i) in slides"
            :key="i"
            @click="currentIndex = i"
            class="h-1 rounded-full transition-all duration-300"
            :class="currentIndex === i ? 'w-8 bg-gold-400' : 'w-3 bg-ink-200'"
            :aria-label="`Slide ${i + 1}`"
          />
        </div>

        <a
          href="https://www.instagram.com/terreiro7lancas/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-200 transition-colors duration-200 font-mono"
        >
          Seguir @terreiro7lancas ↗
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const slides = [
  { alt: 'Gira de Ogum',          src: '/images/insta1.jpg', bg: 'bg-ink-100' },
  { alt: 'Estudo coletivo',        src: '/images/insta2.jpg', bg: 'bg-ink-200' },
  { alt: 'Evento comunitário',     src: '/images/insta3.jpg', bg: 'bg-ink-100' },
  { alt: 'Trabalho espiritual',    src: '/images/insta4.jpg', bg: 'bg-ink-200' },
  { alt: 'Convívio da comunidade', src: '/images/insta5.jpg', bg: 'bg-ink-100' },
  { alt: 'Nós',                    src: '/images/nos.jpg',    bg: 'bg-ink-200' },
]

const currentIndex = ref(0)
const touchStartX = ref<number | null>(null)

let autoplay: ReturnType<typeof setInterval>

const next = () => { currentIndex.value = (currentIndex.value + 1) % slides.length }
const prev = () => { currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length }

const onTouchStart = (e: TouchEvent) => { touchStartX.value = e.touches[0].clientX }
const onTouchEnd = (e: TouchEvent) => {
  if (touchStartX.value === null) return
  const dx = e.changedTouches[0].clientX - touchStartX.value
  if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
  touchStartX.value = null
}

onMounted(() => { autoplay = setInterval(next, 5000) })
onUnmounted(() => clearInterval(autoplay))
</script>
