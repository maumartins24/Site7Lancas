<template>
  <section id="rifas" class="py-24 md:py-28 bg-ink-50 dark:bg-ink-900">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- CABEÇALHO -->
      <div class="mb-16">
        <div class="flex items-center gap-3 mb-5">
          <div class="kente-bar-thin w-8" />
          <span class="section-label">Apoie e Concorra</span>
        </div>
        <h2 class="font-serif text-4xl md:text-5xl font-black text-ink-900 dark:text-white leading-tight">
          Rifas &<br>
          <span class="text-gold-400 italic">Oportunidades 🎟️</span>
        </h2>
        <p class="mt-5 text-ink-600 dark:text-ink-300 max-w-xl text-base md:text-lg leading-relaxed">
          Participe das nossas rifas internas e ajude a fortalecer o Terreiro enquanto concorre a prêmios especiais.
        </p>
      </div>

      <!-- GRID DE RIFAS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div
          v-for="rifa in rifas"
          :key="rifa.id"
          class="relative bg-white dark:bg-ink-800 border"
          :class="rifa.ativa
            ? 'border-gold-400/40 hover:border-gold-400'
            : 'border-ink-100 dark:border-ink-700 opacity-70'"
        >
          <!-- Faixa lateral -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1"
            :class="rifa.ativa ? 'bg-gold-400' : 'bg-ink-300 dark:bg-ink-600'"
          />

          <div class="p-7 pl-8">
            <!-- Status -->
            <div class="flex items-center gap-2 mb-5">
              <span
                class="text-[0.6rem] uppercase tracking-widest px-2.5 py-1 font-mono font-bold"
                :class="rifa.ativa
                  ? 'bg-ink-900 dark:bg-gold-400/10 text-gold-400 border border-gold-400/30'
                  : 'bg-ink-100 dark:bg-ink-700 text-ink-400'"
              >
                {{ rifa.ativa ? '● Ativa' : '◌ Em breve' }}
              </span>
            </div>

            <h3 class="font-serif text-2xl font-bold text-ink-900 dark:text-white mb-2">
              {{ rifa.titulo }}
            </h3>
            <p class="text-sm text-ink-500 dark:text-ink-400 mb-6 leading-relaxed">
              {{ rifa.descricao }}
            </p>

            <!-- Detalhes em grid -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div class="p-3 bg-ink-50 dark:bg-ink-900">
                <p class="text-[0.6rem] uppercase tracking-widest text-gold-400 mb-1">Bilhete</p>
                <p class="font-serif font-bold text-ink-900 dark:text-white">{{ rifa.valorBilhete }}</p>
              </div>
              <div class="p-3 bg-ink-50 dark:bg-ink-900">
                <p class="text-[0.6rem] uppercase tracking-widest text-gold-400 mb-1">Encerra</p>
                <p class="font-serif font-bold text-ink-900 dark:text-white text-sm">{{ rifa.dataEncerramento }}</p>
              </div>
            </div>

            <!-- Prêmio -->
            <div class="p-4 border-l-2 border-gold-400 bg-gold-400/5 mb-6">
              <p class="text-[0.6rem] uppercase tracking-widest text-gold-400 mb-1">🏆 Prêmio</p>
              <p class="font-semibold text-ink-900 dark:text-white">{{ rifa.premio }}</p>
            </div>

            <!-- Progresso -->
            <div class="mb-6">
              <div class="flex justify-between text-xs text-ink-400 mb-2">
                <span>{{ rifa.numerosVendidos }} bilhetes</span>
                <span>{{ porcentagem(rifa) }}%</span>
              </div>
              <div class="h-1 bg-ink-100 dark:bg-ink-700">
                <div
                  class="h-1 bg-gold-400 transition-all duration-700"
                  :style="{ width: `${porcentagem(rifa)}%` }"
                />
              </div>
              <p class="text-xs text-ink-400 mt-1.5">de {{ rifa.totalNumeros }} números</p>
            </div>

            <!-- Botão -->
            <a
              v-if="rifa.ativa"
              href="https://www.instagram.com/terreiro7lancas/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary w-full justify-center text-xs"
            >
              Quero participar ↗
            </a>
            <button
              v-else
              disabled
              class="w-full py-3 text-xs uppercase tracking-widest text-ink-400 border border-ink-200 dark:border-ink-700 cursor-not-allowed font-mono"
            >
              Em breve
            </button>
          </div>
        </div>
      </div>

      <p class="mt-10 text-xs text-ink-400 dark:text-ink-600">
        Rifas organizadas internamente pelo Terreiro. Dúvidas? Fale conosco no Instagram.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Rifa {
  id: number
  titulo: string
  descricao: string
  valorBilhete: string
  premio: string
  dataEncerramento: string
  ativa: boolean
  totalNumeros: number
  numerosVendidos: number
}

// 🔧 Substituir pelos dados reais das rifas
const rifas: Rifa[] = [
  {
    id: 1,
    titulo: 'Rifa do Mês',
    descricao: 'Descrição da rifa — preencher com informações reais.',
    valorBilhete: 'R$ --',
    premio: 'Prêmio a definir',
    dataEncerramento: '--/--/----',
    ativa: true,
    totalNumeros: 100,
    numerosVendidos: 0,
  },
  {
    id: 2,
    titulo: 'Próxima Rifa',
    descricao: 'Em breve uma nova oportunidade de apoiar o Terreiro.',
    valorBilhete: 'R$ --',
    premio: 'Em breve',
    dataEncerramento: '--/--/----',
    ativa: false,
    totalNumeros: 100,
    numerosVendidos: 0,
  },
]

const porcentagem = (rifa: Rifa) =>
  rifa.totalNumeros > 0 ? Math.round((rifa.numerosVendidos / rifa.totalNumeros) * 100) : 0
</script>
