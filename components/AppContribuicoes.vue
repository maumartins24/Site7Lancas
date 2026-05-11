<template>
  <div>

    <!-- ══ RESUMO ══ -->
    <div class="grid grid-cols-3 gap-[3px] mb-10">
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalCobertos }}</div>
        <div class="summary-label">Itens cobertos</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ itens.length - totalCobertos }}</div>
        <div class="summary-label">Pendentes</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalColaboradores }}</div>
        <div class="summary-label">Colaboradores</div>
      </div>
    </div>

    <!-- ══ LOADING ══ -->
    <div v-if="loadingItens || loadingContribs" class="space-y-3">
      <div v-for="i in 6" :key="i" class="h-16 bg-ink-800 animate-pulse" />
    </div>

    <!-- ══ LISTA DE ITENS ══ -->
    <template v-else>
      <div v-for="[groupName, groupItens] in groupedItens" :key="groupName" class="mb-10">

        <div class="flex items-center gap-3 mb-3">
          <h3 class="font-serif text-xl font-bold text-white">{{ groupName }}</h3>
          <div class="flex-1 h-px bg-ink-700" />
        </div>

        <div class="flex flex-col gap-[3px]">
          <div
            v-for="item in groupItens" :key="item.id"
            class="item-card"
            :class="{ complete: contribsForItem(item.id!).length > 0 }"
          >
            <div class="item-status-bar"
              :class="contribsForItem(item.id!).length > 0 ? 'bg-green-500' : 'bg-ink-600'" />

            <div class="item-header" @click="toggleForm(item.id!)">
              <div class="flex-1 min-w-0 p-4">
                <div class="font-serif text-base font-bold text-white">{{ item.name }}</div>
                <div class="font-mono text-[10px] text-ink-400 mt-0.5">Meta: {{ item.meta }}</div>
                <div v-if="contribsForItem(item.id!).length" class="flex flex-wrap gap-1.5 mt-2">
                  <span
                    v-for="c in contribsForItem(item.id!)" :key="c.id"
                    class="font-mono text-[9px] px-2 py-0.5 border border-green-500/50 text-green-400 bg-green-500/10"
                  >✓ {{ c.nome }} · {{ c.qty }}</span>
                </div>
                <div v-if="contribsForItem(item.id!).length" class="mt-1.5">
                  <span class="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-green-400 border border-green-500/40 px-2 py-0.5 bg-green-500/10">
                    ✓ Item coberto
                  </span>
                </div>
              </div>

              <div class="flex items-center shrink-0 border-l border-ink-700">
                <div class="px-4 text-center hidden sm:block">
                  <div class="font-serif text-lg font-black" :class="contribsForItem(item.id!).length ? 'text-green-400' : 'text-ink-600'">
                    {{ contribsForItem(item.id!).length ? '✓' : '—' }}
                  </div>
                  <div class="font-mono text-[9px] text-ink-500">{{ contribsForItem(item.id!).length }} contrib.</div>
                </div>
                <button class="item-add-btn" :class="{ 'text-green-400': contribsForItem(item.id!).length }">
                  {{ openForm === item.id ? '✕' : '＋' }}
                </button>
              </div>
            </div>

            <!-- Formulário inline público -->
            <Transition name="slide-down">
              <div v-if="openForm === item.id" class="item-form">
                <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Seu nome</label>
                    <input
                      :ref="el => { if(el) nameInputs[item.id!] = el as HTMLInputElement }"
                      v-model="formNome" class="contrib-input" type="text"
                      placeholder="Ex: Maria" maxlength="60"
                      @keydown.enter="addContrib(item.id!)"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="contrib-label">Quantidade</label>
                    <input v-model="formQty" class="contrib-input" type="text"
                      placeholder="Ex: 500gr / 1 pacote" maxlength="40"
                      @keydown.enter="addContrib(item.id!)" />
                  </div>
                  <button class="contrib-btn self-end" :disabled="savingContrib" @click="addContrib(item.id!)">
                    {{ savingContrib ? '...' : 'Confirmar ✓' }}
                  </button>
                </div>

                <!-- Contribuições existentes com edição inline -->
                <div v-if="contribsForItem(item.id!).length" class="flex flex-col gap-1">
                  <div v-for="c in contribsForItem(item.id!)" :key="c.id" class="contrib-row">
                    <template v-if="editingContribId !== c.id">
                      <span class="flex-1 text-sm text-white font-medium truncate">{{ c.nome }}</span>
                      <span class="font-mono text-xs text-green-400 shrink-0 mx-3">{{ c.qty }}</span>
                      <div class="flex gap-1 shrink-0">
                        <button class="icon-btn edit" @click.stop="startEditContrib(c)" title="Editar">✎</button>
                        <button class="icon-btn del"  @click.stop="removeContrib(c.id!)" title="Remover">✕</button>
                      </div>
                    </template>
                    <template v-else>
                      <input v-model="editNome" class="contrib-input flex-1 text-sm"
                        placeholder="Nome" @keydown.enter="saveEditContrib(c.id!)" @keydown.esc="cancelEdit" />
                      <input v-model="editQty" class="contrib-input w-28 mx-2 text-sm"
                        placeholder="Qtd" @keydown.enter="saveEditContrib(c.id!)" @keydown.esc="cancelEdit" />
                      <div class="flex gap-1 shrink-0">
                        <button class="icon-btn save" :disabled="savingEdit" @click.stop="saveEditContrib(c.id!)">✓</button>
                        <button class="icon-btn cancel" @click.stop="cancelEdit">✕</button>
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
          <div class="flex items-center justify-between px-6 py-4 border-b border-ink-700 shrink-0">
            <h3 class="font-serif text-xl text-white">Admin — Contribuições</h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl leading-none">✕</button>
          </div>

          <div class="overflow-y-auto flex-1 p-6">

            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4 max-w-sm mx-auto">
              <p class="text-sm text-ink-400 text-center">Digite a senha para acessar o painel.</p>
              <div v-if="loginError" class="font-mono text-xs text-crimson-400 p-2 border border-crimson-400/30 bg-crimson-400/10">Senha incorreta.</div>
              <div class="flex flex-col gap-1.5">
                <label class="input-label">Senha</label>
                <input v-model="loginPass" type="password" class="input-field" placeholder="••••••••" @keydown.enter="doLogin" />
              </div>
              <button class="btn-gold w-full" @click="doLogin">Entrar →</button>
            </div>

            <!-- PAINEL ADMIN -->
            <template v-else>
              <div class="flex border-b border-ink-700 mb-6 overflow-x-auto">
                <button v-for="t in adminTabs" :key="t.val"
                  class="admin-tab" :class="{ active: adminTab === t.val }"
                  @click="switchAdminTab(t.val)">
                  {{ t.label }}
                </button>
              </div>

              <!-- ══ ABA: ITENS DA LISTA ══ -->
              <div v-if="adminTab === 'itens'" class="flex flex-col gap-6">

                <!-- Form novo item -->
                <div class="border border-gold-400/20 bg-ink-900 p-4 flex flex-col gap-3">
                  <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                    {{ editingItemId ? 'Editar Item' : 'Novo Item da Lista' }}
                  </h4>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Nome do item *</label>
                      <input v-model="itemForm.name" class="input-field" placeholder="Ex: Vela Roxa" maxlength="60" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Meta / Quantidade</label>
                      <input v-model="itemForm.meta" class="input-field" placeholder="Ex: 500 gr / 2 L" maxlength="40" />
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Grupo / Categoria *</label>
                    <!-- Sugestões de grupos existentes + campo livre -->
                    <div class="flex gap-2 flex-wrap mb-1">
                      <button
                        v-for="g in grupos" :key="g" type="button"
                        class="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 border transition-all duration-150"
                        :class="itemForm.group === g
                          ? 'border-gold-400 bg-gold-400/15 text-gold-400'
                          : 'border-ink-600 text-ink-400 hover:border-ink-400'"
                        @click="itemForm.group = g"
                      >{{ g }}</button>
                      <button
                        type="button"
                        class="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 border border-dashed border-ink-600 text-ink-500 hover:border-gold-400 hover:text-gold-400 transition-all duration-150"
                        @click="itemForm.group = ''"
                        title="Novo grupo"
                      >＋ Novo grupo</button>
                    </div>
                    <input
                      v-model="itemForm.group" class="input-field"
                      placeholder="Nome do grupo (ex: Bebidas, Velas...)" maxlength="40"
                    />
                  </div>

                  <div class="flex gap-3">
                    <button class="btn-gold flex-1" :disabled="savingItem" @click="saveItem">
                      {{ savingItem ? 'Salvando...' : editingItemId ? 'Salvar item ✓' : 'Adicionar item →' }}
                    </button>
                    <button v-if="editingItemId" class="btn-danger" @click="cancelEditItem">Cancelar</button>
                  </div>
                </div>

                <!-- Lista de itens existentes -->
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-widest text-ink-400 mb-3">Itens cadastrados</p>
                  <div v-if="!itens.length" class="text-ink-600 text-sm font-mono">Nenhum item ainda.</div>
                  <div v-else class="flex flex-col gap-[3px]">
                    <div
                      v-for="item in itens" :key="item.id"
                      class="flex items-center gap-3 bg-ink-900 border border-ink-700 px-4 py-3"
                      :class="{ 'border-gold-400/40': editingItemId === item.id }"
                    >
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-bold text-white truncate">{{ item.name }}</div>
                        <div class="font-mono text-[9px] text-ink-400 mt-0.5">
                          {{ item.group }} · {{ item.meta }}
                          <span class="ml-2 text-green-400/70">{{ contribsForItem(item.id!).length }} contrib.</span>
                        </div>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button class="icon-btn edit" @click="startEditItem(item)" title="Editar">✎</button>
                        <button class="icon-btn del"  @click="removeItem(item.id!)" title="Excluir">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ══ ABA: CONTRIBUIÇÕES ══ -->
              <div v-if="adminTab === 'contribs'" class="flex flex-col gap-4">

                <!-- Adicionar nova contribuição -->
                <div class="border border-gold-400/20 bg-ink-900 p-4 flex flex-col gap-3">
                  <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                    {{ adminEditingId ? 'Editar Contribuição' : 'Nova Contribuição' }}
                  </h4>

                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Item *</label>
                    <select v-model="contribForm.itemId" class="input-field">
                      <option value="" disabled>Selecione o item...</option>
                      <optgroup v-for="[group, gItems] in groupedItens" :key="group" :label="group">
                        <option v-for="item in gItems" :key="item.id" :value="item.id">
                          {{ item.name }} — {{ item.meta }}
                        </option>
                      </optgroup>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Nome *</label>
                      <input v-model="contribForm.nome" class="input-field" placeholder="Ex: Maria" maxlength="60" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Quantidade *</label>
                      <input v-model="contribForm.qty" class="input-field" placeholder="Ex: 1 kg" maxlength="40" />
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button class="btn-gold flex-1" :disabled="savingContribAdmin" @click="saveContribAdmin">
                      {{ savingContribAdmin ? 'Salvando...' : adminEditingId ? 'Salvar alterações ✓' : 'Adicionar Contribuição →' }}
                    </button>
                    <button v-if="adminEditingId" class="btn-danger" @click="cancelAdminEdit">Cancelar</button>
                  </div>
                </div>

                <!-- Filtro por item -->
                <div class="flex gap-2">
                  <select v-model="filterItemId" class="input-field flex-1">
                    <option value="">Todas as contribuições</option>
                    <optgroup v-for="[group, gItems] in groupedItens" :key="group" :label="group">
                      <option v-for="item in gItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </optgroup>
                  </select>
                  <button v-if="filterItemId"
                    class="font-mono text-[10px] uppercase px-3 border border-ink-600 text-ink-400 hover:border-gold-400 hover:text-gold-400 transition-colors whitespace-nowrap"
                    @click="filterItemId = ''">Limpar</button>
                </div>

                <!-- Lista de contribuições -->
                <div v-if="!filteredContribs.length" class="py-8 text-center text-ink-600 font-mono text-xs uppercase tracking-widest">
                  Nenhuma contribuição encontrada
                </div>

                <div v-else class="flex flex-col gap-6">
                  <div v-for="[itemId, contribs] in contribsByItem" :key="itemId">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-[3px] h-4 bg-gold-400 shrink-0" />
                      <span class="font-serif text-sm font-bold text-white">{{ itemNameById(itemId) }}</span>
                      <span class="font-mono text-[9px] text-ink-500">{{ contribs.length }} contrib.</span>
                    </div>
                    <div class="flex flex-col gap-[3px]">
                      <div v-for="c in contribs" :key="c.id"
                        class="flex items-center gap-3 bg-ink-900 border border-ink-700 px-4 py-3 transition-colors"
                        :class="{ 'border-gold-400/40': adminEditingId === c.id }"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="text-sm text-white font-medium truncate">{{ c.nome }}</div>
                          <div class="font-mono text-[10px] text-green-400 mt-0.5">{{ c.qty }}</div>
                        </div>
                        <div class="flex gap-1.5 shrink-0">
                          <button class="icon-btn edit" @click="startAdminEdit(c)" title="Editar">✎</button>
                          <button class="icon-btn del"  @click="adminRemoveContrib(c.id!)" title="Excluir">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-end">
                <button @click="doLogout" class="text-ink-600 font-mono text-[10px] hover:text-ink-400 transition-colors">Sair do admin</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Botão flutuante -->
    <button
      class="fixed bottom-6 right-6 z-40 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all duration-200"
      :class="isAdmin
        ? 'bg-gold-400 text-ink-900 border-gold-400'
        : 'bg-transparent text-gold-400 border-gold-400/30 hover:border-gold-400'"
      @click="adminModal = true"
    >{{ isAdmin ? '⚙ Admin' : 'Admin' }}</button>

  </div>
