<template>
  <div>

    <!-- ══ RESUMO ══ -->
    <div class="grid grid-cols-3 gap-[3px] mb-10">
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalCobertos }}</div>
        <div class="summary-label">Itens cobertos</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ ITEMS_LIST.length - totalCobertos }}</div>
        <div class="summary-label">Pendentes</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalColaboradores }}</div>
        <div class="summary-label">Colaboradores</div>
      </div>
    </div>

    <!-- ══ LOADING ══ -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-16 bg-ink-800 animate-pulse" />
    </div>

    <!-- ══ LISTA DE ITENS ══ -->
    <template v-else>
      <div v-for="[groupName, items] in groupedItems" :key="groupName" class="mb-10">

        <!-- Título do grupo -->
        <div class="flex items-center gap-3 mb-3">
          <h3 class="font-serif text-xl font-bold text-white">{{ groupName }}</h3>
          <div class="flex-1 h-px bg-ink-700" />
        </div>

        <div class="flex flex-col gap-[3px]">
          <div
            v-for="item in items" :key="item.id"
            class="item-card"
            :class="{ complete: contribsForItem(item.id).length > 0 }"
          >
            <!-- Barra lateral de status -->
            <div class="item-status-bar"
              :class="contribsForItem(item.id).length > 0 ? 'bg-green-500' : 'bg-ink-600'" />

            <!-- Header -->
            <div class="item-header" @click="toggleForm(item.id)">
              <div class="flex-1 min-w-0 p-4">
                <div class="font-serif text-base font-bold text-white">{{ item.name }}</div>
                <div class="font-mono text-[10px] text-ink-400 mt-0.5">Meta: {{ item.meta }}</div>

                <!-- Chips de contribuidores -->
                <div v-if="contribsForItem(item.id).length" class="flex flex-wrap gap-1.5 mt-2">
                  <span
                    v-for="c in contribsForItem(item.id)" :key="c.id"
                    class="font-mono text-[9px] px-2 py-0.5 border border-green-500/50 text-green-400 bg-green-500/10"
                  >✓ {{ c.nome }} · {{ c.qty }}</span>
                </div>

                <div v-if="contribsForItem(item.id).length" class="mt-1.5">
                  <span class="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-green-400 border border-green-500/40 px-2 py-0.5 bg-green-500/10">
                    ✓ Item coberto
                  </span>
                </div>
              </div>

              <!-- Contador + botão -->
              <div class="flex items-center shrink-0 border-l border-ink-700">
                <div class="px-4 text-center hidden sm:block">
                  <div class="font-serif text-lg font-black" :class="contribsForItem(item.id).length ? 'text-green-400' : 'text-ink-600'">
                    {{ contribsForItem(item.id).length ? '✓' : '—' }}
                  </div>
                  <div class="font-mono text-[9px] text-ink-500">{{ contribsForItem(item.id).length }} contrib.</div>
                </div>
                <button class="item-add-btn" :class="{ 'text-green-400': contribsForItem(item.id).length }">
                  {{ openForm === item.id ? '✕' : '＋' }}
                </button>
              </div>
            </div>

            <!-- Formulário inline (comunidade) -->
            <Transition name="slide-down">
              <div v-if="openForm === item.id" class="item-form">

                <!-- Adicionar nova contribuição -->
                <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Seu nome</label>
                    <input
                      :ref="el => { if(el) nameInputs[item.id] = el as HTMLInputElement }"
                      v-model="formNome" class="contrib-input" type="text"
                      placeholder="Ex: Maria" maxlength="60"
                      @keydown.enter="addContrib(item.id)"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Quantidade</label>
                    <input
                      v-model="formQty" class="contrib-input" type="text"
                      placeholder="Ex: 500gr / 1 pacote" maxlength="40"
                      @keydown.enter="addContrib(item.id)"
                    />
                  </div>
                  <button class="contrib-btn self-end" :disabled="savingContrib" @click="addContrib(item.id)">
                    {{ savingContrib ? '...' : 'Confirmar ✓' }}
                  </button>
                </div>

                <!-- Lista das contribuições já registradas -->
                <div v-if="contribsForItem(item.id).length" class="flex flex-col gap-1">
                  <div
                    v-for="c in contribsForItem(item.id)" :key="c.id"
                    class="contrib-row"
                  >
                    <!-- Modo visualização -->
                    <template v-if="editingContribId !== c.id">
                      <span class="flex-1 text-sm text-white font-medium truncate">{{ c.nome }}</span>
                      <span class="font-mono text-xs text-green-400 shrink-0 mx-3">{{ c.qty }}</span>
                      <div class="flex gap-1 shrink-0">
                        <button class="icon-btn edit" @click.stop="startEditContrib(c)" title="Editar">✎</button>
                        <button class="icon-btn del"  @click.stop="removeContrib(c.id!)" title="Remover">✕</button>
                      </div>
                    </template>

                    <!-- Modo edição inline -->
                    <template v-else>
                      <input
                        v-model="editNome" class="contrib-input flex-1 text-sm" placeholder="Nome"
                        @keydown.enter="saveEditContrib(c.id!)"
                        @keydown.esc="cancelEdit"
                      />
                      <input
                        v-model="editQty" class="contrib-input w-32 mx-2 text-sm" placeholder="Quantidade"
                        @keydown.enter="saveEditContrib(c.id!)"
                        @keydown.esc="cancelEdit"
                      />
                      <div class="flex gap-1 shrink-0">
                        <button class="icon-btn save" :disabled="savingEdit" @click.stop="saveEditContrib(c.id!)" title="Salvar">✓</button>
                        <button class="icon-btn cancel" @click.stop="cancelEdit" title="Cancelar">✕</button>
                      </div>
                    </template>
                  </div>
                </div>

              </div>
            </Transition>
          </div>
        </div>
      </div>
    </template>

    <!-- ══ MODAL ADMIN ══ -->
    <Transition name="fade">
      <div v-if="adminModal"
        class="fixed inset-0 bg-ink-900/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        @click.self="adminModal = false"
      >
        <div class="bg-ink-800 border border-gold-400/25 w-full max-w-2xl max-h-[92vh] flex flex-col">
          <div class="kente shrink-0" />

          <!-- Header do modal -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-ink-700 shrink-0">
            <h3 class="font-serif text-xl text-white">Gerenciar Contribuições</h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl leading-none">✕</button>
          </div>

          <div class="overflow-y-auto flex-1 p-6">

            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4 max-w-sm mx-auto">
              <p class="text-sm text-ink-400 text-center">Digite a senha para gerenciar contribuições.</p>
              <div v-if="loginError" class="font-mono text-xs text-crimson-400 p-2 border border-crimson-400/30 bg-crimson-400/10">
                Senha incorreta.
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="input-label">Senha</label>
                <input v-model="loginPass" type="password" class="input-field" placeholder="••••••••" @keydown.enter="doLogin" />
              </div>
              <button class="btn-gold w-full" @click="doLogin">Entrar →</button>
            </div>

            <!-- PAINEL ADMIN -->
            <template v-else>

              <!-- Abas -->
              <div class="flex border-b border-ink-700 mb-6">
                <button v-for="t in adminTabs" :key="t.val"
                  class="admin-tab" :class="{ active: adminTab === t.val }"
                  @click="adminTab = t.val; resetAdminForm()">
                  {{ t.label }}
                </button>
              </div>

              <!-- ── ABA: ADICIONAR CONTRIBUIÇÃO ── -->
              <div v-if="adminTab === 'add'" class="flex flex-col gap-4">
                <p class="text-xs text-ink-400">Adicione uma contribuição em nome de alguém da família.</p>

                <!-- Selecionar item -->
                <div class="flex flex-col gap-1.5">
                  <label class="input-label">Item *</label>
                  <select v-model="adminForm.itemId" class="input-field">
                    <option value="" disabled>Selecione o item...</option>
                    <optgroup v-for="[group, items] in groupedItems" :key="group" :label="group">
                      <option v-for="item in items" :key="item.id" :value="item.id">
                        {{ item.name }} ({{ item.meta }})
                      </option>
                    </optgroup>
                  </select>
                </div>

                <!-- Nome + Quantidade -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Nome *</label>
                    <input v-model="adminForm.nome" class="input-field" placeholder="Ex: Maria" maxlength="60" />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Quantidade *</label>
                    <input v-model="adminForm.qty" class="input-field" placeholder="Ex: 1 kg" maxlength="40" />
                  </div>
                </div>

                <button class="btn-gold w-full" :disabled="savingAdmin" @click="adminAddContrib">
                  {{ savingAdmin ? 'Salvando...' : 'Adicionar Contribuição →' }}
                </button>
              </div>

              <!-- ── ABA: TODAS AS CONTRIBUIÇÕES ── -->
              <div v-if="adminTab === 'all'">

                <!-- Filtro por item -->
                <div class="flex gap-2 mb-4">
                  <select v-model="filterItemId" class="input-field flex-1">
                    <option value="">Todos os itens</option>
                    <optgroup v-for="[group, items] in groupedItems" :key="group" :label="group">
                      <option v-for="item in items" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </option>
                    </optgroup>
                  </select>
                  <button
                    v-if="filterItemId"
                    class="font-mono text-[10px] uppercase px-3 border border-ink-600 text-ink-400 hover:border-gold-400 hover:text-gold-400 transition-colors whitespace-nowrap"
                    @click="filterItemId = ''"
                  >Limpar</button>
                </div>

                <!-- Sem contribuições -->
                <div v-if="!filteredContribs.length" class="py-10 text-center text-ink-600 font-mono text-xs uppercase tracking-widest">
                  Nenhuma contribuição encontrada
                </div>

                <!-- Lista agrupada por item -->
                <div v-else class="flex flex-col gap-6">
                  <div v-for="[itemId, contribs] in contribsByItem" :key="itemId">

                    <!-- Nome do item -->
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-[3px] h-4 bg-gold-400 shrink-0" />
                      <span class="font-serif text-sm font-bold text-white">{{ itemName(itemId) }}</span>
                      <span class="font-mono text-[9px] text-ink-500">{{ contribs.length }} contrib.</span>
                    </div>

                    <!-- Contribuições do item -->
                    <div class="flex flex-col gap-[3px]">
                      <div
                        v-for="c in contribs" :key="c.id"
                        class="contrib-admin-row"
                      >
                        <!-- Visualização -->
                        <template v-if="adminEditingId !== c.id">
                          <div class="flex-1 min-w-0">
                            <div class="text-sm text-white font-medium truncate">{{ c.nome }}</div>
                            <div class="font-mono text-[10px] text-green-400 mt-0.5">{{ c.qty }}</div>
                          </div>
                          <div class="flex gap-1.5 shrink-0">
                            <button class="icon-btn edit" @click="startAdminEdit(c)" title="Editar">✎</button>
                            <button class="icon-btn del"  @click="adminRemoveContrib(c.id!)" title="Excluir">✕</button>
                          </div>
                        </template>

                        <!-- Edição inline -->
                        <template v-else>
                          <div class="flex-1 flex flex-col gap-2">
                            <!-- Item (pode mudar para qual item pertence) -->
                            <select v-model="adminEditForm.itemId" class="input-field text-xs py-1.5">
                              <optgroup v-for="[group, items] in groupedItems" :key="group" :label="group">
                                <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
                              </optgroup>
                            </select>
                            <div class="grid grid-cols-2 gap-2">
                              <input v-model="adminEditForm.nome" class="input-field text-sm py-1.5" placeholder="Nome" @keydown.esc="adminEditingId = null" />
                              <input v-model="adminEditForm.qty"  class="input-field text-sm py-1.5" placeholder="Quantidade" @keydown.esc="adminEditingId = null" />
                            </div>
                          </div>
                          <div class="flex gap-1.5 shrink-0 ml-3 self-end">
                            <button class="icon-btn save" :disabled="savingAdminEdit" @click="saveAdminEdit(c.id!)" title="Salvar">✓</button>
                            <button class="icon-btn cancel" @click="adminEditingId = null" title="Cancelar">✕</button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sair -->
              <div class="mt-8 flex justify-end">
                <button @click="doLogout" class="text-ink-600 font-mono text-[10px] hover:text-ink-400 transition-colors">
                  Sair do admin
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Botão flutuante admin -->
    <button
      class="fixed bottom-6 right-6 z-40 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all duration-200"
      :class="isAdmin
        ? 'bg-gold-400 text-ink-900 border-gold-400'
        : 'bg-transparent text-gold-400 border-gold-400/30 hover:border-gold-400'"
      @click="adminModal = true"
    >
      {{ isAdmin ? '⚙ Admin' : 'Admin' }}
    </button>

  </div>
