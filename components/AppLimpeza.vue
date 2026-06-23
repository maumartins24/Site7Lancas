<template>
  <div>

    <!-- ══ RESUMO ══ -->
    <div class="grid grid-cols-3 gap-[3px] mb-10">
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ proximos.length }}</div>
        <div class="summary-label">Dias agendados</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ totalEscalados }}</div>
        <div class="summary-label">Escalados</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ historico.length }}</div>
        <div class="summary-label">Limpezas feitas</div>
      </div>
    </div>

    <!-- ══ LOADING ══ -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-20 bg-ink-100 animate-pulse" />
    </div>

    <template v-else>

      <!-- ══ PRÓXIMAS LIMPEZAS ══ -->
      <div class="mb-14">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-[3px] h-5 bg-gold-400" />
          <h3 class="font-serif text-2xl font-bold text-ink-800">Escala do Mês</h3>
          <div class="flex-1 h-px bg-brand-200" />
        </div>

        <div v-if="!proximos.length" class="py-10 text-center border border-dashed border-gold-400/20 text-ink-500">
          <p class="font-serif text-lg text-ink-600 mb-1">Nenhuma limpeza agendada 🧹</p>
          <p class="text-sm">O admin ainda não adicionou os dias.</p>
        </div>

        <div v-else class="flex flex-col gap-[3px]">
          <div
            v-for="dia in proximos" :key="dia.id"
            class="dia-card"
            :class="{ 'border-green-500/30': escalaCompleta(dia) }"
          >
            <!-- Barra lateral -->
            <div class="w-[3px] shrink-0"
              :class="escalaCompleta(dia) ? 'bg-green-500' : vagasLivres(dia) > 0 ? 'bg-gold-400' : 'bg-crimson-400'" />

            <!-- Data -->
            <div class="dia-date-col">
              <div class="font-serif text-3xl font-black text-ink-800 leading-none">{{ formatDay(dia.date) }}</div>
              <div class="font-mono text-[9px] uppercase tracking-widest text-ink-400">{{ formatMonth(dia.date) }}</div>
              <div class="font-mono text-[8px] text-ink-400/60 mt-1">{{ formatWeekday(dia.date) }}</div>
            </div>

            <!-- Corpo -->
            <div class="flex-1 p-4">
              <!-- Chips de escalados -->
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="e in escalasDoDia(dia.id!).value" :key="e.id"
                  class="escala-chip"
                  :class="{
                    'border-green-500/60 bg-green-500/10 text-green-600': e.limpou,
                    'border-gold-400/50 bg-gold-400/10 text-gold-600': e.confirmado && !e.limpou,
                    'border-brand-200 bg-white text-ink-600': !e.confirmado && !e.limpou,
                  }"
                >
                  <span v-if="e.limpou">✓</span>
                  <span v-else-if="e.confirmado">●</span>
                  <span v-else>○</span>
                  {{ e.nome }}
                  <!-- Confirmar presença (própria pessoa) -->
                  <button
                    v-if="!e.limpou"
                    class="ml-1 text-[8px] opacity-50 hover:opacity-100 transition-opacity"
                    :title="e.confirmado ? 'Cancelar confirmação' : 'Confirmar presença'"
                    @click.stop="confirmarPresenca(e.id!, !e.confirmado)"
                  >{{ e.confirmado ? '✕' : '✓' }}</button>
                </div>

                <!-- Vagas livres -->
                <div
                  v-for="i in vagasLivres(dia)" :key="'vaga-'+i"
                  class="escala-chip border-dashed border-brand-200 text-ink-400"
                >
                  + vaga livre
                </div>
              </div>

              <div v-if="dia.observacao" class="font-mono text-[10px] text-ink-400/70 mt-1">
                📝 {{ dia.observacao }}
              </div>

              <!-- Legenda -->
              <div class="flex gap-3 mt-2">
                <span class="font-mono text-[8px] text-ink-400/60">○ pendente &nbsp; ● confirmado &nbsp; ✓ limpou</span>
              </div>
            </div>

            <!-- Vagas badge -->
            <div class="px-4 text-center hidden sm:flex flex-col justify-center shrink-0 border-l border-brand-200">
              <div class="font-serif text-xl font-black"
                :class="escalaCompleta(dia) ? 'text-green-400' : vagasLivres(dia) > 0 ? 'text-gold-400' : 'text-crimson-400'">
                {{ escalasDoDia(dia.id!).value.length }}/{{ dia.vagas }}
              </div>
              <div class="font-mono text-[9px] text-ink-400/70">pessoas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ HISTÓRICO ══ -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-[3px] h-5 bg-brand-200" />
          <h3 class="font-serif text-2xl font-bold text-ink-800">Histórico</h3>
          <div class="flex-1 h-px bg-brand-200" />
        </div>

        <div v-if="!historico.length" class="py-8 text-center text-ink-400 font-mono text-xs uppercase tracking-widest">
          Nenhum histórico ainda
        </div>

        <div v-else class="flex flex-col gap-[3px]">
          <div
            v-for="dia in historico" :key="dia.id"
            class="flex items-center gap-0 bg-ink-100 border border-brand-200 overflow-hidden"
          >
            <div class="w-[3px] shrink-0 self-stretch bg-brand-200" />
            <div class="px-4 py-3 border-r border-brand-200 text-center shrink-0">
              <div class="font-serif text-xl font-black text-ink-600">{{ formatDay(dia.date) }}</div>
              <div class="font-mono text-[8px] uppercase text-ink-400">{{ formatMonth(dia.date) }}</div>
            </div>
            <div class="flex-1 px-4 py-3">
              <div class="flex flex-wrap gap-1.5">
                <template v-if="dia.equipe.length">
                  <span
                    v-for="e in dia.equipe" :key="e.id"
                    class="font-mono text-[9px] px-2 py-0.5 border"
                    :class="e.limpou
                      ? 'border-green-500/40 text-green-600 bg-green-500/10'
                      : 'border-brand-200 text-ink-400'"
                  >{{ e.limpou ? '✓' : '✗' }} {{ e.nome }}</span>
                </template>
                <span v-else class="text-xs text-ink-400 italic">Sem registro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ══ MODAL ADMIN ══ -->
    <Transition name="fade">
      <div v-if="adminModal"
        class="fixed inset-0 bg-ink-900/50 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        @click.self="adminModal = false"
      >
        <div class="bg-white border border-brand-200 shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col">
          <div class="kente shrink-0" />
          <div class="flex items-center justify-between px-6 py-4 border-b border-brand-200 shrink-0">
            <h3 class="font-serif text-xl text-ink-800">Admin — Limpeza</h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl">✕</button>
          </div>

          <div class="overflow-y-auto flex-1 p-6">

            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4 max-w-sm mx-auto">
              <p class="text-sm text-ink-500 text-center">Digite a senha para gerenciar a escala.</p>
              <div v-if="loginError" class="font-mono text-xs text-crimson-400 p-2 border border-crimson-400/30 bg-crimson-400/10">Senha incorreta.</div>
              <div class="flex flex-col gap-1.5">
                <label class="input-label">Senha</label>
                <input v-model="loginPass" type="password" class="input-field" placeholder="••••••••" @keydown.enter="doLogin" />
              </div>
              <button class="btn-gold w-full" @click="doLogin">Entrar →</button>
            </div>

            <!-- PAINEL ADMIN -->
            <template v-else>
              <div class="flex border-b border-brand-200 mb-6 overflow-x-auto">
                <button v-for="t in adminTabs" :key="t.val"
                  class="admin-tab" :class="{ active: adminTab === t.val }"
                  @click="adminTab = t.val; resetForms()">
                  {{ t.label }}
                </button>
              </div>

              <!-- ── ABA: DIAS ── -->
              <div v-if="adminTab === 'dias'" class="flex flex-col gap-6">

                <!-- Form dia -->
                <div class="border border-brand-200 bg-ink-100 p-4 flex flex-col gap-3">
                  <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                    {{ editingDiaId ? 'Editar Dia' : 'Adicionar Dia de Limpeza' }}
                  </h4>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Data *</label>
                      <input v-model="diaForm.date" type="date" class="input-field" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Nº de vagas *</label>
                      <div class="flex border border-brand-200 overflow-hidden">
                        <button type="button" class="count-btn" @click="diaForm.vagas = Math.max(1, diaForm.vagas - 1)">−</button>
                        <span class="flex-1 text-center font-mono text-sm text-ink-800 bg-ink-100 py-2.5">{{ diaForm.vagas }}</span>
                        <button type="button" class="count-btn" @click="diaForm.vagas++">+</button>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Observação</label>
                    <input v-model="diaForm.observacao" class="input-field" placeholder="Ex: Limpeza pós-gira, trazer vassoura..." maxlength="100" />
                  </div>

                  <div class="flex gap-3">
                    <button class="btn-gold flex-1" :disabled="savingDia" @click="saveDia">
                      {{ savingDia ? 'Salvando...' : editingDiaId ? 'Salvar ✓' : 'Adicionar dia →' }}
                    </button>
                    <button v-if="editingDiaId" class="btn-danger" @click="cancelEditDia">Cancelar</button>
                  </div>
                </div>

                <!-- Lista de dias -->
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-widest text-ink-500 mb-3">Dias cadastrados</p>
                  <div v-if="!dias.length" class="text-ink-400 text-sm font-mono">Nenhum dia cadastrado.</div>
                  <div v-else class="flex flex-col gap-[3px]">
                    <div
                      v-for="dia in [...dias].sort((a,b) => a.date.localeCompare(b.date))"
                      :key="dia.id"
                      class="flex items-center gap-3 bg-ink-100 border border-brand-200 px-4 py-3"
                    >
                      <div class="flex-1">
                        <div class="text-sm font-bold text-ink-800">{{ formatDateFull(dia.date) }}</div>
                        <div class="font-mono text-[10px] text-ink-500 mt-0.5">
                          {{ dia.vagas }} vaga(s)
                          <span v-if="dia.observacao"> · {{ dia.observacao }}</span>
                          <span class="ml-2 text-gold-400/70">{{ escalasDoDia(dia.id!).value.length }} escalados</span>
                        </div>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button class="icon-btn edit" @click="startEditDia(dia)">✎</button>
                        <button class="icon-btn del" @click="removeDia(dia.id!)">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── ABA: ESCALA ── -->
              <div v-if="adminTab === 'escala'" class="flex flex-col gap-4">

                <!-- Form escala -->
                <div class="border border-brand-200 bg-ink-100 p-4 flex flex-col gap-3">
                  <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                    {{ editingEscalaId ? 'Editar Pessoa na Escala' : 'Adicionar Pessoa à Escala' }}
                  </h4>

                  <!-- Selecionar dia -->
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Dia *</label>
                    <select v-model="escalaForm.diaId" class="input-field">
                      <option value="" disabled>Selecione o dia...</option>
                      <option v-for="dia in [...dias].sort((a,b) => a.date.localeCompare(b.date))"
                        :key="dia.id" :value="dia.id">
                        {{ formatDateFull(dia.date) }} — {{ escalasDoDia(dia.id!).value.length }}/{{ dia.vagas }} pessoas
                      </option>
                    </select>
                  </div>

                  <!-- Nome -->
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Nome da pessoa *</label>
                    <input v-model="escalaForm.nome" class="input-field" placeholder="Ex: Maria" maxlength="60" />
                  </div>

                  <!-- Aviso de inelegibilidade -->
                  <div
                    v-if="escalaForm.nome && escalaForm.diaId && inelegivel"
                    class="flex items-start gap-2 p-3 border border-crimson-400/40 bg-crimson-400/10 text-crimson-400"
                  >
                    <span class="shrink-0">⚠️</span>
                    <p class="font-mono text-xs leading-relaxed">
                      <strong>{{ escalaForm.nome }}</strong> limpou na semana anterior a esta data e não é elegível.
                      Você pode continuar mesmo assim se necessário.
                    </p>
                  </div>

                  <div class="flex gap-3">
                    <button class="btn-gold flex-1" :disabled="savingEscala" @click="saveEscala">
                      {{ savingEscala ? 'Salvando...' : editingEscalaId ? 'Salvar ✓' : 'Adicionar à escala →' }}
                    </button>
                    <button v-if="editingEscalaId" class="btn-danger" @click="cancelEditEscala">Cancelar</button>
                  </div>
                </div>

                <!-- Filtro por dia -->
                <div class="flex gap-2">
                  <select v-model="filtroEscalaDiaId" class="input-field flex-1">
                    <option value="">Todos os dias</option>
                    <option v-for="dia in [...dias].sort((a,b) => a.date.localeCompare(b.date))"
                      :key="dia.id" :value="dia.id">
                      {{ formatDateFull(dia.date) }}
                    </option>
                  </select>
                  <button v-if="filtroEscalaDiaId" class="px-3 font-mono text-[10px] border border-brand-200 text-ink-400 hover:border-gold-400 hover:text-gold-400 transition-colors uppercase"
                    @click="filtroEscalaDiaId = ''">Limpar</button>
                </div>

                <!-- Lista de escalas -->
                <div v-if="!escalasFiltradas.length" class="py-6 text-center text-ink-400 font-mono text-xs uppercase">
                  Nenhuma escala encontrada
                </div>

                <div v-else class="flex flex-col gap-6">
                  <div v-for="[diaId, grupo] in escalasPorDia" :key="diaId">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-[3px] h-4 bg-gold-400 shrink-0" />
                      <span class="font-serif text-sm font-bold text-ink-800">{{ formatDateFull(diaId) }}</span>
                      <span class="font-mono text-[9px] text-ink-400/70">{{ grupo.length }} pessoas</span>
                    </div>
                    <div class="flex flex-col gap-[3px]">
                      <div
                        v-for="e in grupo" :key="e.id"
                        class="flex items-center gap-3 bg-ink-100 border border-brand-200 px-4 py-3"
                        :class="{ 'border-green-500/30': e.limpou }"
                      >
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-ink-800 truncate">{{ e.nome }}</span>
                            <span v-if="e.limpou" class="font-mono text-[8px] px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30">LIMPOU</span>
                            <span v-else-if="e.confirmado" class="font-mono text-[8px] px-1.5 py-0.5 bg-gold-400/15 text-gold-400 border border-gold-400/30">CONFIRMADO</span>
                          </div>
                        </div>
                        <div class="flex gap-1.5 shrink-0">
                          <!-- Toggle limpou -->
                          <button
                            class="icon-btn"
                            :class="e.limpou ? 'border-green-500 text-green-600' : 'border-brand-200 text-ink-400 hover:border-green-500 hover:text-green-600'"
                            :title="e.limpou ? 'Desfazer limpeza' : 'Marcar como limpou'"
                            @click="toggleLimpou(e.id!, !e.limpou)"
                          >✓</button>
                          <button class="icon-btn edit" @click="startEditEscala(e)" title="Editar">✎</button>
                          <button class="icon-btn del" @click="removeEscala(e.id!)" title="Remover">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button @click="doLogout" class="text-ink-400 font-mono text-[10px] hover:text-ink-600 transition-colors">Sair do admin</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Botão admin -->
    <button
      class="fixed bottom-6 right-6 z-40 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all duration-200"
      :class="isAdmin ? 'bg-gold-400 text-ink-900 border-gold-400' : 'bg-transparent text-gold-400 border-gold-400/30 hover:border-gold-400'"
      @click="adminModal = true"
    >{{ isAdmin ? '⚙ Admin' : 'Admin' }}</button>

  </div>
