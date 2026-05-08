<template>
  <div>
    <!-- RESUMO -->
    <div class="grid grid-cols-3 gap-[3px] mb-10">
      <div class="bg-ink-800 border border-ink-700 p-5 text-center">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalCobertos }}</div>
        <div class="font-mono text-[9px] uppercase tracking-widest text-ink-400 mt-1">Itens cobertos</div>
      </div>
      <div class="bg-ink-800 border border-ink-700 p-5 text-center">
        <div class="font-serif text-3xl font-black text-gold-400">{{ ITEMS_LIST.length - totalCobertos }}</div>
        <div class="font-mono text-[9px] uppercase tracking-widest text-ink-400 mt-1">Pendentes</div>
      </div>
      <div class="bg-ink-800 border border-ink-700 p-5 text-center">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalColaboradores }}</div>
        <div class="font-mono text-[9px] uppercase tracking-widest text-ink-400 mt-1">Colaboradores</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-16 bg-ink-800 animate-pulse" />
    </div>

    <!-- Grupos de itens -->
    <template v-else>
      <div
        v-for="[groupName, items] in groupedItems"
        :key="groupName"
        class="mb-10"
      >
        <!-- Título do grupo -->
        <div class="flex items-center gap-3 mb-3">
          <h3 class="font-serif text-xl font-bold text-white">{{ groupName }}</h3>
          <div class="flex-1 h-px bg-ink-700" />
        </div>

        <!-- Cards de itens -->
        <div class="flex flex-col gap-[3px]">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-card"
            :class="{ complete: contribsForItem(item.id).length > 0 }"
          >
            <!-- Barra lateral de status -->
            <div
              class="item-status-bar"
              :class="{
                'bg-green-500':    contribsForItem(item.id).length > 0,
                'bg-ink-600':      contribsForItem(item.id).length === 0,
              }"
            />

            <!-- Header clicável -->
            <div class="item-header" @click="toggleForm(item.id)">
              <div class="item-info flex-1 min-w-0 p-4">
                <div class="font-serif text-base font-bold text-white">{{ item.name }}</div>
                <div class="font-mono text-[10px] text-ink-400 mt-0.5">Meta: {{ item.meta }}</div>

                <!-- Chips de contribuidores -->
                <div v-if="contribsForItem(item.id).length > 0" class="flex flex-wrap gap-1.5 mt-2">
                  <span
                    v-for="c in contribsForItem(item.id)"
                    :key="c.id"
                    class="font-mono text-[9px] px-2 py-0.5 border border-green-500/50 text-green-400 bg-green-500/10"
                  >✓ {{ c.nome }} · {{ c.qty }}</span>
                </div>

                <div v-if="contribsForItem(item.id).length > 0" class="mt-1.5">
                  <span class="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-green-400 border border-green-500/40 px-2 py-0.5 bg-green-500/10">
                    ✓ Item coberto
                  </span>
                </div>
              </div>

              <!-- Qtd de contribuições + botão -->
              <div class="flex items-center shrink-0 border-l border-ink-700">
                <div class="px-4 text-center hidden sm:block">
                  <div class="font-serif text-lg font-black" :class="contribsForItem(item.id).length > 0 ? 'text-green-400' : 'text-ink-600'">
                    {{ contribsForItem(item.id).length > 0 ? '✓' : '—' }}
                  </div>
                  <div class="font-mono text-[9px] text-ink-500">{{ contribsForItem(item.id).length }} contrib.</div>
                </div>
                <button
                  class="item-add-btn"
                  :class="{ 'text-green-400': contribsForItem(item.id).length > 0 }"
                  :title="openForm === item.id ? 'Fechar' : 'Adicionar contribuição'"
                >
                  {{ openForm === item.id ? '✕' : '＋' }}
                </button>
              </div>
            </div>

            <!-- Formulário inline -->
            <Transition name="slide-down">
              <div v-if="openForm === item.id" class="item-form">
                <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Seu nome</label>
                    <input
                      :ref="el => { if(el) nameInputs[item.id] = el as HTMLInputElement }"
                      v-model="formNome"
                      class="contrib-input"
                      type="text"
                      placeholder="Ex: Maria"
                      maxlength="60"
                      @keydown.enter="addContrib(item.id)"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Quantidade</label>
                    <input
                      v-model="formQty"
                      class="contrib-input"
                      type="text"
                      placeholder="Ex: 500gr / 1 pacote"
                      maxlength="40"
                      @keydown.enter="addContrib(item.id)"
                    />
                  </div>
                  <button
                    class="contrib-btn self-end"
                    :disabled="savingContrib"
                    @click="addContrib(item.id)"
                  >
                    {{ savingContrib ? '...' : 'Confirmar ✓' }}
                  </button>
                </div>

                <!-- Lista de contribuições existentes -->
                <div v-if="contribsForItem(item.id).length" class="flex flex-col gap-1 mt-3">
                  <div
                    v-for="c in contribsForItem(item.id)"
                    :key="c.id"
                    class="flex items-center justify-between bg-ink-800 px-3 py-2 border border-ink-700"
                  >
                    <span class="text-sm text-white font-medium">{{ c.nome }}</span>
                    <div class="flex items-center gap-3">
                      <span class="font-mono text-xs text-green-400">{{ c.qty }}</span>
                      <button
                        class="text-ink-600 hover:text-crimson-400 transition-colors text-base leading-none"
                        @click="removeContrib(c.id!)"
                        title="Remover"
                      >✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Lista de materiais do Terreiro
