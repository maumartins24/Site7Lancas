<template>
  <div>

    <!-- RESUMO -->
    <div class="grid grid-cols-3 gap-[3px] mb-10">
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ aniversariantesDoMes.length }}</div>
        <div class="summary-label">Este mês</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ aniversariantes.length }}</div>
        <div class="summary-label">Cadastrados</div>
      </div>
      <div class="summary-card">
        <div class="font-serif text-3xl font-black text-gold-400">{{ aniversariantesHoje.length > 0 ? '🎂' : '—' }}</div>
        <div class="summary-label">Hoje</div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-16 bg-ink-100 animate-pulse" />
    </div>

    <template v-else>

      <!-- ANIVERSARIANTES DE HOJE -->
      <div v-if="aniversariantesHoje.length" class="mb-10">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-[3px] h-5 bg-gold-400" />
          <h3 class="font-serif text-2xl font-bold text-ink-800">Parabéns! 🎉</h3>
          <div class="flex-1 h-px bg-brand-200" />
        </div>

        <div class="flex flex-col gap-[3px]">
          <div
            v-for="a in aniversariantesHoje" :key="a.id"
            class="birthday-card today"
          >
            <div class="w-[3px] shrink-0 bg-gold-400" />
            <div class="flex-1 p-4 flex items-center gap-4">
              <div class="w-12 h-12 bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-2xl shrink-0">
                🎂
              </div>
              <div>
                <div class="font-serif text-lg font-bold text-ink-800">{{ a.nome }}</div>
                <div class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                  Aniversário hoje!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PRÓXIMOS ANIVERSARIANTES -->
      <div v-if="proximosAniversariantes.length" class="mb-10">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-[3px] h-5 bg-brand-400" />
          <h3 class="font-serif text-2xl font-bold text-ink-800">Próximos</h3>
          <div class="flex-1 h-px bg-brand-200" />
        </div>

        <div class="flex flex-col gap-[3px]">
          <div
            v-for="a in proximosAniversariantes" :key="a.id"
            class="birthday-card"
          >
            <div class="w-[3px] shrink-0"
              :class="a.diasAte === 0 ? 'bg-gold-400' : a.diasAte <= 7 ? 'bg-brand-400' : 'bg-brand-200'" />

            <div class="date-col">
              <div class="font-serif text-2xl font-black text-ink-800 leading-none">
                {{ String(a.dia).padStart(2, '0') }}
              </div>
              <div class="font-mono text-[9px] uppercase tracking-widest text-ink-400">
                {{ nomeMes(a.mes).slice(0, 3) }}
              </div>
            </div>

            <div class="flex-1 p-4">
              <div class="font-serif text-base font-bold text-ink-800">{{ a.nome }}</div>
              <div class="font-mono text-[10px] text-ink-400/70">
                <template v-if="a.diasAte === 0">🎂 Hoje!</template>
                <template v-else-if="a.diasAte === 1">Amanhã</template>
                <template v-else>em ~{{ a.diasAte }} dias</template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TODOS POR MÊS -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <div class="w-[3px] h-5 bg-brand-200" />
          <h3 class="font-serif text-2xl font-bold text-ink-800">Calendário Anual</h3>
          <div class="flex-1 h-px bg-brand-200" />
        </div>

        <div v-if="!aniversariantes.length" class="py-10 text-center border border-dashed border-gold-400/20 text-ink-500">
          <p class="font-serif text-lg text-ink-600 mb-1">Nenhum aniversariante cadastrado 🎂</p>
          <p class="text-sm">Use o botão Admin para adicionar.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="mes in mesesComAniversariantes" :key="mes"
            class="border border-brand-200 bg-ink-100 overflow-hidden"
            :class="{ 'border-gold-400/40': mes === mesAtual }"
          >
            <div class="px-4 py-2 border-b border-brand-200 flex items-center justify-between"
              :class="mes === mesAtual ? 'bg-gold-400/10' : 'bg-white'">
              <span class="font-serif text-sm font-bold text-ink-800">{{ nomeMes(mes) }}</span>
              <span class="font-mono text-[9px] text-ink-400">{{ doMes(mes).value.length }}</span>
            </div>
            <div class="p-3 flex flex-col gap-1.5">
              <div
                v-for="a in doMes(mes).value" :key="a.id"
                class="flex items-center gap-2 font-mono text-[11px]"
                :class="ehHoje(a) ? 'text-gold-400 font-bold' : 'text-ink-600'"
              >
                <span class="w-5 text-right shrink-0 text-ink-400">{{ a.dia }}</span>
                <span class="w-px h-3 bg-brand-200" />
                <span class="truncate">{{ a.nome }}</span>
                <span v-if="ehHoje(a)" class="ml-auto">🎂</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- MODAL ADMIN -->
    <Transition name="fade">
      <div v-if="adminModal"
        class="fixed inset-0 bg-ink-900/50 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        @click.self="adminModal = false"
        role="dialog" aria-label="Admin — Aniversariantes"
      >
        <div class="bg-white border border-brand-200 shadow-xl w-full max-w-lg max-h-[92vh] flex flex-col">
          <div class="kente shrink-0" />
          <div class="flex items-center justify-between px-6 py-4 border-b border-brand-200 shrink-0">
            <h3 class="font-serif text-xl text-ink-800">Admin — Aniversariantes</h3>
            <button @click="adminModal = false" class="text-ink-400 hover:text-gold-400 transition-colors text-xl">✕</button>
          </div>

          <div class="overflow-y-auto flex-1 p-6">

            <!-- LOGIN -->
            <div v-if="!isAdmin" class="flex flex-col gap-4 max-w-sm mx-auto">
              <p class="text-sm text-ink-500 text-center">Digite a senha para gerenciar aniversariantes.</p>
              <div v-if="loginError" class="font-mono text-xs text-crimson-400 p-2 border border-crimson-400/30 bg-crimson-400/10">Senha incorreta.</div>
              <div class="flex flex-col gap-1.5">
                <label class="input-label">Senha</label>
                <input v-model="loginPass" type="password" class="input-field" placeholder="••••••••" @keydown.enter="doLogin" />
              </div>
              <button class="btn-gold w-full" @click="doLogin">Entrar →</button>
            </div>

            <!-- PAINEL ADMIN -->
            <template v-else>

              <!-- Form -->
              <div class="border border-brand-200 bg-ink-100 p-4 flex flex-col gap-3 mb-6">
                <h4 class="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                  {{ editingId ? 'Editar Aniversariante' : 'Adicionar Aniversariante' }}
                </h4>

                <div class="flex flex-col gap-1.5">
                  <label class="input-label">Nome *</label>
                  <input v-model="form.nome" class="input-field" placeholder="Ex: Maria" maxlength="60" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Dia *</label>
                    <div class="flex border border-brand-200 overflow-hidden">
                      <button type="button" class="count-btn" @click="form.dia = Math.max(1, form.dia - 1)">−</button>
                      <span class="flex-1 text-center font-mono text-sm text-ink-800 bg-ink-100 py-2.5">{{ form.dia }}</span>
                      <button type="button" class="count-btn" @click="form.dia = Math.min(31, form.dia + 1)">+</button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="input-label">Mês *</label>
                    <select v-model.number="form.mes" class="input-field">
                      <option v-for="m in 12" :key="m" :value="m">{{ nomeMes(m) }}</option>
                    </select>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button class="btn-gold flex-1" :disabled="saving" @click="save">
                    {{ saving ? 'Salvando...' : editingId ? 'Salvar ✓' : 'Adicionar →' }}
                  </button>
                  <button v-if="editingId" class="btn-danger" @click="cancelEdit">Cancelar</button>
                </div>
              </div>

              <!-- Lista -->
              <div>
                <p class="font-mono text-[10px] uppercase tracking-widest text-ink-500 mb-3">
                  Cadastrados ({{ aniversariantes.length }})
                </p>
                <div v-if="!aniversariantes.length" class="text-ink-400 text-sm font-mono">Nenhum aniversariante.</div>
                <div v-else class="flex flex-col gap-[3px]">
                  <div
                    v-for="a in sortedAll" :key="a.id"
                    class="flex items-center gap-3 bg-ink-100 border border-brand-200 px-4 py-3"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-ink-800 truncate">{{ a.nome }}</div>
                      <div class="font-mono text-[10px] text-ink-500 mt-0.5">
                        {{ String(a.dia).padStart(2, '0') }}/{{ String(a.mes).padStart(2, '0') }}
                        · {{ nomeMes(a.mes) }}
                      </div>
                    </div>
                    <div class="flex gap-1.5 shrink-0">
                      <button class="icon-btn edit" @click="startEdit(a)">✎</button>
                      <button class="icon-btn del" @click="remove(a.id!)">✕</button>
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
      :class="isAdmin ? 'bg-gold-400 text-white border-gold-400' : 'bg-transparent text-gold-400 border-gold-400/30 hover:border-gold-400'"
      @click="adminModal = true"
    >{{ isAdmin ? '⚙ Admin' : 'Admin' }}</button>

  </div>
