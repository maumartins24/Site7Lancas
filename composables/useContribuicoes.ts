// composables/useContribuicoes.ts
// CRUD de contribuições no Firestore
// Coleção: "contribuicoes"
// Documento: { id, itemId, nome, qty, createdAt }

import {
  collection, doc,
  addDoc, deleteDoc,
  query, where, orderBy,
  onSnapshot, Timestamp,
} from 'firebase/firestore'

export interface Contribuicao {
  id?:       string
  itemId:    string
  nome:      string
  qty:       string
  createdAt?: Timestamp
}

export function useContribuicoes() {
  const { $db } = useNuxtApp() as any
  const contribuicoes = ref<Contribuicao[]>([])
  const loading       = ref(false)
  const error         = ref<string | null>(null)

  const col = () => collection($db, 'contribuicoes')

  let unsubscribe: (() => void) | null = null

  // Listener em tempo real — todos os itens de uma vez
  function subscribe() {
    loading.value = true
    const q = query(col(), orderBy('createdAt', 'asc'))
    unsubscribe = onSnapshot(q,
      (snap) => {
        contribuicoes.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Contribuicao))
        loading.value = false
      },
      (err) => {
        error.value = err.message
        loading.value = false
      }
    )
  }

  function unsubscribeAll() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  // Contribuições filtradas por item
  function forItem(itemId: string) {
    return computed(() => contribuicoes.value.filter(c => c.itemId === itemId))
  }

  async function addContribuicao(c: Omit<Contribuicao, 'id' | 'createdAt'>) {
    await addDoc(col(), { ...c, createdAt: Timestamp.now() })
  }

  async function deleteContribuicao(id: string) {
    await deleteDoc(doc($db, 'contribuicoes', id))
  }

  return {
    contribuicoes,
    loading,
    error,
    subscribe,
    unsubscribeAll,
    forItem,
    addContribuicao,
    deleteContribuicao,
  }
}
