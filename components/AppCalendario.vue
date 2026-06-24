<template>
  <div>
    <!-- ══ CALENDÁRIO ══ -->
    <div class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-3xl md:text-4xl font-black text-ink-800">
          {{ MONTHS_PT[currentMonth] }}
          <span class="text-gold-400 italic">{{ currentYear }}</span>
        </h2>
        <div class="flex gap-2">
          <button @click="prevMonth" class="cal-nav-btn">←</button>
          <button @click="goToday"   class="cal-nav-btn text-xs px-3">Hoje</button>
          <button @click="nextMonth" class="cal-nav-btn">→</button>
        </div>
      </div>

      <div class="grid grid-cols-7 mb-1">
        <div v-for="(d,i) in WEEKDAYS" :key="d"
          class="text-center py-2 font-mono text-[10px] tracking-widest uppercase"
          :class="i===0||i===6?'text-crimson-400 opacity-70':'text-ink-400'">
          {{ d }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-[3px]">
        <div v-for="_ in firstDayOfMonth" :key="'e'+_" class="aspect-square" />
        <div
          v-for="day in daysInMonth" :key="day"
          class="cal-cell"
          :class="{
            'today':    isToday(day),
            'has-event': eventsForDay(day).length > 0,
            'sunday':   dayOfWeek(day) === 0,
            'saturday': dayOfWeek(day) === 6,
          }"
          @click="scrollToDate(dateStr(day))"
        >
          <span class="cell-num">{{ day }}</span>
          <div class="cell-dots">
            <div
              v-for="ev in eventsForDay(day)" :key="ev.id"
              class="cell-dot"
              :style="{ background: colorMap[ev.type] || '#D4A017' }"
            />
          </div>
        </div>
      </div>

      <div v-if="loadingEv || loadingTipos" class="mt-4 text-center font-mono text-[10px] text-ink-500 tracking-widest animate-pulse">
        Sincronizando...
      </div>
    </div>

    <div class="kente-thin my-12" />

    <!-- ══ LISTA DE EVENTOS ══ -->
    <div>
      <div class="section-label mb-5">Próximos Eventos</div>
      <h2 class="font-serif text-3xl md:text-4xl font-black text-ink-800 mb-8">
        Nossos <span class="text-gold-400 italic">Encontros</span>
      </h2>

      <div v-if="loadingEv" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 bg-ink-100 animate-pulse" />
      </div>

      <div v-else-if="upcomingEvents.length === 0"
        class="p-12 text-center border border-dashed border-gold-400/20 text-ink-400">
        <p class="font-serif text-xl text-ink-600 mb-2">Nenhum evento agendado 🌙</p>
        <p class="text-sm">Fique de olho — novidades em breve!</p>
      </div>

      <div v-else class="flex flex-col gap-[3px]">
        <div
          v-for="ev in upcomingEvents" :key="ev.id"
          class="event-item"
          :data-event-date="ev.date"
        >
          <div class="absolute left-0 top-0 bottom-0 w-[3px]" :style="{ background: colorMap[ev.type] || '#D4A017' }" />
          <div class="event-date-col">
            <div class="event-date-day">{{ formatDay(ev.date) }}</div>
            <div class="event-date-month">{{ formatMonth(ev.date) }}</div>
          </div>
          <div class="event-body">
            <div class="event-type-badge" :style="badgeStyle(ev.type)">
              {{ iconMap[ev.type] || '📅' }} {{ labelMap[ev.type] || ev.type }}
            </div>
            <div class="event-name">{{ ev.name }}</div>
            <div v-if="ev.desc" class="event-desc">{{ ev.desc }}</div>
            <div v-if="ev.time" class="event-time">⏰ {{ ev.time }}</div>
          </div>
          <div class="event-arrow">→</div>
        </div>
      </div>
    </div>

    <!-- ══ MODAL ADMIN ══ -->
    <Transition name="fade">
      <div v-if="adminModal"
        class="fixed inset-0 bg-ink-900/50 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        @click.self="adminModal = false"
        role="dialog" aria-label="Admin — Agenda"
      >
        <div class="bg-white border border-brand-200 w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-xl">
          <div class="kente" />
          <div class="flex items-center justify-between px-6 py-4 border-b border-brand-200">
            <h3 class="font-serif text-xl text-ink-800">
              {{ isAdmin ? modalTitle : 'Área Admin' }}
            </h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl leading-none">✕</button>
          </div>

          <div class="p-6">

            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4">
              <p class="text-sm text-ink-500">Digite a senha para gerenciar eventos e tipos.</p>
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
              <div class="flex border-b border-brand-200 mb-6">
                <button v-for="t in adminTabs" :key="t.val"
                  class="admin-tab" :class="{ active: adminTab === t.val }"
                  @click="adminTab = t.val; editingId = null; editingTipoId = null; resetForm()">
                  {{ t.label }}
                </button>
              </div>

              <!-- ── ABA: EVENTOS ── -->
              <template v-if="adminTab === 'eventos'">
                <div class="flex flex-col gap-4">

                  <!-- Preview -->
                  <div class="border border-brand-200 bg-ink-100 overflow-hidden">
                    <div class="bg-white px-3 py-2 text-[9px] font-mono uppercase tracking-widest text-ink-400 flex items-center gap-2">
                      <div class="w-[5px] h-[5px] bg-gold-400 rotate-45 opacity-50" />
                      Prévia do evento
                    </div>
                    <div class="grid relative min-h-[64px]" style="grid-template-columns:56px 1fr">
                      <div class="absolute left-0 top-0 bottom-0 w-[3px] transition-all" :style="{ background: colorMap[form.type] || '#D4A017' }" />
                      <div class="pl-4 pr-2 py-3 border-r border-brand-200 flex flex-col justify-center text-center">
                        <div class="font-serif text-2xl font-black text-ink-800 leading-none">{{ previewDay }}</div>
                        <div class="font-mono text-[8px] uppercase tracking-widest text-ink-400">{{ previewMon }}</div>
                      </div>
                      <div class="p-3 flex flex-col justify-center">
                        <div class="inline-block font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 mb-1.5" :style="badgeStyle(form.type)">
                          {{ iconMap[form.type] || '📅' }} {{ labelMap[form.type] || 'Tipo...' }}
                        </div>
                        <div class="font-serif text-sm font-bold leading-tight" :class="form.name ? 'text-ink-800' : 'text-ink-400 italic font-normal'">
                          {{ form.name || 'Nome do evento...' }}
                        </div>
                        <div v-if="form.time" class="font-mono text-[10px] text-gold-400 mt-1">⏰ {{ form.time }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Tipo de evento — dinâmico! -->
                  <div class="flex flex-col gap-2">
                    <label class="input-label">Tipo de Evento *</label>
                    <div v-if="loadingTipos" class="h-16 bg-ink-100 animate-pulse" />
                    <div v-else class="grid gap-2" :style="`grid-template-columns: repeat(${Math.min(tipos.length + 1, 4)}, 1fr)`">
                      <button
                        v-for="tipo in tipos" :key="tipo.id"
                        type="button"
                        class="type-btn"
                        :class="{ selected: form.type === tipo.id }"
                        :style="form.type === tipo.id ? `border-color:${tipo.color};background:${tipo.color}22;color:${tipo.color}` : ''"
                        @click="form.type = tipo.id!"
                      >
                        <span class="text-xl leading-none">{{ tipo.icon }}</span>
                        <span class="leading-tight text-center">{{ tipo.label }}</span>
                      </button>
                      <!-- Botão para ir gerenciar tipos -->
                      <button
                        type="button"
                        class="type-btn opacity-50 hover:opacity-100"
                        @click="adminTab = 'tipos'; editingId = null; resetForm()"
                        title="Gerenciar tipos"
                      >
                        <span class="text-xl leading-none">＋</span>
                        <span class="leading-tight">Novo tipo</span>
                      </button>
                    </div>
                  </div>

                  <!-- Nome -->
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Nome *</label>
                    <input v-model="form.name" class="input-field" placeholder="Ex: Gira de Ogum" maxlength="80" />
                  </div>

                  <!-- Data + Hora -->
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Data *</label>
                      <input v-model="form.date" type="date" class="input-field" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Horário</label>
                      <input v-model="form.time" type="time" class="input-field" />
                    </div>
                  </div>

                  <!-- Descrição -->
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Descrição</label>
                    <textarea v-model="form.desc" class="input-field resize-y" rows="3" maxlength="300"
                      placeholder="Detalhes, local, o que levar..." />
                    <div class="text-right font-mono text-[9px]"
                      :class="(form.desc?.length || 0) > 260 ? 'text-crimson-400' : 'text-ink-600'">
                      {{ form.desc?.length || 0 }} / 300
                    </div>
                  </div>

                  <!-- Recorrência (só para novos) -->
                  <template v-if="!editingId">
                    <div class="form-divider">Repetição</div>
                    <div class="flex flex-col gap-2">
                      <div class="flex flex-wrap gap-2">
                        <button v-for="r in REC_OPTIONS" :key="r.val" type="button"
                          class="rec-btn" :class="{ sel: form.recurrence === r.val }"
                          @click="form.recurrence = r.val">
                          {{ r.label }}
                        </button>
                      </div>
                      <div v-if="form.recurrence !== 'none'" class="flex items-center gap-3 mt-1">
                        <span class="font-mono text-xs text-ink-400">Quantas vezes?</span>
                        <div class="flex border border-brand-200 overflow-hidden">
                          <button type="button" class="count-btn" @click="form.recCount = Math.max(2, form.recCount - 1)">−</button>
                          <span class="w-10 text-center font-mono text-sm text-ink-800 bg-ink-100 py-1">{{ form.recCount }}</span>
                          <button type="button" class="count-btn" @click="form.recCount = Math.min(52, form.recCount + 1)">+</button>
                        </div>
                      </div>
                      <div v-if="form.recurrence !== 'none' && recurrenceDates.length" class="flex flex-wrap gap-1.5 mt-1">
                        <span v-for="d in recurrenceDates" :key="d"
                          class="font-mono text-[9px] px-2 py-0.5 border border-gold-400/25 text-gold-400">
                          {{ formatDateShort(d) }}
                        </span>
                      </div>
                    </div>
                  </template>

                  <!-- Ações -->
                  <div class="flex gap-3 pt-2">
                    <button class="btn-gold flex-1" :disabled="saving" @click="saveEvento">
                      {{ saving ? 'Salvando...' : editingId ? 'Salvar alterações ✓' : 'Adicionar evento →' }}
                    </button>
                    <button v-if="editingId" class="btn-danger" @click="editingId = null; resetForm()">Cancelar</button>
                  </div>
                </div>
              </template>

              <!-- ── ABA: LISTA DE EVENTOS ── -->
              <template v-if="adminTab === 'lista'">
                <div class="flex flex-col gap-0">
                  <p v-if="eventos.length === 0" class="text-ink-500 text-sm py-4">Nenhum evento ainda.</p>
                  <div
                    v-for="ev in [...eventos].sort((a,b) => a.date.localeCompare(b.date))"
                    :key="ev.id"
                    class="flex items-center gap-3 py-3 border-b border-brand-200 pl-3"
                    :style="{ borderLeft: `3px solid ${colorMap[ev.type] || '#D4A017'}` }"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="font-serif text-sm text-ink-800 truncate">{{ ev.name }}</div>
                      <div class="font-mono text-[10px] text-ink-500 mt-0.5">
                        {{ formatDateFull(ev.date) }}{{ ev.time ? ' · ' + ev.time : '' }}
                        · {{ labelMap[ev.type] || ev.type }}
                      </div>
                    </div>
                    <div class="flex gap-1.5 shrink-0">
                      <button class="btn-icon edit" @click="startEditEvento(ev)">✎</button>
                      <button class="btn-icon" @click="removeEvento(ev.id!)">✕</button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ── ABA: TIPOS DE EVENTO ── -->
              <template v-if="adminTab === 'tipos'">
                <div class="flex flex-col gap-6">

                  <!-- Form para novo/editar tipo -->
                  <div class="border border-brand-200 p-4 bg-ink-100 flex flex-col gap-4">
                    <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                      {{ editingTipoId ? 'Editar Tipo' : 'Novo Tipo de Evento' }}
                    </h4>

                    <!-- Preview do tipo -->
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-widest self-start"
                      :style="{ border: `1px solid ${tipoForm.color}`, color: tipoForm.color, background: tipoForm.color + '22' }">
                      {{ tipoForm.icon }} {{ tipoForm.label || 'Novo Tipo' }}
                    </div>

                    <!-- Nome do tipo -->
                    <div class="flex flex-col gap-1.5">
                      <label class="input-label">Nome do Tipo *</label>
                      <input v-model="tipoForm.label" class="input-field" placeholder="Ex: Reza, Batizado, Festa..." maxlength="30" />
                    </div>

                    <!-- Ícone -->
                    <div class="flex flex-col gap-2">
                      <label class="input-label">Ícone</label>
                      <div class="flex gap-2 items-center">
                        <input v-model="tipoForm.icon" class="input-field w-20 text-center text-xl" maxlength="4" />
                        <span class="text-ink-400 text-xs font-mono">ou escolha:</span>
                      </div>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <button
                          v-for="ic in ICONES_SUGERIDOS" :key="ic"
                          type="button"
                          class="w-9 h-9 flex items-center justify-center text-xl border transition-all duration-150"
                          :class="tipoForm.icon === ic
                            ? 'border-gold-400 bg-gold-400/15'
                            : 'border-brand-200 hover:border-ink-400'"
                          @click="tipoForm.icon = ic"
                        >{{ ic }}</button>
                      </div>
                    </div>

                    <!-- Cor -->
                    <div class="flex flex-col gap-2">
                      <label class="input-label">Cor</label>
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="cor in CORES_PALETA" :key="cor.hex"
                          type="button"
                          class="flex flex-col items-center gap-1 group"
                          @click="tipoForm.color = cor.hex"
                        >
                          <div
                            class="w-8 h-8 rounded-sm border-2 transition-all duration-150"
                            :style="{ background: cor.hex, borderColor: tipoForm.color === cor.hex ? '#fff' : 'transparent' }"
                          />
                          <span class="font-mono text-[8px] text-ink-400 group-hover:text-ink-600 transition-colors">{{ cor.name }}</span>
                        </button>
                        <!-- Cor customizada -->
                        <div class="flex flex-col items-center gap-1">
                          <div class="relative w-8 h-8">
                            <input type="color" v-model="tipoForm.color"
                              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div class="w-8 h-8 rounded-sm border-2 border-dashed border-brand-200 flex items-center justify-center text-ink-400 text-xs"
                              :style="tipoForm.color && !CORES_PALETA.find(c=>c.hex===tipoForm.color) ? { background: tipoForm.color, borderColor: '#fff' } : {}">
                              +
                            </div>
                          </div>
                          <span class="font-mono text-[8px] text-ink-400">Custom</span>
                        </div>
                      </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex gap-3">
                      <button class="btn-gold flex-1" :disabled="savingTipo" @click="saveTipo">
                        {{ savingTipo ? 'Salvando...' : editingTipoId ? 'Salvar tipo ✓' : 'Criar tipo →' }}
                      </button>
                      <button v-if="editingTipoId" class="btn-danger" @click="editingTipoId = null; resetTipoForm()">Cancelar</button>
                    </div>
                  </div>

                  <!-- Lista de tipos existentes -->
                  <div>
                    <p class="font-mono text-[10px] uppercase tracking-widest text-ink-500 mb-3">Tipos cadastrados</p>
                    <div v-if="tipos.length === 0" class="text-ink-400 text-sm">Nenhum tipo ainda.</div>
                    <div v-else class="flex flex-col gap-[3px]">
                      <div
                        v-for="tipo in tipos" :key="tipo.id"
                        class="flex items-center gap-3 p-3 bg-ink-100 border border-brand-200"
                        :style="{ borderLeft: `3px solid ${tipo.color}` }"
                      >
                        <span class="text-xl w-7 text-center flex-shrink-0">{{ tipo.icon }}</span>
                        <div class="flex-1 min-w-0">
                          <div class="font-serif text-sm font-bold text-ink-800">{{ tipo.label }}</div>
                          <div class="font-mono text-[10px] text-ink-500 mt-0.5" :style="{ color: tipo.color }">{{ tipo.color }}</div>
                        </div>
                        <div class="flex gap-1.5 shrink-0">
                          <button class="btn-icon edit" @click="startEditTipo(tipo)" title="Editar">✎</button>
                          <button class="btn-icon" @click="removeTipo(tipo.id!)" title="Excluir">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Sair -->
              <div class="mt-6 flex justify-end">
                <button @click="doLogout" class="text-ink-400 font-mono text-[10px] hover:text-ink-600 transition-colors">
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
      class="fixed bottom-6 left-6 z-40 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all duration-200"
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
import type { Evento } from '~/composables/useEventos'
import type { TipoEvento } from '~/composables/useTiposEvento'
import { CORES_PALETA, ICONES_SUGERIDOS } from '~/composables/useTiposEvento'

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const REC_OPTIONS = [
  { val:'none',     label:'Sem repetição' },
  { val:'weekly',   label:'Semanal' },
  { val:'biweekly', label:'Quinzenal' },
  { val:'monthly',  label:'Mensal' },
]

// ── Composables ──
const { eventos, loading: loadingEv, subscribe: subEv, unsubscribeAll: unsubEv, addEventos, updateEvento, deleteEvento } = useEventos()
const { tipos, loading: loadingTipos, subscribe: subTipos, unsubscribeAll: unsubTipos, labelMap, colorMap, iconMap, addTipo, updateTipo, deleteTipo } = useTiposEvento()
const { isAdmin, login, logout } = useAdmin()

// ── Calendário ──
const now          = new Date()
const currentYear  = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())
const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())
const daysInMonth     = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