</template>

<script setup lang="ts">
import type { Aniversariante } from '~/composables/useAniversariantes'

const {
  aniversariantes, loading,
  subscribe, unsubscribeAll,
  doMes, aniversariantesDoMes, proximosAniversariantes,
  nomeMes,
  addAniversariante, updateAniversariante, deleteAniversariante,
} = useAniversariantes()

const { isAdmin, login, logout } = useAdmin()

const mesAtual = new Date().getMonth() + 1
const diaAtual = new Date().getDate()

function ehHoje(a: Aniversariante) {
  return a.mes === mesAtual && a.dia === diaAtual
}

const aniversariantesHoje = computed(() =>
  aniversariantes.value.filter(a => ehHoje(a))
)

const mesesComAniversariantes = computed(() => {
  const meses = new Set(aniversariantes.value.map(a => a.mes))
  return [...meses].sort((a, b) => a - b)
})

const sortedAll = computed(() =>
  [...aniversariantes.value].sort((a, b) => a.mes - b.mes || a.dia - b.dia)
)

// Admin
const adminModal = ref(false)
const loginPass  = ref('')
const loginError = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)
const form       = reactive({ nome: '', dia: 1, mes: mesAtual })

function doLogin() {
  loginError.value = false
  if (login(loginPass.value)) loginPass.value = ''
  else loginError.value = true
}
function doLogout() { logout(); adminModal.value = false }