</template>

<script setup lang="ts">
import type { Contribuicao } from '~/composables/useContribuicoes'
import type { Item } from '~/composables/useItens'

// ── Composables ──
const {
  itens, loading: loadingItens,
  subscribe: subItens, unsubscribeAll: unsubItens,
  addItem, updateItem, deleteItem,
  grupos, groupedItens,
} = useItens()

const {
  contribuicoes, loading: loadingContribs,
  subscribe: subContribs, unsubscribeAll: unsubContribs,
  addContribuicao, updateContribuicao, deleteContribuicao,
} = useContribuicoes()

const { isAdmin, login, logout } = useAdmin()

// ── Helpers ──
function contribsForItem(itemId: string) {
  return contribuicoes.value.filter(c => c.itemId === itemId)
}
function itemNameById(itemId: string) {
  return itens.value.find(i => i.id === itemId)?.name || itemId
}

const totalCobertos     = computed(() => itens.value.filter(i => contribsForItem(i.id!).length > 0).length)
const totalColaboradores = computed(() => new Set(contribuicoes.value.map(c => c.nome)).size)

// ── Formulário público (inline por item) ──
const openForm         = ref<string|null>(null)
const formNome         = ref('')
const formQty          = ref('')
const savingContrib    = ref(false)
const nameInputs       = ref<Record<string, HTMLInputElement>>({})
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
  editingContribId.value = c.id!; editNome.value = c.nome; editQty.value = c.qty
}
async function saveEditContrib(id: string) {
  if (!editNome.value.trim() || !editQty.value.trim()) return
  savingEdit.value = true
  try { await updateContribuicao(id, { nome: editNome.value.trim(), qty: editQty.value.trim() }); editingContribId.value = null }
  finally { savingEdit.value = false }
}
function cancelEdit() { editingContribId.value = null }
async function removeContrib(id: string) {
  if (!confirm('Remover esta contribuição?')) return
  await deleteContribuicao(id)
}