</template>

<script setup lang="ts">
import type { Contribuicao } from '~/composables/useContribuicoes'

// ── Lista de materiais ──
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

const { contribuicoes, loading, subscribe, unsubscribeAll, addContribuicao, updateContribuicao, deleteContribuicao } = useContribuicoes()
const { isAdmin, login, logout } = useAdmin()

// ── Agrupamento ──
const groupedItems = computed<[string, typeof ITEMS_LIST][]>(() => {
  const map = new Map<string, typeof ITEMS_LIST>()
  ITEMS_LIST.forEach(i => { if (!map.has(i.group)) map.set(i.group, []); map.get(i.group)!.push(i) })
  return [...map.entries()]
})

function contribsForItem(itemId: string) {
  return contribuicoes.value.filter(c => c.itemId === itemId)
}
function itemName(itemId: string) {
  return ITEMS_LIST.find(i => i.id === itemId)?.name || itemId
}

const totalCobertos     = computed(() => ITEMS_LIST.filter(i => contribsForItem(i.id).length > 0).length)
const totalColaboradores = computed(() => new Set(contribuicoes.value.map(c => c.nome)).size)

// ── Formulário público (inline por item) ──
const openForm      = ref<string|null>(null)
const formNome      = ref('')
const formQty       = ref('')
const savingContrib = ref(false)
const nameInputs    = ref<Record<string, HTMLInputElement>>({})

