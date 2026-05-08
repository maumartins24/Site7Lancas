<template>
  <div>
    <!-- ── CALENDÁRIO ── -->
    <div class="cal-section">

      <!-- Navegação do mês -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-3xl md:text-4xl font-black text-white">
          {{ MONTHS_PT[currentMonth] }}
          <span class="text-gold-400 italic">{{ currentYear }}</span>
        </h2>
        <div class="flex gap-2">
          <button @click="prevMonth" class="cal-nav-btn">←</button>
          <button @click="goToday"   class="cal-nav-btn text-xs px-3">Hoje</button>
          <button @click="nextMonth" class="cal-nav-btn">→</button>
        </div>
      </div>

      <!-- Dias da semana -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="(d, i) in WEEKDAYS"
          :key="d"
          class="text-center py-2 font-mono text-[10px] tracking-widest uppercase"
          :class="i === 0 || i === 6 ? 'text-crimson-400 opacity-70' : 'text-ink-400'"
        >{{ d }}</div>
      </div>

      <!-- Grade de dias -->
      <div class="grid grid-cols-7 gap-[3px]">
        <!-- Células vazias antes do dia 1 -->
        <div
          v-for="_ in firstDayOfMonth"
          :key="'e'+_"
          class="aspect-square"
        />

        <!-- Dias -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="cal-cell group"
          :class="{
            'today':     isToday(day),
            'has-event': eventsForDay(day).length > 0,
            'sunday':    dayOfWeek(day) === 0,
            'saturday':  dayOfWeek(day) === 6,
          }"
          @click="scrollToDate(dateStr(day))"
        >
          <span class="cell-num">{{ day }}</span>
          <div class="cell-dots">
            <div
              v-for="ev in eventsForDay(day)"
              :key="ev.id"
              class="cell-dot"
              :style="{ background: TYPE_COLORS[ev.type] || '#D4A017' }"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-4 text-center font-mono text-xs text-ink-400 tracking-widest">
        Carregando eventos...
      </div>
    </div>

    <div class="kente-thin my-12" />

    <!-- ── LISTA DE PRÓXIMOS EVENTOS ── -->
    <div>
      <div class="section-label mb-5">Próximos Eventos</div>
      <h2 class="font-serif text-3xl md:text-4xl font-black text-white mb-8">
        Nossos <span class="text-gold-400 italic">Encontros</span>
      </h2>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-20 bg-ink-800 animate-pulse" />
      </div>

      <!-- Sem eventos -->
      <div
        v-else-if="upcomingEvents.length === 0"
        class="p-12 text-center border border-dashed border-gold-400/20 text-ink-400"
      >
        <p class="font-serif text-xl text-ink-200 mb-2">Nenhum evento agendado 🌙</p>
        <p class="text-sm">Fique de olho — novidades em breve!</p>
      </div>

      <!-- Lista -->
      <div v-else class="flex flex-col gap-[3px]">
        <div
          v-for="ev in upcomingEvents"
          :key="ev.id"
          class="event-item"
          :data-type="ev.type"
          :data-event-date="ev.date"
        >
          <!-- Barra lateral colorida -->
          <div
            class="absolute left-0 top-0 bottom-0 w-[3px]"
            :style="{ background: TYPE_COLORS[ev.type] }"
          />

          <!-- Data -->
          <div class="event-date-col">
            <div class="event-date-day">{{ formatDay(ev.date) }}</div>
            <div class="event-date-month">{{ formatMonth(ev.date) }}</div>
          </div>

          <!-- Corpo -->
          <div class="event-body">
            <div class="event-type-badge" :class="ev.type">
              {{ TYPE_ICONS[ev.type] }} {{ TYPE_LABELS[ev.type] }}
            </div>
            <div class="event-name">{{ ev.name }}</div>
            <div v-if="ev.desc" class="event-desc">{{ ev.desc }}</div>
            <div v-if="ev.time" class="event-time">⏰ {{ ev.time }}</div>
          </div>

          <div class="event-arrow">→</div>
        </div>
      </div>
    </div>

    <!-- ── MODAL ADMIN ── -->
    <Transition name="fade">
      <div
        v-if="adminModal"
        class="fixed inset-0 bg-ink-900/90 backdrop-blur-lg z-50 flex items-center justify-center p-6"
        @click.self="adminModal = false"
      >
        <div class="bg-ink-800 border border-gold-400/25 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="kente" />
          <div class="flex items-center justify-between p-6 border-b border-ink-700">
            <h3 class="font-serif text-xl text-white">
              {{ isAdmin ? 'Gerenciar Eventos' : 'Área Admin' }}
            </h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl">✕</button>
          </div>
          <div class="p-6">
            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4">
              <p class="text-sm text-ink-400">Digite a senha para gerenciar eventos.</p>
              <div v-if="loginError" class="text-crimson-400 text-xs font-mono p-2 border border-crimson-400/30 bg-crimson-400/10">
                Senha incorreta.
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="input-label">Senha</label>
                <input
                  v-model="loginPass"
                  type="password"
                  class="input-field"
                  placeholder="••••••••"
                  @keydown.enter="doLogin"
                />
              </div>
              <button class="btn-gold w-full" @click="doLogin">Entrar →</button>
            </div>

            <!-- PAINEL ADMIN -->
            <div v-else>
              <!-- Abas -->
              <div class="flex border-b border-ink-700 mb-5">
                <button
                  v-for="t in adminTabs"
                  :key="t.val"
                  class="admin-tab"
                  :class="{ active: adminTab === t.val }"
                  @click="adminTab = t.val; editingId = null"
                >{{ t.label }}</button>
              </div>

              <!-- FORM novo/editar evento -->
              <div v-if="adminTab === 'add'" class="flex flex-col gap-4">

                <!-- Preview -->
                <div class="border border-gold-400/20 bg-ink-900 overflow-hidden">
                  <div class="bg-ink-800 px-3 py-2 text-[9px] font-mono uppercase tracking-widest text-ink-600 flex items-center gap-2">
                    <div class="w-[5px] h-[5px] bg-gold-400 rotate-45 opacity-50" />
                    Prévia do evento
                  </div>
                  <div class="grid grid-cols-[56px_1fr] relative min-h-[64px]">
                    <div class="absolute left-0 top-0 bottom-0 w-[3px] transition-all" :style="{ background: TYPE_COLORS[form.type] }" />
                    <div class="pl-4 pr-2 py-3 border-r border-ink-700 flex flex-col justify-center text-center">
                      <div class="font-serif text-2xl font-black text-white leading-none">{{ previewDay }}</div>
                      <div class="font-mono text-[8px] uppercase tracking-widest text-ink-400">{{ previewMon }}</div>
                    </div>
                    <div class="p-3 flex flex-col justify-center">
                      <div class="event-type-badge mb-1 text-[8px]" :class="form.type">
                        {{ TYPE_ICONS[form.type] }} {{ TYPE_LABELS[form.type] }}
                      </div>
                      <div class="font-serif text-sm font-bold leading-tight" :class="form.name ? 'text-white' : 'text-ink-600 italic font-normal'">
                        {{ form.name || 'Nome do evento...' }}
                      </div>
                      <div v-if="form.time" class="font-mono text-[10px] text-gold-400 mt-1">⏰ {{ form.time }}</div>
                    </div>
                  </div>
                </div>

                <!-- Tipo -->
                <div class="flex flex-col gap-1.5">
                  <label class="input-label">Tipo *</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="[val, lbl] in Object.entries(TYPE_LABELS)"
                      :key="val"
                      type="button"
                      class="type-btn"
                      :class="{ selected: form.type === val, [val]: form.type === val }"
                      :data-val="val"
                      @click="form.type = val as any"
                    >
                      <span class="text-xl">{{ TYPE_ICONS[val] }}</span>
                      <span>{{ lbl }}</span>
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
                  <textarea v-model="form.desc" class="input-field resize-y" rows="3" maxlength="300" placeholder="Detalhes, local, o que levar..." />
                  <div class="text-right font-mono text-[9px]" :class="form.desc?.length > 260 ? 'text-crimson-400' : 'text-ink-600'">
                    {{ form.desc?.length || 0 }} / 300
                  </div>
                </div>

                <!-- Recorrência (só para novos eventos) -->
                <template v-if="!editingId">
                  <div class="form-divider">Repetição</div>
                  <div class="flex flex-col gap-2">
                    <label class="input-label">Repetir?</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="r in REC_OPTIONS"
                        :key="r.val"
                        type="button"
                        class="rec-btn"
                        :class="{ sel: form.recurrence === r.val }"
                        @click="form.recurrence = r.val"
                      >{{ r.label }}</button>
                    </div>
                    <div v-if="form.recurrence !== 'none'" class="flex items-center gap-3 mt-1">
                      <span class="font-mono text-xs text-ink-400">Quantas vezes?</span>
                      <div class="flex border border-ink-600 overflow-hidden">
                        <button type="button" class="count-btn" @click="form.recCount = Math.max(2, form.recCount - 1)">−</button>
                        <span class="w-10 text-center font-mono text-sm text-white bg-ink-900 py-1">{{ form.recCount }}</span>
                        <button type="button" class="count-btn" @click="form.recCount = Math.min(52, form.recCount + 1)">+</button>
                      </div>
                    </div>
                    <!-- Preview das datas -->
                    <div v-if="form.recurrence !== 'none' && recurrenceDates.length" class="flex flex-wrap gap-1.5 mt-1">
                      <span
                        v-for="d in recurrenceDates"
                        :key="d"
                        class="font-mono text-[9px] px-2 py-1 border border-gold-400/25 text-gold-400"
                      >{{ formatDateShort(d) }}</span>
                    </div>
                  </div>
                </template>

                <!-- Botões -->
                <div class="flex gap-3 pt-2">
                  <button class="btn-gold flex-1" :disabled="saving" @click="saveEvento">
                    {{ saving ? 'Salvando...' : editingId ? 'Salvar alterações ✓' : 'Adicionar evento →' }}
                  </button>
                  <button v-if="editingId" class="btn-danger" @click="editingId = null; resetForm()">Cancelar</button>
                </div>
                <button @click="doLogout" class="text-ink-600 font-mono text-[10px] self-end hover:text-ink-400 transition-colors">
                  Sair do admin
                </button>
              </div>

              <!-- LISTA DE EVENTOS -->
              <div v-if="adminTab === 'list'" class="flex flex-col gap-0">
                <p v-if="eventos.length === 0" class="text-ink-400 text-sm py-4">Nenhum evento ainda.</p>
                <div
                  v-for="ev in [...eventos].sort((a,b) => a.date.localeCompare(b.date))"
                  :key="ev.id"
                  class="flex items-center gap-3 py-3 border-b border-ink-700"
                  :style="{ borderLeft: `3px solid ${TYPE_COLORS[ev.type]}`, paddingLeft: '12px' }"
                >
                  <div class="flex-1 min-w-0">
                    <div class="font-serif text-sm text-white truncate">{{ ev.name }}</div>
                    <div class="font-mono text-[10px] text-ink-400 mt-0.5">
                      {{ formatDateFull(ev.date) }}{{ ev.time ? ' · ' + ev.time : '' }} · {{ TYPE_LABELS[ev.type] }}
                    </div>
                  </div>
                  <div class="flex gap-1.5 shrink-0">
                    <button class="btn-icon edit" @click="startEdit(ev)" title="Editar">✎</button>
                    <button class="btn-icon" @click="removeEvento(ev.id!)" title="Excluir">✕</button>
                  </div>
                </div>
                <button @click="doLogout" class="text-ink-600 font-mono text-[10px] self-end mt-4 hover:text-ink-400 transition-colors">
                  Sair do admin
                </button>
              </div>
            </div>
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