function dayOfWeek(d: number) { return new Date(currentYear.value, currentMonth.value, d).getDay() }
function dateStr(d: number) {
  return `${currentYear.value}-${String(currentMonth.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function isToday(d: number) {
  const t = new Date()
  return d === t.getDate() && currentMonth.value === t.getMonth() && currentYear.value === t.getFullYear()
}
function eventsForDay(d: number) { return eventos.value.filter(e => e.date === dateStr(d)) }
function prevMonth() { currentMonth.value--; if (currentMonth.value < 0) { currentMonth.value = 11; currentYear.value-- } }
function nextMonth() { currentMonth.value++; if (currentMonth.value > 11) { currentMonth.value = 0; currentYear.value++ } }
function goToday()   { currentYear.value = now.getFullYear(); currentMonth.value = now.getMonth() }
function scrollToDate(ds: string) {
  document.querySelector(`[data-event-date="${ds}"]`)?.scrollIntoView({ behavior:'smooth', block:'center' })
}

const upcomingEvents = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0)
  return eventos.value.filter(e => new Date(e.date+'T00:00:00') >= today).sort((a,b) => a.date.localeCompare(b.date))
})

// ── Formatação ──
function formatDay(date: string)  { return new Date(date+'T00:00:00').getDate().toString().padStart(2,'0') }
function formatMonth(date: string){ return MONTHS_PT[new Date(date+'T00:00:00').getMonth()].slice(0,3).toUpperCase() }
function formatDateFull(date: string) {
  const d = new Date(date+'T00:00:00')
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
function formatDateShort(date: string) {
  const d = new Date(date+'T00:00:00')
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`
}

