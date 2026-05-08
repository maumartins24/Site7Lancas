<template>
  <section id="lojinha" class="py-24 md:py-32 bg-white dark:bg-ink-900">
    <div class="max-w-7xl mx-auto px-6 md:px-10">

      <!-- CABEÇALHO EDITORIAL -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-end mb-16">
        <div>
          <div class="flex items-center gap-3 mb-5">
            <div class="kente-bar-thin w-8" />
            <span class="section-label">Produtos do Terreiro</span>
          </div>
          <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-ink-900 dark:text-white leading-tight">
            Nossa<br>
            <span class="text-gold-400 italic">Lojinha 🌿</span>
          </h2>
        </div>
        <p class="text-base md:text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
          Itens selecionados com axé — cada compra apoia diretamente o Terreiro.
          <!-- 🔧 Fotos com: Yasmin · Rose · Fernanda -->
        </p>
      </div>

      <!-- GRID DE PRODUTOS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-100 dark:bg-ink-800">
        <div
          v-for="produto in produtos"
          :key="produto.id"
          class="group bg-white dark:bg-ink-900 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors duration-300"
          :class="{ 'opacity-50': !produto.disponivel }"
        >
          <!-- Foto -->
          <div class="aspect-square overflow-hidden relative">
            <!-- 🔧 Substitua por <img :src="produto.imagem" :alt="produto.nome" class="..." /> -->
            <div class="w-full h-full bg-ink-50 dark:bg-ink-800 flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500">
              <svg class="w-10 h-10 text-ink-300 dark:text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-xs text-ink-300 dark:text-ink-600 uppercase tracking-widest">Foto em breve</p>
            </div>

            <!-- Badge disponibilidade -->
            <div
              class="absolute top-3 right-3 text-[0.6rem] uppercase tracking-wider px-2 py-1 font-mono"
              :class="produto.disponivel
                ? 'bg-ink-900 text-gold-400'
                : 'bg-ink-100 dark:bg-ink-800 text-ink-400'"
            >
              {{ produto.disponivel ? 'Disponível' : 'Esgotado' }}
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <div class="kente-bar-thin w-full mb-4 opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 class="font-serif font-bold text-ink-900 dark:text-white text-lg mb-1">
              {{ produto.nome }}
            </h3>
            <p class="text-xs text-ink-500 dark:text-ink-400 leading-relaxed mb-4">
              {{ produto.descricao }}
            </p>
            <div class="flex items-center justify-between">
              <span class="font-serif text-2xl font-black text-gold-400">{{ produto.preco }}</span>
              <a
                v-if="produto.disponivel"
                href="https://www.instagram.com/terreiro7lancas/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs uppercase tracking-wider text-ink-600 dark:text-ink-300 hover:text-gold-400 transition-colors duration-200 font-mono"
              >
                Encomendar ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Rodapé -->
      <div class="mt-10 text-center">
        <a
          href="https://www.instagram.com/terreiro7lancas/"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-outline border-ink-300 dark:border-ink-600 text-ink-700 dark:text-ink-300"
        >
          Ver mais no Instagram ↗
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// 🔧 Substitua pelos produtos reais com fotos de Yasmin / Rose / Fernanda
const produtos = [
  { id: 1, nome: 'Item da Semana', descricao: 'Descrição do produto — preencher com Yasmin · Rose · Fernanda', preco: 'R$ --', disponivel: true },
  { id: 2, nome: 'Item da Semana', descricao: 'Descrição do produto — preencher com Yasmin · Rose · Fernanda', preco: 'R$ --', disponivel: true },
  { id: 3, nome: 'Item da Semana', descricao: 'Descrição do produto — preencher com Yasmin · Rose · Fernanda', preco: 'R$ --', disponivel: true },
  { id: 4, nome: 'Item da Semana', descricao: 'Descrição do produto — preencher com Yasmin · Rose · Fernanda', preco: 'R$ --', disponivel: false },
]
</script>