// Edição inline pública
const editingContribId = ref<string|null>(null)
const editNome         = ref('')
const editQty          = ref('')
const savingEdit       = ref(false)

function toggleForm(itemId: string) {
  openForm.value = openForm.value === itemId ? null : itemId
  if (openForm.value) {
    formNome.value = ''; formQty.value = ''
    editingContribId.value = null
    nextTick(() => nameInputs.value[itemId]?.focus())
  }
}

async function addContrib(itemId: string) {
  if (!formNome.value.trim()) { alert('Coloque seu nome!'); return }
  if (!formQty.value.trim())  { alert('Coloque a quantidade!'); return }
  savingContrib.value = true
  try {
    await addContribuicao({ itemId, nome: formNome.value.trim(), qty: formQty.value.trim() })
    formNome.value = ''; formQty.value = ''; openForm.value = null
  } finally { savingContrib.value = false }
}

function startEditContrib(c: Contribuicao) {
  editingContribId.value = c.id!
  editNome.value = c.nome
  editQty.value  = c.qty
}

async function saveEditContrib(id: string) {
  if (!editNome.value.trim() || !editQty.value.trim()) return
  savingEdit.value = true
  try {
    await updateContribuicao(id, { nome: editNome.value.trim(), qty: editQty.value.trim() })
    editingContribId.value = null
  } finally { savingEdit.value = false }
}