// ── Modal Admin ──
const adminModal = ref(false)
const adminTab   = ref<'itens'|'contribs'>('itens')
const adminTabs  = [
  { val: 'itens',    label: '📦 Itens da Lista' },
  { val: 'contribs', label: '🙋 Contribuições' },
]
const loginPass  = ref('')
const loginError = ref(false)

function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) { loginPass.value = '' }
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

function switchAdminTab(tab: 'itens'|'contribs') {
  adminTab.value = tab
  editingItemId.value   = null
  adminEditingId.value  = null
  resetItemForm(); resetContribForm()
}

// ── Form de Item ──
const editingItemId = ref<string|null>(null)
const savingItem    = ref(false)
const itemForm      = reactive({ name: '', group: '', meta: '' })

function resetItemForm() { itemForm.name = ''; itemForm.group = ''; itemForm.meta = '' }

function startEditItem(item: Item) {
  editingItemId.value = item.id!
  itemForm.name = item.name; itemForm.group = item.group; itemForm.meta = item.meta
}

async function saveItem() {
  if (!itemForm.name.trim()) { alert('Preencha o nome do item!'); return }
  if (!itemForm.group.trim()) { alert('Preencha o grupo/categoria!'); return }
  savingItem.value = true
  try {
    if (editingItemId.value) {
      await updateItem(editingItemId.value, { name: itemForm.name.trim(), group: itemForm.group.trim(), meta: itemForm.meta.trim() })
      editingItemId.value = null
    } else {
      await addItem({ name: itemForm.name.trim(), group: itemForm.group.trim(), meta: itemForm.meta.trim(), ordem: itens.value.length })
    }
    resetItemForm()
  } finally { savingItem.value = false }
}

