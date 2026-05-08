// composables/useTiposEvento.ts
// Tipos de evento dinâmicos salvos no Firestore
// Coleção: "tipos_evento"
// Documento: { id, label, icon, color, ordem, createdAt }

import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy,
  onSnapshot, Timestamp,
} from 'firebase/firestore'

export interface TipoEvento {
  id?:       string
  label:     string   // Ex: "Gira"
  icon:      string   // Ex: "⚔️"
  color:     string   // Ex: "#D4A017"
  ordem:     number   // Para ordenação
  createdAt?: Timestamp
}

// Tipos padrão caso o banco esteja vazio
export const TIPOS_DEFAULT: Omit<TipoEvento, 'id' | 'createdAt'>[] = [
  { label: 'Gira',            icon: '⚔️',  color: '#D4A017', ordem: 0 },
  { label: 'Evento Aberto',   icon: '🌍',  color: '#2e7d8c', ordem: 1 },
  { label: 'Desenvolvimento', icon: '🌿',  color: '#6b4c9e', ordem: 2 },
]

// Paleta de cores disponíveis para o admin escolher
export const CORES_PALETA = [
  { hex: '#D4A017', name: 'Ouro'     },
  { hex: '#C0392B', name: 'Vermelho' },
  { hex: '#2e7d8c', name: 'Azul'     },
  { hex: '#6b4c9e', name: 'Roxo'     },
  { hex: '#2e8c5a', name: 'Verde'    },
  { hex: '#c0782b', name: 'Laranja'  },
  { hex: '#8c2e6b', name: 'Rosa'     },
  { hex: '#2b5e8c', name: 'Azul Esc' },
  { hex: '#5e8c2e', name: 'Lima'     },
  { hex: '#8c5e2e', name: 'Marrom'   },
]

// Emojis sugeridos para ícones
export const ICONES_SUGERIDOS = [
  '⚔️','🌍','🌿','🕯️','🥁','🌙','⭐','🔥','💫','🌊',
  '🦅','🌺','🎭','🙏','💛','🌸','🪬','🌀','🔮','🎶',
]

export function useTiposEvento() {
  const { $db } = useNuxtApp() as any
  const tipos   = ref<TipoEvento[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const col = () => collection($db, 'tipos_evento')

  let unsubscribe: (() => void) | null = null

  function subscribe() {
    loading.value = true
    const q = query(col(), orderBy('ordem', 'asc'))
    unsubscribe = onSnapshot(q,
      async (snap) => {
        if (snap.empty) {
          // Seed com tipos padrão se não houver nenhum
          await seedDefaults()
        } else {
          tipos.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as TipoEvento))
        }
        loading.value = false
      },
      (err) => { error.value = err.message; loading.value = false }
    )
  }

  function unsubscribeAll() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  async function seedDefaults() {
    await Promise.all(
      TIPOS_DEFAULT.map(t => addDoc(col(), { ...t, createdAt: Timestamp.now() }))
    )
  }

  async function addTipo(t: Omit<TipoEvento, 'id' | 'createdAt'>) {
    const ordem = tipos.value.length
    await addDoc(col(), { ...t, ordem, createdAt: Timestamp.now() })
  }

  async function updateTipo(id: string, t: Partial<TipoEvento>) {
    await updateDoc(doc($db, 'tipos_evento', id), t)
  }

  async function deleteTipo(id: string) {
    await deleteDoc(doc($db, 'tipos_evento', id))
  }

  // Helpers reativos
  const labelMap = computed(() =>
    Object.fromEntries(tipos.value.map(t => [t.id, t.label]))
  )
  const colorMap = computed(() =>
    Object.fromEntries(tipos.value.map(t => [t.id, t.color]))
  )
  const iconMap = computed(() =>
    Object.fromEntries(tipos.value.map(t => [t.id, t.icon]))
  )

  return {
    tipos, loading, error,
    subscribe, unsubscribeAll,
    addTipo, updateTipo, deleteTipo,
    labelMap, colorMap, iconMap,
  }
}