function startEdit(a: Aniversariante) {
  editingId.value = a.id!
  form.nome = a.nome; form.dia = a.dia; form.mes = a.mes
}
function cancelEdit() {
  editingId.value = null
  form.nome = ''; form.dia = 1; form.mes = mesAtual
}

async function save() {
  if (!form.nome.trim()) { alert('Preencha o nome!'); return }
  saving.value = true
  try {
    if (editingId.value) {
      await updateAniversariante(editingId.value, { nome: form.nome.trim(), dia: form.dia, mes: form.mes })
      editingId.value = null
    } else {
      await addAniversariante({ nome: form.nome.trim(), dia: form.dia, mes: form.mes })
    }
    form.nome = ''; form.dia = 1; form.mes = mesAtual
  } finally { saving.value = false }
}

async function remove(id: string) {
  if (!confirm('Remover este aniversariante?')) return
  await deleteAniversariante(id)
}

onMounted(() => subscribe())
onUnmounted(() => unsubscribeAll())
</script>

<style scoped>
.summary-card  { @apply bg-ink-100 border border-brand-200 p-5 text-center; }
.summary-label { @apply font-mono text-[9px] uppercase tracking-widest text-ink-500 mt-1; }

.birthday-card { @apply flex bg-ink-100 border border-brand-200 overflow-hidden transition-colors hover:border-gold-400/30; }
.birthday-card.today { @apply border-gold-400/40 bg-gold-400/5; }
.date-col { @apply px-4 py-3 border-r border-brand-200 text-center flex flex-col justify-center shrink-0 min-w-[56px]; }

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
.icon-btn      { @apply w-7 h-7 flex items-center justify-center border text-xs cursor-pointer transition-all shrink-0; }
.icon-btn.edit { @apply border-brand-200 text-ink-500 hover:border-gold-400 hover:text-gold-400; }
.icon-btn.del  { @apply border-brand-200 text-ink-500 hover:border-crimson-400 hover:text-crimson-400; }
.count-btn     { @apply w-8 bg-none border-none text-gold-400 text-lg cursor-pointer transition-colors hover:bg-gold-400/15; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