// ── Constantes ──
const MONTHS_PT  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const TYPE_COLORS: Record<string,string> = { gira:'#D4A017', evento:'#2e7d8c', desenvolvimento:'#6b4c9e' }
const TYPE_LABELS: Record<string,string> = { gira:'Gira', evento:'Evento Aberto', desenvolvimento:'Desenvolvimento' }
const TYPE_ICONS:  Record<string,string> = { gira:'⚔️', evento:'🌍', desenvolvimento:'🌿' }
const REC_OPTIONS = [
  { val:'none',     label:'Sem repetição' },
  { val:'weekly',   label:'Semanal' },
  { val:'biweekly', label:'Quinzenal' },
  { val:'monthly',  label:'Mensal' },
]

// ── Composables ──
const { eventos, loading, subscribe, unsubscribeAll, addEvento, addEventos, updateEvento, deleteEvento } = useEventos()
const { isAdmin, login, logout } = useAdmin()

// ── Estado do calendário ──
const now          = new Date()
const currentYear  = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())
const daysInMonth     = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())

function dayOfWeek(day: number) { return new Date(currentYear.value, currentMonth.value, day).getDay() }
function dateStr(day: number) {
  return `${currentYear.value}-${String(currentMonth.value+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}
function isToday(day: number) {
  const t = new Date()
  return day === t.getDate() && currentMonth.value === t.getMonth() && currentYear.value === t.getFullYear()
}
function eventsForDay(day: number) {
  const ds = dateStr(day)
  return eventos.value.filter(e => e.date === ds)
}

function prevMonth() { currentMonth.value--; if (currentMonth.value < 0) { currentMonth.value = 11; currentYear.value-- } }
function nextMonth() { currentMonth.value++; if (currentMonth.value > 11) { currentMonth.value = 0; currentYear.value++ } }
function goToday()   { currentYear.value = now.getFullYear(); currentMonth.value = now.getMonth() }

function scrollToDate(ds: string) {
  const el = document.querySelector(`[data-event-date="${ds}"]`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// ── Eventos futuros ──
const upcomingEvents = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0)
  return eventos.value
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .sort((a,b) => a.date.localeCompare(b.date))
})

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

// ── Modal / Admin ──
const adminModal = ref(false)
const adminTab   = ref<'add'|'list'>('add')
const loginPass  = ref('')
const loginError = ref(false)
const editingId  = ref<string|null>(null)
const saving     = ref(false)

const form = reactive({
  name: '', type: 'gira' as 'gira'|'evento'|'desenvolvimento',
  date: '', time: '', desc: '',
  recurrence: 'none', recCount: 4,
})

function resetForm() {
  form.name = ''; form.type = 'gira'; form.date = ''; form.time = ''; form.desc = ''
  form.recurrence = 'none'; form.recCount = 4
}

function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) { loginPass.value = ''; loginError.value = false }
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

function startEdit(ev: Evento) {
  editingId.value    = ev.id!
  form.name          = ev.name
  form.type          = ev.type
  form.date          = ev.date
  form.time          = ev.time || ''
  form.desc          = ev.desc || ''
  adminTab.value     = 'add'
}

// Preview do formulário
const previewDay = computed(() => form.date ? String(new Date(form.date+'T00:00:00').getDate()).padStart(2,'0') : '--')
const previewMon = computed(() => form.date ? MONTHS_PT[new Date(form.date+'T00:00:00').getMonth()].slice(0,3).toUpperCase() : '---')

// Datas de recorrência
const recurrenceDates = computed(() => {
  if (!form.date || form.recurrence === 'none') return []
  const dates: string[] = []
  const base = new Date(form.date + 'T00:00:00')
  for (let i = 0; i < form.recCount; i++) {
    const d = new Date(base)
    if (form.recurrence === 'weekly')   d.setDate(base.getDate() + i * 7)
    if (form.recurrence === 'biweekly') d.setDate(base.getDate() + i * 14)
    if (form.recurrence === 'monthly')  d.setMonth(base.getMonth() + i)
    dates.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)
  }
  return dates
})

async function saveEvento() {
  if (!form.name.trim()) { alert('Preencha o nome!'); return }
  if (!form.date)        { alert('Selecione a data!'); return }
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
  } finally {
    saving.value = false
  }
}

async function removeEvento(id: string) {
  if (!confirm('Excluir este evento?')) return
  await deleteEvento(id)
}

// ── Lifecycle ──
onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.cal-section { @apply mb-14; }

.cal-nav-btn {
  @apply w-10 h-10 border border-gold-400/25 bg-transparent text-gold-400 text-lg cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gold-400 hover:text-ink-900;
}

.cal-cell {
  @apply aspect-square border border-transparent relative cursor-pointer transition-all duration-200 bg-ink-800 flex flex-col p-1.5 min-h-[56px] hover:border-gold-400/25 hover:bg-ink-700;
}
.cal-cell.today    { @apply border-gold-400 bg-gold-400/15; }
.cal-cell.today .cell-num { @apply text-gold-400 font-bold; }
.cal-cell.has-event { @apply border-gold-400/20; }
.cal-cell.has-event::after {
  content: '';
  @apply absolute bottom-0 left-0 right-0 h-[2px];
  background: repeating-linear-gradient(90deg, #D4A017 0, #D4A017 6px, transparent 6px, transparent 9px);
  opacity: 0.5;
}
.cal-cell.sunday .cell-num,
.cal-cell.saturday .cell-num { @apply text-crimson-400 opacity-70; }

.cell-num  { @apply font-mono text-[11px] md:text-[13px] text-ink-200 leading-none mb-1; }
.cell-dots { @apply flex flex-wrap gap-[3px] mt-auto; }
.cell-dot  { @apply w-[6px] h-[6px] rotate-45; }

.event-item {
  @apply grid relative bg-ink-800 border border-transparent cursor-pointer transition-all duration-200 overflow-hidden hover:border-gold-400/25;
  grid-template-columns: 72px 1fr auto;
}
.event-date-col   { @apply px-3 py-4 border-r border-ink-700 text-center flex flex-col justify-center; }
.event-date-day   { @apply font-serif text-2xl font-black text-white leading-none; }
.event-date-month { @apply font-mono text-[9px] uppercase tracking-widest text-ink-400; }
.event-body       { @apply py-3 px-4; }
.event-type-badge { @apply inline-block font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 mb-1.5; }
.event-type-badge.gira          { background: rgba(212,160,23,.15); color: #D4A017; }
.event-type-badge.evento        { background: rgba(46,125,140,.15); color: #2e7d8c; }
.event-type-badge.desenvolvimento { background: rgba(107,76,158,.15); color: #6b4c9e; }
.event-name  { @apply font-serif text-lg font-bold text-white leading-tight mb-1; }
.event-desc  { @apply text-xs text-ink-400 leading-relaxed; }
.event-time  { @apply font-mono text-[11px] text-gold-400 mt-1; }
.event-arrow { @apply px-4 text-gold-400/30 text-lg self-center transition-transform duration-200; }
.event-item:hover .event-arrow { @apply translate-x-1; }

.section-label {
  @apply font-mono text-[10px] uppercase tracking-[0.35em] text-gold-400 flex items-center gap-3;
}
.section-label::before {
  content: '';
  @apply block w-[6px] h-[6px] bg-gold-400 rotate-45;
}

/* Admin */
.input-label { @apply font-mono text-[10px] uppercase tracking-widest text-gold-400; }
.input-field  { @apply bg-ink-900 border border-ink-600 text-white font-mono text-sm px-3 py-2.5 outline-none w-full transition-colors duration-200 focus:border-gold-400; }
.btn-gold     { @apply bg-gold-400 text-ink-900 border-none font-mono text-[11px] uppercase tracking-widest py-3 px-6 cursor-pointer font-medium transition-all duration-200 hover:bg-gold-200; }
.btn-danger   { @apply bg-transparent text-crimson-400 border border-crimson-400/30 font-mono text-[10px] uppercase tracking-widest py-2 px-4 cursor-pointer transition-all duration-200 hover:bg-crimson-400 hover:text-white; }
.btn-icon     { @apply w-7 h-7 border border-ink-600 bg-none text-ink-400 text-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-crimson-400 hover:text-crimson-400; }
.btn-icon.edit { @apply hover:border-gold-400 hover:text-gold-400; }
.admin-tab    { @apply font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-none border-none text-ink-400 cursor-pointer border-b-2 border-transparent -mb-px transition-all duration-200; }
.admin-tab.active { @apply text-gold-400 border-gold-400; }
.admin-tab:hover:not(.active) { @apply text-ink-200; }
.type-btn     { @apply flex flex-col items-center gap-2 py-3 px-2 bg-ink-900 border border-ink-600 cursor-pointer transition-all duration-200 font-mono text-[9px] uppercase tracking-widest text-ink-400 hover:border-ink-400 hover:text-ink-200; }
.type-btn.selected.gira          { border-color: #D4A017; background: rgba(212,160,23,.1); color: #D4A017; }
.type-btn.selected.evento        { border-color: #2e7d8c; background: rgba(46,125,140,.1); color: #2e7d8c; }
.type-btn.selected.desenvolvimento { border-color: #6b4c9e; background: rgba(107,76,158,.1); color: #6b4c9e; }
.rec-btn  { @apply font-mono text-[9px] uppercase tracking-widest py-1.5 px-3 border border-ink-600 bg-none text-ink-400 cursor-pointer transition-all duration-200 hover:border-ink-400 hover:text-ink-200; }
.rec-btn.sel { border-color: #D4A017; color: #D4A017; background: rgba(212,160,23,.15); }
.count-btn { @apply w-7 bg-none border-none text-gold-400 text-base cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-gold-400/15; }
.form-divider { @apply flex items-center gap-2 text-ink-600 font-mono text-[9px] uppercase tracking-widest; }
.form-divider::before,.form-divider::after { content:''; @apply flex-1 h-px bg-ink-700; }

.fade-enter-active,.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,.fade-leave-to       { opacity: 0; }

@media (max-width: 640px) {
  .cal-cell { min-height: 44px; }
  .cell-num { font-size: 11px; }
  .cell-dot { width: 5px; height: 5px; }
  .event-item { grid-template-columns: 56px 1fr auto; }
  .event-date-day { font-size: 20px; }
  .event-arrow { padding: 0 10px; }
}
</style>
