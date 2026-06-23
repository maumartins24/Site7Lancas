<template>
  <section id="arrecadacao" class="py-24 md:py-32 bg-white relative overflow-hidden">

    <!-- Padrão geométrico -->
    <div class="absolute inset-0 adinkra-bg pointer-events-none opacity-40" />
    <div class="absolute top-0 left-0 right-0 kente-bar" />
    <div class="absolute bottom-0 left-0 right-0 kente-bar" />

    <div class="relative max-w-7xl mx-auto px-6 md:px-10">

      <!-- LABEL -->
      <div class="flex items-center gap-3 mb-8">
        <div class="kente-bar-thin w-8" />
        <span class="section-label text-gold-400">Campanha de Arrecadação</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

        <!-- ESQUERDA: Texto e barra de progresso -->
        <div>
          <h2 class="font-serif text-4xl md:text-5xl font-black text-ink-800 leading-tight mb-6">
            Terreiro Ogum 7 Lanças<br>
            <span class="text-gold-400 italic">está de mudança</span>
          </h2>

          <p class="text-lg text-ink-600 leading-relaxed mb-4">
            A potência do nosso axé continua a mesma, mas agora em um espaço novo e maior. Para reabrirmos os trabalhos, precisamos da força de quem acredita na nossa caminhada.
          </p>
          <p class="text-sm text-ink-500 mb-10">
            Se não puder doar agora, compartilhar a campanha já nos ajuda demais. 💛
          </p>

          <!-- CARD DE PROGRESSO -->
          <div class="bg-ink-100 border border-brand-200 p-7 space-y-6">

            <div>
              <p class="font-serif text-4xl font-black text-gold-400">R$ 1.305</p>
              <p class="text-ink-500 text-sm mt-1">
                arrecadados da meta de <span class="text-ink-800 font-semibold">R$ 22.700</span>
              </p>
            </div>

            <!-- Barra -->
            <div>
              <div class="h-2 bg-ink-200">
                <div class="h-2 bg-gold-400 transition-all duration-700" style="width: 6%" />
              </div>
              <div class="kente-bar-thin w-full mt-1 opacity-40" />
            </div>

            <!-- Métricas -->
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="font-serif text-2xl font-black text-gold-400">6%</p>
                <p class="text-ink-500 text-xs uppercase tracking-wider">da meta 1/3</p>
              </div>
              <div>
                <p class="font-serif text-2xl font-black text-gold-400">23</p>
                <p class="text-ink-500 text-xs uppercase tracking-wider">Benfeitores</p>
              </div>
              <div>
                <p class="font-serif text-2xl font-black text-gold-400">52d</p>
                <p class="text-ink-500 text-xs uppercase tracking-wider">Restantes</p>
              </div>
            </div>

            <!-- Botões -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                :href="VAQUINHA_URL"
                target="_blank"
                rel="noreferrer"
                class="btn-primary flex-1 justify-center text-sm"
              >
                Apoiar a Campanha 💛
              </a>
              <button
                @click="copyPix"
                class="btn-outline border-green-500 text-green-400 hover:bg-green-600 hover:text-white flex-1 justify-center text-sm"
              >
                {{ copied ? '✓ Copiado!' : 'Pix Copia e Cola' }}
              </button>
            </div>

            <!-- Chave PIX -->
            <div class="text-xs text-ink-500 border-t border-brand-200 pt-4">
              <p>Chave PIX (CNPJ): <span class="font-mono text-ink-800">{{ PIX_KEY }}</span></p>
              <Transition name="fade">
                <p v-if="copied" class="text-green-400 mt-1">✓ Chave PIX copiada!</p>
              </Transition>
            </div>
          </div>
        </div>

        <!-- DIREITA: Vídeo stories -->
        <div class="space-y-6">
          <div class="bg-ink-100 border border-brand-200 p-4">
            <p class="section-label text-gold-400 mb-4">Cada doação é axé!</p>
            <div class="relative w-full rounded-none overflow-hidden bg-black" style="aspect-ratio: 9/16">
              <iframe
                src="https://www.youtube.com/embed/w99_4T0MGjw?autoplay=1&mute=1&playsinline=1&loop=1&playlist=w99_4T0MGjw"
                title="Campanha de doação — Terreiro Ogum 7 Lanças"
                class="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
          </div>

          <!-- Post Instagram -->
          <div class="bg-ink-100 border border-brand-200 p-6">
            <p class="section-label text-gold-400 mb-3">Instagram</p>
            <p class="text-ink-800 font-serif text-lg font-bold mb-2">Veja o post oficial da campanha</p>
            <p class="text-sm text-ink-500 mb-5 leading-relaxed">
              Comentar, salvar e compartilhar ajuda a mensagem a chegar em mais pessoas.
            </p>
            <a
              href="https://www.instagram.com/p/DRKcSICDuz3/"
              target="_blank"
              rel="noreferrer"
              class="btn-outline border-pink-500/50 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 text-xs"
            >
              Abrir post no Instagram ↗
            </a>
          </div>
        </div>
      </div>

      <!-- COMO AJUDAR -->
      <div class="mt-20 border-t border-gold-400/20 pt-16">
        <h3 class="font-serif text-2xl md:text-3xl font-bold text-ink-800 mb-10">Como você pode ajudar:</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-200">
          <div
            v-for="(passo, i) in passos"
            :key="i"
            class="bg-white p-8 hover:bg-ink-100 transition-colors duration-300"
          >
            <p class="font-serif text-5xl font-black text-brand-200 mb-4">0{{ i + 1 }}</p>
            <h4 class="font-serif font-bold text-ink-800 mb-2">{{ passo.titulo }}</h4>
            <p class="text-sm text-ink-500 leading-relaxed">{{ passo.texto }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const VAQUINHA_URL = 'https://l.instagram.com/?u=https%3A%2F%2Fbenfeitoria.com%2Fprojeto%2Fterreiroogum7lancasestademudanca22ze'
const PIX_KEY = '24249075/0001-79'
const copied = ref(false)

const copyPix = async () => {
  try {
    await navigator.clipboard.writeText(PIX_KEY)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {
    alert(`Chave PIX (CNPJ): ${PIX_KEY}`)
  }
}

const passos = [
  { titulo: 'Faça uma doação', texto: 'Qualquer valor é bem-vindo. Acesse a vaquinha ou use o PIX.' },
  { titulo: 'Compartilhe', texto: 'Envie o link da campanha e o post do Instagram para amigos e família.' },
  { titulo: 'Fortaleça o Terreiro', texto: 'Participe das giras, encontros, rifas e atividades.' },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