function badgeStyle(typeId: string) {
  const color = colorMap.value[typeId] || '#D4A017'
  return { background: color + '22', color, border: `1px solid ${color}44` }
}

// ── Modal ──
const adminModal = ref(false)
const adminTab   = ref<'eventos'|'lista'|'tipos'>('eventos')
const adminTabs  = [
  { val: 'eventos', label: '＋ Novo Evento' },
  { val: 'lista',   label: 'Eventos' },
  { val: 'tipos',   label: '🎨 Tipos' },
]
const modalTitle = computed(() => {
  if (adminTab.value === 'tipos') return 'Gerenciar Tipos'
  if (adminTab.value === 'lista') return 'Todos os Eventos'
  return editingId.value ? 'Editar Evento' : 'Novo Evento'
})

// Login
const loginPass  = ref('')
const loginError = ref(false)
function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) { loginPass.value = '' }
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

// ── Form de Evento ──
const editingId = ref<string|null>(null)
const saving    = ref(false)
const form = reactive({
  name:'', type:'' as string, date:'', time:'', desc:'',
  recurrence:'none', recCount:4,
})

function resetForm() {
  form.name = ''; form.type = tipos.value[0]?.id || ''; form.date = ''; form.time = ''; form.desc = ''
  form.recurrence = 'none'; form.recCount = 4
}