function cancelEditItem() { editingItemId.value = null; resetItemForm() }

async function removeItem(id: string) {
  const hasContribs = contribsForItem(id).length > 0
  const msg = hasContribs
    ? `Este item tem ${contribsForItem(id).length} contribuição(ões). Excluir mesmo assim?`
    : 'Excluir este item da lista?'
  if (!confirm(msg)) return
  await deleteItem(id)
}

// ── Form de Contribuição (admin) ──
const adminEditingId    = ref<string|null>(null)
const savingContribAdmin = ref(false)
const contribForm       = reactive({ itemId: '', nome: '', qty: '' })
const filterItemId      = ref('')

function resetContribForm() { contribForm.itemId = ''; contribForm.nome = ''; contribForm.qty = '' }

function startAdminEdit(c: Contribuicao) {
  adminEditingId.value  = c.id!
  contribForm.itemId    = c.itemId
  contribForm.nome      = c.nome
  contribForm.qty       = c.qty
}

function cancelAdminEdit() { adminEditingId.value = null; resetContribForm() }

async function saveContribAdmin() {
  if (!contribForm.itemId)       { alert('Selecione o item!'); return }
  if (!contribForm.nome.trim())  { alert('Preencha o nome!'); return }
  if (!contribForm.qty.trim())   { alert('Preencha a quantidade!'); return }
  savingContribAdmin.value = true
  try {
    if (adminEditingId.value) {
      await updateContribuicao(adminEditingId.value, {
        itemId: contribForm.itemId,
        nome:   contribForm.nome.trim(),
        qty:    contribForm.qty.trim(),
      })
      adminEditingId.value = null
    } else {
      await addContribuicao({ itemId: contribForm.itemId, nome: contribForm.nome.trim(), qty: contribForm.qty.trim() })
    }
    resetContribForm()
  } finally { savingContribAdmin.value = false }
}