const ITEMS_LIST = [
  { id:'vela-branca',       group:'Velas',         name:'Vela Branca',                    meta:'1 kg' },
  { id:'vela-vermelha',     group:'Velas',         name:'Vela Vermelha',                  meta:'1 kg' },
  { id:'vela-preta',        group:'Velas',         name:'Vela Preta',                     meta:'2 kg' },
  { id:'vela-azul',         group:'Velas',         name:'Vela Azul Clara',                meta:'500 gr' },
  { id:'vela-bi-rosa-azul', group:'Velas Bicolor', name:'Vela Bicolor Rosa / Azul',       meta:'500 gr' },
  { id:'vela-bi-bra-pre',   group:'Velas Bicolor', name:'Vela Bicolor Branca / Preta',    meta:'1 kg' },
  { id:'vela-bi-bra-ver',   group:'Velas Bicolor', name:'Vela Bicolor Branca / Vermelha', meta:'1 kg' },
  { id:'vela-bi-bra-azu',   group:'Velas Bicolor', name:'Vela Bicolor Branca / Azul',     meta:'500 gr' },
  { id:'vela-bi-bra-vrd',   group:'Velas Bicolor', name:'Vela Bicolor Branca / Verde',    meta:'500 gr' },
  { id:'dende',             group:'Outros Itens',  name:'Dendê',                          meta:'4 L' },
  { id:'saco-lixo',         group:'Outros Itens',  name:'Saco de Lixo 100L',              meta:'1 pacote' },
  { id:'papel-toalha',      group:'Outros Itens',  name:'Papel Toalha Interfolhada',      meta:'1 pacote' },
  { id:'gin',               group:'Bebidas',       name:'Gin Tradicional',                meta:'quantidade livre' },
  { id:'whisky',            group:'Bebidas',       name:'Whisky',                         meta:'quantidade livre' },
  { id:'espumante',         group:'Bebidas',       name:'Espumante / Champanhe',          meta:'quantidade livre' },
]

const { contribuicoes, loading, subscribe, unsubscribeAll, addContribuicao, deleteContribuicao } = useContribuicoes()

// Agrupar itens por categoria
const groupedItems = computed<[string, typeof ITEMS_LIST][]>(() => {
  const map = new Map<string, typeof ITEMS_LIST>()
  ITEMS_LIST.forEach(item => {
    if (!map.has(item.group)) map.set(item.group, [])
    map.get(item.group)!.push(item)
  })
  return [...map.entries()]
})

// Contribuições por item
function contribsForItem(itemId: string) {
  return contribuicoes.value.filter(c => c.itemId === itemId)
}

// Resumo
const totalCobertos = computed(() => ITEMS_LIST.filter(i => contribsForItem(i.id).length > 0).length)
const totalColaboradores = computed(() => new Set(contribuicoes.value.map(c => c.nome)).size)

// Formulário inline
const openForm      = ref<string|null>(null)
const formNome      = ref('')
const formQty       = ref('')
const savingContrib = ref(false)
const nameInputs    = ref<Record<string, HTMLInputElement>>({})

function toggleForm(itemId: string) {
  if (openForm.value === itemId) {
    openForm.value = null
  } else {
    openForm.value = itemId
    formNome.value = ''
    formQty.value  = ''
    nextTick(() => nameInputs.value[itemId]?.focus())
  }
}

async function addContrib(itemId: string) {
  if (!formNome.value.trim()) { alert('Coloque seu nome!'); return }
  if (!formQty.value.trim())  { alert('Coloque a quantidade!'); return }
  savingContrib.value = true
  try {
    await addContribuicao({ itemId, nome: formNome.value.trim(), qty: formQty.value.trim() })
    formNome.value = ''
    formQty.value  = ''
    openForm.value = null
  } finally {
    savingContrib.value = false
  }
}

async function removeContrib(id: string) {
  if (!confirm('Remover esta contribuição?')) return
  await deleteContribuicao(id)
}

onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.item-card {
  @apply flex bg-ink-800 border border-ink-700 overflow-hidden transition-colors duration-200 hover:border-gold-400/20;
}
.item-card.complete { @apply border-green-500/30; }
.item-status-bar    { @apply w-[3px] shrink-0 transition-colors duration-300; }
.item-header        { @apply flex flex-1 cursor-pointer items-stretch; }
.item-add-btn {
  @apply w-12 flex items-center justify-center text-gold-400 text-xl transition-all duration-200 border-l border-ink-700 hover:bg-gold-400/10;
}

.item-form {
  @apply border-t border-ink-700 p-4 bg-ink-900;
}

.contrib-label { @apply font-mono text-[9px] uppercase tracking-widest text-gold-400; }
.contrib-input {
  @apply bg-ink-800 border border-ink-600 text-white text-sm px-3 py-2 outline-none w-full transition-colors duration-200 focus:border-green-500;
}
.contrib-btn {
  @apply bg-green-600 text-white border-none font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-green-500 whitespace-nowrap;
}
.contrib-btn:disabled { @apply opacity-50 cursor-not-allowed; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; max-height: 400px; }
.slide-down-enter-from, .slide-down-leave-to       { max-height: 0; opacity: 0; }
</style>