// Sincronizar tipo padrão quando tipos carregarem
watch(tipos, (val) => {
  if (!form.type && val.length) form.type = val[0].id!
}, { immediate: true })

const previewDay = computed(() => form.date ? String(new Date(form.date+'T00:00:00').getDate()).padStart(2,'0') : '--')
const previewMon = computed(() => form.date ? MONTHS_PT[new Date(form.date+'T00:00:00').getMonth()].slice(0,3).toUpperCase() : '---')

const recurrenceDates = computed(() => {
  if (!form.date || form.recurrence === 'none') return []
  const dates: string[] = []
  const base = new Date(form.date+'T00:00:00')
  for (let i = 0; i < form.recCount; i++) {
    const d = new Date(base)
    if (form.recurrence === 'weekly')   d.setDate(base.getDate() + i*7)
    if (form.recurrence === 'biweekly') d.setDate(base.getDate() + i*14)
    if (form.recurrence === 'monthly')  d.setMonth(base.getMonth() + i)
    dates.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)
  }
  return dates
})

function startEditEvento(ev: Evento) {
  editingId.value = ev.id!
  form.name = ev.name; form.type = ev.type; form.date = ev.date
  form.time = ev.time || ''; form.desc = ev.desc || ''
  adminTab.value = 'eventos'
}