async function adminRemoveContrib(id: string) {
  if (!confirm('Excluir esta contribuição?')) return
  await deleteContribuicao(id)
}

const filteredContribs = computed(() =>
  filterItemId.value
    ? contribuicoes.value.filter(c => c.itemId === filterItemId.value)
    : contribuicoes.value
)

const contribsByItem = computed<[string, Contribuicao[]][]>(() => {
  const map = new Map<string, Contribuicao[]>()
  filteredContribs.value.forEach(c => {
    if (!map.has(c.itemId)) map.set(c.itemId, [])
    map.get(c.itemId)!.push(c)
  })
  // Respeita a ordem de ITEMS_LIST
  return itens.value.filter(i => map.has(i.id!)).map(i => [i.id!, map.get(i.id!)!])
})

onMounted(() => { subItens(); subContribs() })
onUnmounted(() => { unsubItens(); unsubContribs() })
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
.contrib-row   { @apply flex items-center gap-2 bg-ink-800 border border-ink-700 px-3 py-2.5 hover:border-ink-600 transition-colors; }

.icon-btn        { @apply w-7 h-7 flex items-center justify-center border text-xs cursor-pointer transition-all duration-150 shrink-0; }
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
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
}
.btn-gold   { @apply bg-gold-400 text-ink-900 border-none font-mono text-[11px] uppercase tracking-widest py-3 px-6 cursor-pointer font-medium transition-all duration-200 hover:bg-gold-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-danger { @apply bg-transparent text-crimson-400 border border-crimson-400/30 font-mono text-[10px] uppercase tracking-widest py-2 px-4 cursor-pointer transition-all duration-200 hover:bg-crimson-400 hover:text-white; }
.admin-tab  { @apply font-mono text-[10px] uppercase tracking-widest px-4 py-3 bg-none border-none text-ink-400 cursor-pointer border-b-2 border-transparent -mb-px transition-all duration-200 whitespace-nowrap; }
.admin-tab.active { @apply text-gold-400 border-gold-400; }
.admin-tab:hover:not(.active) { @apply text-ink-200; }

.fade-enter-active,     .fade-leave-active      { transition: opacity 0.3s; }
.fade-enter-from,       .fade-leave-to          { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; max-height: 600px; }
.slide-down-enter-from,   .slide-down-leave-to     { max-height: 0; opacity: 0; }
</style>
