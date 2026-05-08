// composables/useEventos.ts
import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, Timestamp,
  onSnapshot,
} from 'firebase/firestore'

export interface Evento {
  id?:        string
  name:       string
  type:       string   // ID do tipo (ref para tipos_evento)
  date:       string
  time?:      string
  desc?:      string
  createdAt?: Timestamp
}

export function useEventos() {
  const { $db } = useNuxtApp() as any
  const eventos  = ref<Evento[]>([])
  const loading  = ref(false)
  const error    = ref<string | null>(null)
  const col = () => collection($db, 'eventos')
  let unsubscribe: (() => void) | null = null

  function subscribe() {
    loading.value = true
    const q = query(col(), orderBy('date', 'asc'))
    unsubscribe = onSnapshot(q,
      (snap) => { eventos.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Evento)); loading.value = false },
      (err)  => { error.value = err.message; loading.value = false }
    )
  }

  function unsubscribeAll() { if (unsubscribe) { unsubscribe(); unsubscribe = null } }

  async function addEvento(ev: Omit<Evento, 'id' | 'createdAt'>) {
    await addDoc(col(), { ...ev, createdAt: Timestamp.now() })
  }
  async function addEventos(evs: Omit<Evento, 'id' | 'createdAt'>[]) {
    await Promise.all(evs.map(ev => addDoc(col(), { ...ev, createdAt: Timestamp.now() })))
  }
  async function updateEvento(id: string, ev: Partial<Evento>) {
    await updateDoc(doc($db, 'eventos', id), ev)
  }
  async function deleteEvento(id: string) {
    await deleteDoc(doc($db, 'eventos', id))
  }

  return { eventos, loading, error, subscribe, unsubscribeAll, addEvento, addEventos, updateEvento, deleteEvento }
}