</template>

<script setup lang="ts">
import type { LimpezaDia, LimpezaEscala } from '~/composables/useLimpeza'

const MONTHS_PT   = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

const {
  dias, escalas, loading,
  subscribe, unsubscribeAll,
  escalasDoDia, limpouNaSemanaAnterior,
  historico, proximos,
  addDia, updateDia, deleteDia,
  addEscala, updateEscala, deleteEscala,
  toggleLimpou, confirmarPresenca,
} = useLimpeza()

const { isAdmin, login, logout } = useAdmin()

// ── Formatação
function formatDay(date: string)     { return new Date(date+'T00:00:00').getDate().toString().padStart(2,'0') }
function formatMonth(date: string)   { return MONTHS_PT[new Date(date+'T00:00:00').getMonth()] }
function formatWeekday(date: string) { return WEEKDAYS_PT[new Date(date+'T00:00:00').getDay()] }
function formatDateFull(date: string) {
  const d = new Date(date+'T00:00:00')
  return `${WEEKDAYS_PT[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

// ── Helpers de vagas
function vagasLivres(dia: LimpezaDia) {
  return Math.max(0, dia.vagas - escalasDoDia(dia.id!).value.length)
}
function escalaCompleta(dia: LimpezaDia) {
  return escalasDoDia(dia.id!).value.length >= dia.vagas
}

// ── Resumo
const totalEscalados = computed(() =>
  proximos.value.reduce((sum, d) => sum + escalasDoDia(d.id!).value.length, 0)
)

// ── Modal admin
const adminModal = ref(false)
const adminTab   = ref<'dias'|'escala'>('dias')
const adminTabs  = [
  { val: 'dias',   label: '📅 Dias de Limpeza' },
  { val: 'escala', label: '👥 Escala de Pessoas' },
]

const loginPass  = ref('')
const loginError = ref(false)
function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) loginPass.value = ''
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

function resetForms() {
  editingDiaId.value = null; editingEscalaId.value = null
  Object.assign(diaForm, { date: '', vagas: 2, observacao: '' })
  Object.assign(escalaForm, { diaId: '', nome: '' })
  filtroEscalaDiaId.value = ''
}

// ── Form de DIA
const editingDiaId = ref<string|null>(null)
const savingDia    = ref(false)
const diaForm      = reactive({ date: '', vagas: 2, observacao: '' })

function startEditDia(dia: LimpezaDia) {
  editingDiaId.value  = dia.id!
  diaForm.date        = dia.date
  diaForm.vagas       = dia.vagas
  diaForm.observacao  = dia.observacao || ''
}
function cancelEditDia() { editingDiaId.value = null; Object.assign(diaForm, { date: '', vagas: 2, observacao: '' }) }

async function saveDia() {
  if (!diaForm.date) { alert('Selecione a data!'); return }
  savingDia.value = true
  try {
    if (editingDiaId.value) {
      await updateDia(editingDiaId.value, { date: diaForm.date, vagas: diaForm.vagas, observacao: diaForm.observacao })
      editingDiaId.value = null
    } else {
      await addDia({ date: diaForm.date, vagas: diaForm.vagas, observacao: diaForm.observacao })
    }
    Object.assign(diaForm, { date: '', vagas: 2, observacao: '' })
  } finally { savingDia.value = false }
}

async function removeDia(id: string) {
  const qtd = escalasDoDia(id).value.length
  const msg = qtd > 0
    ? `Este dia tem ${qtd} pessoa(s) na escala. Excluir mesmo assim?`
    : 'Excluir este dia de limpeza?'
  if (!confirm(msg)) return
  await deleteDia(id)
}

// ── Form de ESCALA
const editingEscalaId  = ref<string|null>(null)
const savingEscala     = ref(false)
const filtroEscalaDiaId = ref('')
const escalaForm       = reactive({ diaId: '', nome: '' })

// Verifica inelegibilidade em tempo real
const inelegivel = computed(() => {
  if (!escalaForm.nome || !escalaForm.diaId) return false
  const dia = dias.value.find(d => d.id === escalaForm.diaId)
  if (!dia) return false
  return limpouNaSemanaAnterior(escalaForm.nome, dia.date)
})

function startEditEscala(e: LimpezaEscala) {
  editingEscalaId.value = e.id!
  escalaForm.diaId      = e.diaId
  escalaForm.nome       = e.nome
  adminTab.value        = 'escala'
}
function cancelEditEscala() {
  editingEscalaId.value = null
  Object.assign(escalaForm, { diaId: '', nome: '' })
}

async function saveEscala() {
  if (!escalaForm.diaId) { alert('Selecione o dia!'); return }
  if (!escalaForm.nome.trim()) { alert('Preencha o nome!'); return }
  savingEscala.value = true
  try {
    if (editingEscalaId.value) {
      await updateEscala(editingEscalaId.value, { diaId: escalaForm.diaId, nome: escalaForm.nome.trim() })
      editingEscalaId.value = null
    } else {
      await addEscala({ diaId: escalaForm.diaId, nome: escalaForm.nome.trim(), confirmado: false, limpou: false, criadoPorAdmin: true })
    }
    Object.assign(escalaForm, { diaId: '', nome: '' })
  } finally { savingEscala.value = false }
}

async function removeEscala(id: string) {
  if (!confirm('Remover esta pessoa da escala?')) return
  await deleteEscala(id)
}

// Escalas filtradas + agrupadas por dia
const escalasFiltradas = computed(() =>
  filtroEscalaDiaId.value
    ? escalas.value.filter(e => e.diaId === filtroEscalaDiaId.value)
    : escalas.value
)

const escalasPorDia = computed<[string, LimpezaEscala[]][]>(() => {
  const map = new Map<string, LimpezaEscala[]>()
  escalasFiltradas.value.forEach(e => {
    if (!map.has(e.diaId)) map.set(e.diaId, [])
    map.get(e.diaId)!.push(e)
  })
  return [...dias.value]
    .sort((a,b) => a.date.localeCompare(b.date))
    .filter(d => map.has(d.id!))
    .map(d => [d.date, map.get(d.id!)!])
})

onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.summary-card  { @apply bg-ink-100 border border-brand-200 p-5 text-center; }
.summary-label { @apply font-mono text-[9px] uppercase tracking-widest text-ink-500 mt-1; }

.dia-card { @apply flex bg-ink-100 border border-brand-200 overflow-hidden transition-colors hover:border-gold-400/30; }
.dia-date-col { @apply px-4 py-4 border-r border-brand-200 text-center flex flex-col justify-center shrink-0 min-w-[64px]; }

.escala-chip {
  @apply inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide px-2.5 py-1 border rounded-none transition-all;
}

.input-label { @apply font-mono text-[10px] uppercase tracking-widest text-gold-400; }
.input-field {
  @apply bg-ink-100 border border-brand-200 text-ink-800 font-mono text-sm px-3 py-2.5 outline-none w-full transition-colors focus:border-gold-400;
  appearance: none;
}
select.input-field {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23D4A017' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
}
.btn-gold   { @apply bg-gold-400 text-white border-none font-mono text-[11px] uppercase tracking-widest py-3 px-6 cursor-pointer font-medium transition-all hover:bg-gold-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-danger { @apply bg-transparent text-crimson-400 border border-crimson-400/30 font-mono text-[10px] uppercase tracking-widest py-2 px-4 cursor-pointer transition-all hover:bg-crimson-400 hover:text-white; }
.admin-tab  { @apply font-mono text-[10px] uppercase tracking-widest px-4 py-3 bg-none border-none text-ink-500 cursor-pointer border-b-2 border-transparent -mb-px transition-all whitespace-nowrap hover:text-ink-600; }
.admin-tab.active { @apply text-gold-400 border-gold-400; }
.icon-btn        { @apply w-7 h-7 flex items-center justify-center border text-xs cursor-pointer transition-all shrink-0; }
.icon-btn.edit   { @apply border-brand-200 text-ink-500 hover:border-gold-400 hover:text-gold-400; }
.icon-btn.del    { @apply border-brand-200 text-ink-500 hover:border-crimson-400 hover:text-crimson-400; }
.count-btn       { @apply w-8 bg-none border-none text-gold-400 text-lg cursor-pointer transition-colors hover:bg-gold-400/15; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
