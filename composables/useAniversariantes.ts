import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, Timestamp,
  onSnapshot,
} from 'firebase/firestore'

export interface Aniversariante {
  id?:        string
  nome:       string
  dia:        number   // 1-31
  mes:        number   // 1-12
  createdAt?: Timestamp
}

const MESES_PT = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

export function useAniversariantes() {
  const { $db } = useNuxtApp() as any
  const aniversariantes = ref<Aniversariante[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)
  const col = () => collection($db, 'aniversariantes')
  let unsub: (() => void) | null = null

  function subscribe() {
    loading.value = true
    unsub = onSnapshot(query(col(), orderBy('mes', 'asc')), (snap) => {
      aniversariantes.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Aniversariante))
      loading.value = false
    }, (err) => { error.value = err.message; loading.value = false })
  }

  function unsubscribeAll() { unsub?.(); unsub = null }

  const doMes = (mes: number) =>
    computed(() =>
      aniversariantes.value
        .filter(a => a.mes === mes)
        .sort((a, b) => a.dia - b.dia)
    )

  const aniversariantesDoMes = computed(() => {
    const mesAtual = new Date().getMonth() + 1
    return aniversariantes.value
      .filter(a => a.mes === mesAtual)
      .sort((a, b) => a.dia - b.dia)
  })

  const proximosAniversariantes = computed(() => {
    const hoje = new Date()
    const mesAtual = hoje.getMonth() + 1
    const diaAtual = hoje.getDate()

    return aniversariantes.value
      .map(a => {
        let diasAte = 0
        if (a.mes > mesAtual || (a.mes === mesAtual && a.dia >= diaAtual)) {
          diasAte = (a.mes - mesAtual) * 30 + (a.dia - diaAtual)
        } else {
          diasAte = (12 - mesAtual + a.mes) * 30 + (a.dia - diaAtual)
        }
        return { ...a, diasAte }
      })
      .sort((a, b) => a.diasAte - b.diasAte)
      .slice(0, 5)
  })

  function nomeMes(mes: number) { return MESES_PT[mes - 1] || '' }

  async function addAniversariante(a: Omit<Aniversariante, 'id' | 'createdAt'>) {
    await addDoc(col(), { ...a, createdAt: Timestamp.now() })
  }
  async function updateAniversariante(id: string, data: Partial<Aniversariante>) {
    await updateDoc(doc($db, 'aniversariantes', id), data)
  }
  async function deleteAniversariante(id: string) {
    await deleteDoc(doc($db, 'aniversariantes', id))
  }

  return {
    aniversariantes, loading, error,
    subscribe, unsubscribeAll,
    doMes, aniversariantesDoMes, proximosAniversariantes,
    nomeMes,
    addAniversariante, updateAniversariante, deleteAniversariante,
  }
}