function cancelEdit() { editingContribId.value = null }

async function removeContrib(id: string) {
  if (!confirm('Remover esta contribuição?')) return
  await deleteContribuicao(id)
}

// ── Modal Admin ──
const adminModal = ref(false)
const adminTab   = ref<'add'|'all'>('add')
const adminTabs  = [
  { val: 'add', label: '＋ Adicionar' },
  { val: 'all', label: '📋 Todas as Contribuições' },
]

const loginPass  = ref('')
const loginError = ref(false)

function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) { loginPass.value = '' }
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

// Form do admin para nova contribuição
const adminForm   = reactive({ itemId: '', nome: '', qty: '' })
const savingAdmin = ref(false)

function resetAdminForm() {
  adminForm.itemId = ''; adminForm.nome = ''; adminForm.qty = ''
  adminEditingId.value = null; filterItemId.value = ''
}

async function adminAddContrib() {
  if (!adminForm.itemId) { alert('Selecione o item!'); return }
  if (!adminForm.nome.trim()) { alert('Preencha o nome!'); return }
  if (!adminForm.qty.trim())  { alert('Preencha a quantidade!'); return }
  savingAdmin.value = true
  try {
    await addContribuicao({ itemId: adminForm.itemId, nome: adminForm.nome.trim(), qty: adminForm.qty.trim() })
    adminForm.nome = ''; adminForm.qty = ''; adminForm.itemId = ''
  } finally { savingAdmin.value = false }
}

// Filtro na aba "Todas"
const filterItemId = ref('')

const filteredContribs = computed(() =>
  filterItemId.value
    ? contribuicoes.value.filter(c => c.itemId === filterItemId.value)
    : contribuicoes.value
)

// Agrupadas por item para exibição
const contribsByItem = computed<[string, Contribuicao[]][]>(() => {
  const map = new Map<string, Contribuicao[]>()
  filteredContribs.value.forEach(c => {
    if (!map.has(c.itemId)) map.set(c.itemId, [])
    map.get(c.itemId)!.push(c)
  })
  // Ordenar na mesma ordem que ITEMS_LIST
  return ITEMS_LIST
    .filter(i => map.has(i.id))
    .map(i => [i.id, map.get(i.id)!])
})