async function saveEvento() {
  if (!form.name.trim()) { alert('Preencha o nome!'); return }
  if (!form.date)        { alert('Selecione a data!'); return }
  if (!form.type)        { alert('Selecione o tipo!'); return }
  saving.value = true
  try {
    const payload = { name: form.name, type: form.type, date: form.date, time: form.time, desc: form.desc }
    if (editingId.value) {
      await updateEvento(editingId.value, payload)
      editingId.value = null
    } else {
      const dates = recurrenceDates.value.length ? recurrenceDates.value : [form.date]
      await addEventos(dates.map(d => ({ ...payload, date: d })))
    }
    resetForm()
    adminModal.value = false
  } finally { saving.value = false }
}

async function removeEvento(id: string) {
  if (!confirm('Excluir este evento?')) return
  await deleteEvento(id)
}

// ── Form de Tipo ──
const editingTipoId = ref<string|null>(null)
const savingTipo    = ref(false)
const tipoForm = reactive({ label:'', icon:'⚔️', color:'#D4A017' })

function resetTipoForm() { tipoForm.label = ''; tipoForm.icon = '⚔️'; tipoForm.color = '#D4A017' }

function startEditTipo(tipo: TipoEvento) {
  editingTipoId.value = tipo.id!
  tipoForm.label = tipo.label; tipoForm.icon = tipo.icon; tipoForm.color = tipo.color
}

