// composables/useLimpeza.ts
// Coleção "limpeza_dias":    { id, date, vagas, observacao, createdAt }
// Coleção "limpeza_escalas": { id, diaId, nome, confirmado, limpou, criadoPorAdmin, createdAt }

import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy,
  onSnapshot, Timestamp,
  writeBatch,
} from 'firebase/firestore'

export interface LimpezaDia {
  id?:         string
  date:        string
  vagas:       number
  observacao?: string
  createdAt?:  Timestamp
}

export interface LimpezaEscala {
  id?:            string
  diaId:          string
  nome:           string
  confirmado:     boolean
  limpou:         boolean
  criadoPorAdmin: boolean
  createdAt?:     Timestamp
}

export function useLimpeza() {
  const { $db } = useNuxtApp() as any

  const dias    = ref<LimpezaDia[]>([])
  const escalas = ref<LimpezaEscala[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const colDias    = () => collection($db, 'limpeza_dias')
  const colEscalas = () => collection($db, 'limpeza_escalas')

  let unsubDias:    (() => void) | null = null
  let unsubEscalas: (() => void) | null = null

  function subscribe() {
    loading.value = true
    unsubDias = onSnapshot(query(colDias(), orderBy('date', 'asc')), (snap) => {
      dias.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as LimpezaDia))
      loading.value = false
    }, (err) => { error.value = err.message; loading.value = false })

    unsubEscalas = onSnapshot(query(colEscalas(), orderBy('createdAt', 'asc')), (snap) => {
      escalas.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as LimpezaEscala))
    }, (err) => { error.value = err.message })
  }

  function unsubscribeAll() {
    unsubDias?.();    unsubDias    = null
    unsubEscalas?.(); unsubEscalas = null
  }

  function escalasDoDia(diaId: string) {
    return computed(() => escalas.value.filter(e => e.diaId === diaId))
  }

  // Verifica se a pessoa limpou nos 7 dias anteriores à data informada
  function limpouNaSemanaAnterior(nome: string, date: string): boolean {
    const alvo        = new Date(date + 'T00:00:00')
    const inicioJanela = new Date(alvo); inicioJanela.setDate(alvo.getDate() - 7)
    const fimJanela    = new Date(alvo); fimJanela.setDate(alvo.getDate() - 1)

    return escalas.value.some(e => {
      if (e.nome.trim().toLowerCase() !== nome.trim().toLowerCase()) return false
      if (!e.limpou) return false
      const dia = dias.value.find(d => d.id === e.diaId)
      if (!dia) return false
      const dt = new Date(dia.date + 'T00:00:00')
      return dt >= inicioJanela && dt <= fimJanela
    })
  }

  const historico = computed(() => {
    const hoje = new Date(); hoje.setHours(0,0,0,0)
    return dias.value
      .filter(d => new Date(d.date + 'T00:00:00') < hoje)
      .map(d => ({ ...d, equipe: escalas.value.filter(e => e.diaId === d.id) }))
      .reverse()
  })

  const proximos = computed(() => {
    const hoje = new Date(); hoje.setHours(0,0,0,0)
    return dias.value.filter(d => new Date(d.date + 'T00:00:00') >= hoje)
  })

  async function addDia(dia: Omit<LimpezaDia, 'id' | 'createdAt'>) {
    await addDoc(colDias(), { ...dia, createdAt: Timestamp.now() })
  }
  async function updateDia(id: string, data: Partial<LimpezaDia>) {
    await updateDoc(doc($db, 'limpeza_dias', id), data)
  }
  async function deleteDia(id: string) {
    const batch = writeBatch($db)
    batch.delete(doc($db, 'limpeza_dias', id))
    escalas.value.filter(e => e.diaId === id).forEach(e => {
      batch.delete(doc($db, 'limpeza_escalas', e.id!))
    })
    await batch.commit()
  }

  async function addEscala(e: Omit<LimpezaEscala, 'id' | 'createdAt'>) {
    await addDoc(colEscalas(), { ...e, createdAt: Timestamp.now() })
  }
  async function updateEscala(id: string, data: Partial<LimpezaEscala>) {
    await updateDoc(doc($db, 'limpeza_escalas', id), data)
  }
  async function deleteEscala(id: string) {
    await deleteDoc(doc($db, 'limpeza_escalas', id))
  }
  async function toggleLimpou(id: string, valor: boolean) {
    await updateDoc(doc($db, 'limpeza_escalas', id), { limpou: valor })
  }
  async function confirmarPresenca(id: string, valor: boolean) {
    await updateDoc(doc($db, 'limpeza_escalas', id), { confirmado: valor })
  }

  return {
    dias, escalas, loading, error,
    subscribe, unsubscribeAll,
    escalasDoDia, limpouNaSemanaAnterior,
    historico, proximos,
    addDia, updateDia, deleteDia,
    addEscala, updateEscala, deleteEscala,
    toggleLimpou, confirmarPresenca,
  }
}