// Edição inline no admin
const adminEditingId   = ref<string|null>(null)
const adminEditForm    = reactive({ itemId: '', nome: '', qty: '' })
const savingAdminEdit  = ref(false)

function startAdminEdit(c: Contribuicao) {
  adminEditingId.value   = c.id!
  adminEditForm.itemId   = c.itemId
  adminEditForm.nome     = c.nome
  adminEditForm.qty      = c.qty
}

async function saveAdminEdit(id: string) {
  if (!adminEditForm.nome.trim() || !adminEditForm.qty.trim()) return
  savingAdminEdit.value = true
  try {
    await updateContribuicao(id, {
      itemId: adminEditForm.itemId,
      nome:   adminEditForm.nome.trim(),
      qty:    adminEditForm.qty.trim(),
    })
    adminEditingId.value = null
  } finally { savingAdminEdit.value = false }
}

async function adminRemoveContrib(id: string) {
  if (!confirm('Excluir esta contribuição?')) return
  await deleteContribuicao(id)
}

onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.summary-card  { @apply bg-ink-800 border border-ink-700 p-5 text-center; }
.summary-label { @apply font-mono text-[9px] uppercase tracking-widest text-ink-400 mt-1; }

.item-card       { @apply flex bg-ink-800 border border-ink-700 overflow-hidden transition-colors duration-200 hover:border-gold-400/20; }
.item-card.complete { @apply border-green-500/30; }
.item-status-bar { @apply w-[3px] shrink-0 transition-colors duration-300; }
.item-header     { @apply flex flex-1 cursor-pointer items-stretch; }
.item-add-btn    { @apply w-12 flex items-center justify-center text-gold-400 text-xl transition-all duration-200 border-l border-ink-700 hover:bg-gold-400/10; }
.item-form       { @apply border-t border-ink-700 p-4 bg-ink-900; }

.contrib-label { @apply font-mono text-[9px] uppercase tracking-widest text-gold-400; }
.contrib-input { @apply bg-ink-800 border border-ink-600 text-white text-sm px-3 py-2 outline-none w-full transition-colors duration-200 focus:border-green-500; }
.contrib-btn   { @apply bg-green-600 text-white border-none font-mono text-[10px] uppercase tracking-widest px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-green-500 whitespace-nowrap; }
.contrib-btn:disabled { @apply opacity-50 cursor-not-allowed; }

.contrib-row {
  @apply flex items-center gap-2 bg-ink-800 border border-ink-700 px-3 py-2.5 transition-colors duration-200 hover:border-ink-600;
}
.contrib-admin-row {
  @apply flex items-start gap-3 bg-ink-900 border border-ink-700 p-3 transition-colors duration-200 hover:border-ink-600;
}

.icon-btn {
  @apply w-7 h-7 flex items-center justify-center border text-xs cursor-pointer transition-all duration-150 shrink-0;
}
.icon-btn.edit   { @apply border-ink-600 text-ink-400 hover:border-gold-400 hover:text-gold-400; }
.icon-btn.del    { @apply border-ink-600 text-ink-400 hover:border-crimson-400 hover:text-crimson-400; }
.icon-btn.save   { @apply border-green-600 text-green-400 hover:bg-green-600 hover:text-white; }
.icon-btn.cancel { @apply border-ink-600 text-ink-400 hover:border-ink-400; }
.icon-btn:disabled { @apply opacity-40 cursor-not-allowed; }

.input-label { @apply font-mono text-[10px] uppercase tracking-widest text-gold-400; }
.input-field {
  @apply bg-ink-900 border border-ink-600 text-white font-mono text-sm px-3 py-2.5 outline-none w-full transition-colors duration-200 focus:border-gold-400;
  appearance: none;
}
select.input-field {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23D4A017' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
.btn-gold { @apply bg-gold-400 text-ink-900 border-none font-mono text-[11px] uppercase tracking-widest py-3 px-6 cursor-pointer font-medium transition-all duration-200 hover:bg-gold-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.admin-tab { @apply font-mono text-[10px] uppercase tracking-widest px-4 py-3 bg-none border-none text-ink-400 cursor-pointer border-b-2 border-transparent -mb-px transition-all duration-200 whitespace-nowrap; }
.admin-tab.active { @apply text-gold-400 border-gold-400; }
.admin-tab:hover:not(.active) { @apply text-ink-200; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; max-height: 500px; }
.slide-down-enter-from,   .slide-down-leave-to     { max-height: 0; opacity: 0; }
</style>