async function saveTipo() {
  if (!tipoForm.label.trim()) { alert('Dê um nome ao tipo!'); return }
  savingTipo.value = true
  try {
    if (editingTipoId.value) {
      await updateTipo(editingTipoId.value, { label: tipoForm.label, icon: tipoForm.icon, color: tipoForm.color })
      editingTipoId.value = null
    } else {
      await addTipo({ label: tipoForm.label, icon: tipoForm.icon, color: tipoForm.color, ordem: tipos.value.length })
    }
    resetTipoForm()
  } finally { savingTipo.value = false }
}

async function removeTipo(id: string) {
  if (!confirm('Excluir este tipo? Eventos com este tipo perderão a referência.')) return
  await deleteTipo(id)
}

// ── Lifecycle ──
onMounted(() => { subEv(); subTipos() })
onUnmounted(() => { unsubEv(); unsubTipos() })
</script>

<style scoped>
.cal-nav-btn { @apply w-10 h-10 border border-brand-200 bg-transparent text-brand-400 text-lg cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-brand-400 hover:text-white; }
.cal-cell { @apply aspect-square border border-transparent relative cursor-pointer transition-all duration-200 bg-ink-100 flex flex-col p-1.5 min-h-[56px] hover:border-gold-400/25 hover:bg-ink-200; }
.cal-cell.today { @apply border-gold-400 bg-gold-400/15; }
.cal-cell.today .cell-num { @apply text-gold-400 font-bold; }
.cal-cell.has-event { @apply border-gold-400/20; }
.cal-cell.has-event::after { content:''; @apply absolute bottom-0 left-0 right-0 h-[2px]; background:repeating-linear-gradient(90deg,#D4A017 0,#D4A017 6px,transparent 6px,transparent 9px); opacity:.5; }
.cal-cell.sunday .cell-num, .cal-cell.saturday .cell-num { @apply text-crimson-400 opacity-70; }
.cell-num  { @apply font-mono text-[11px] md:text-[13px] text-ink-600 leading-none mb-1; }
.cell-dots { @apply flex flex-wrap gap-[3px] mt-auto; }
.cell-dot  { @apply w-[6px] h-[6px] rotate-45; }
.event-item { @apply grid relative bg-ink-100 border border-brand-200 cursor-pointer transition-all duration-200 overflow-hidden hover:border-gold-400/25; grid-template-columns:72px 1fr auto; }
.event-date-col { @apply px-3 py-4 border-r border-brand-200 text-center flex flex-col justify-center; }
.event-date-day { @apply font-serif text-2xl font-black text-ink-800 leading-none; }
.event-date-month { @apply font-mono text-[9px] uppercase tracking-widest text-ink-400; }
.event-type-badge { @apply inline-block font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 mb-1.5; }
.event-body { @apply py-3 px-4; }
.event-name  { @apply font-serif text-lg font-bold text-ink-800 leading-tight mb-1; }
.event-desc  { @apply text-xs text-ink-500 leading-relaxed; }
.event-time  { @apply font-mono text-[11px] text-gold-400 mt-1; }
.event-arrow { @apply px-4 text-gold-400/30 text-lg self-center transition-transform duration-200; }
.event-item:hover .event-arrow { @apply translate-x-1; }
.section-label { @apply font-mono text-[10px] uppercase tracking-[0.35em] text-gold-400 flex items-center gap-3; }
.section-label::before { content:''; @apply block w-[6px] h-[6px] bg-gold-400 rotate-45; }
.input-label { @apply font-mono text-[10px] uppercase tracking-widest text-gold-400; }
.input-field  { @apply bg-ink-100 border border-brand-200 text-ink-800 font-mono text-sm px-3 py-2.5 outline-none w-full transition-colors duration-200 focus:border-gold-400; }
.btn-gold   { @apply bg-gold-400 text-white border-none font-mono text-[11px] uppercase tracking-widest py-3 px-6 cursor-pointer font-medium transition-all duration-200 hover:bg-gold-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-danger { @apply bg-transparent text-crimson-400 border border-crimson-400/30 font-mono text-[10px] uppercase tracking-widest py-2 px-4 cursor-pointer transition-all duration-200 hover:bg-crimson-400 hover:text-white; }
.btn-icon   { @apply w-7 h-7 border border-brand-200 bg-none text-ink-500 text-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-crimson-400 hover:text-crimson-400; }
.btn-icon.edit { @apply hover:border-gold-400 hover:text-gold-400; }
.admin-tab  { @apply font-mono text-[10px] uppercase tracking-widest px-4 py-3 bg-none border-none text-ink-500 cursor-pointer border-b-2 border-transparent -mb-px transition-all duration-200 whitespace-nowrap; }
.admin-tab.active { @apply text-gold-400 border-gold-400; }
.admin-tab:hover:not(.active) { @apply text-ink-600; }
.type-btn { @apply flex flex-col items-center gap-1.5 py-3 px-2 bg-ink-100 border border-brand-200 cursor-pointer transition-all duration-200 font-mono text-[9px] uppercase tracking-widest text-ink-500 hover:border-brand-400 hover:text-brand-400; }
.rec-btn  { @apply font-mono text-[9px] uppercase tracking-widest py-1.5 px-3 border border-brand-200 bg-none text-ink-500 cursor-pointer transition-all duration-200 hover:border-brand-400 hover:text-brand-400; }
.rec-btn.sel { border-color:#D4A017; color:#D4A017; background:rgba(212,160,23,.15); }
.count-btn { @apply w-7 h-full bg-none border-none text-gold-400 text-base cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-gold-400/15; }
.form-divider { @apply flex items-center gap-2 text-ink-400 font-mono text-[9px] uppercase tracking-widest; }
.form-divider::before,.form-divider::after { content:''; @apply flex-1 h-px bg-brand-200; }
.fade-enter-active,.fade-leave-active { transition:opacity 0.3s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
@media(max-width:640px){
  .cal-cell{min-height:44px}.cell-num{font-size:11px}.cell-dot{width:5px;height:5px}
  .event-item{grid-template-columns:56px 1fr auto}.event-date-day{font-size:20px}.event-arrow{padding:0 10px}
}
</style>
