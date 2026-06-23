<template>
  <section id="conquistas" class="py-24 md:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- TÍTULO -->
      <div class="mb-16 md:mb-20">
        <div class="flex items-center gap-3 mb-5">
          <div class="kente-bar-thin w-8" />
          <span class="section-label">Projetos & Ações</span>
        </div>
        <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-ink-800 leading-tight">
          Nossas<br>
          <span class="text-gold-400 italic">Conquistas</span>
        </h2>
      </div>

      <!-- GRID DE AÇÕES - estilo Aruanda -->
      <div class="space-y-0">
        <div
          v-for="(acao, i) in acoes"
          :key="acao.id"
          class="group grid grid-cols-1 md:grid-cols-2 border-t border-brand-200 hover:bg-ink-100 transition-colors duration-300"
          :class="i === acoes.length - 1 ? 'border-b' : ''"
        >
          <!-- Foto -->
          <div
            class="aspect-[4/3] overflow-hidden"
            :class="i % 2 === 1 ? 'md:order-2' : ''"
          >
            <!-- 🔧 Substitua por <img :src="acao.imagem" :alt="acao.titulo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> -->
            <div
              class="w-full h-full flex items-center justify-center"
              :class="acao.bg"
            >
              <span class="text-ink-400 text-sm uppercase tracking-widest">{{ acao.titulo }}</span>
            </div>
          </div>

          <!-- Texto -->
          <div
            class="p-8 md:p-12 flex flex-col justify-center"
            :class="i % 2 === 1 ? 'md:order-1' : ''"
          >
            <span class="section-label mb-4">{{ acao.categoria }}</span>
            <h3 class="font-serif text-2xl md:text-3xl font-bold text-ink-800 mb-4">
              {{ acao.titulo }}
            </h3>

            <!-- Accordion -->
            <div>
              <button
                @click="toggleAcao(acao.id)"
                class="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-600 transition-colors duration-200 mb-3"
              >
                <span>{{ expanded === acao.id ? 'Fechar' : 'O que é?' }}</span>
                <span class="transition-transform duration-300" :class="expanded === acao.id ? 'rotate-45' : ''">+</span>
              </button>

              <Transition name="accordion">
                <div v-if="expanded === acao.id" class="overflow-hidden">
                  <p class="text-ink-500 leading-relaxed text-sm md:text-base pb-4">
                    {{ acao.descricao }}
                  </p>
                </div>
              </Transition>
            </div>

            <div class="mt-4 pt-4 border-t border-brand-200">
              <span class="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                ⚡ {{ acao.proposito }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const expanded = ref<number | null>(null)

const toggleAcao = (id: number) => {
  expanded.value = expanded.value === id ? null : id
}

const acoes = [
  {
    id: 1,
    categoria: 'Educação',
    titulo: 'Encruzilhada e Saberes',
    proposito: 'Conhecimento para a comunidade',
    descricao: 'Nea onnim no sua a, ohu — "Aquele que não sabe, pode saber aprendendo!" Este é o lema que traduz nossos encontros. O Terreiro traz para toda a comunidade um espaço de troca de saberes, conhecimentos e experiências que nos formam como seres e sociedade, potencializando nosso povo de forma política, social e espiritual.',
    imagem: '/images/saberes.jpg',
    bg: 'bg-ink-100',
  },
  // 🔧 Adicione mais ações aqui
]
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
