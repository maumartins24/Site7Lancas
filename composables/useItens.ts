// composables/useItens.ts
// Gerencia a lista de itens/materiais no Firestore
// Coleção: "itens"
// Documento: { id, name, group, meta, ordem, createdAt }

import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy,
  onSnapshot, Timestamp,
} from 'firebase/firestore'

export interface Item {
  id?:        string
  name:       string
  group:      string
  meta:       string
  ordem:      number
  createdAt?: Timestamp
}

// Itens padrão para seed inicial
export const ITENS_DEFAULT: Omit<Item, 'id' | 'createdAt'>[] = [
  { name:'Vela Branca',                    group:'Velas',         meta:'1 kg',             ordem:0  },
  { name:'Vela Vermelha',                  group:'Velas',         meta:'1 kg',             ordem:1  },
  { name:'Vela Preta',                     group:'Velas',         meta:'2 kg',             ordem:2  },
  { name:'Vela Azul Clara',                group:'Velas',         meta:'500 gr',           ordem:3  },
  { name:'Vela Bicolor Rosa / Azul',       group:'Velas Bicolor', meta:'500 gr',           ordem:4  },
  { name:'Vela Bicolor Branca / Preta',    group:'Velas Bicolor', meta:'1 kg',             ordem:5  },
  { name:'Vela Bicolor Branca / Vermelha', group:'Velas Bicolor', meta:'1 kg',             ordem:6  },
  { name:'Vela Bicolor Branca / Azul',     group:'Velas Bicolor', meta:'500 gr',           ordem:7  },
  { name:'Vela Bicolor Branca / Verde',    group:'Velas Bicolor', meta:'500 gr',           ordem:8  },
  { name:'Dendê',                          group:'Outros Itens',  meta:'4 L',              ordem:9  },
  { name:'Saco de Lixo 100L',              group:'Outros Itens',  meta:'1 pacote',         ordem:10 },
  { name:'Papel Toalha Interfolhada',      group:'Outros Itens',  meta:'1 pacote',         ordem:11 },
  { name:'Gin Tradicional',                group:'Bebidas',       meta:'quantidade livre', ordem:12 },
  { name:'Whisky',                         group:'Bebidas',       meta:'quantidade livre', ordem:13 },
  { name:'Espumante / Champanhe',          group:'Bebidas',       meta:'quantidade livre', ordem:14 },
]

export function useItens() {
  const { $db } = useNuxtApp() as any
  const itens   = ref<Item[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const col = () => collection($db, 'itens')
  let unsubscribe: (() => void) | null = null

  function subscribe() {
    loading.value = true
    const q = query(col(), orderBy('ordem', 'asc'))
    unsubscribe = onSnapshot(q,
      async (snap) => {
        if (snap.empty) {
          await seedDefaults()
        } else {
          itens.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Item))
          loading.value = false
        }
      },
      (err) => { error.value = err.message; loading.value = false }
    )
  }

  function unsubscribeAll() {
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
  }

  async function seedDefaults() {
    await Promise.all(
      ITENS_DEFAULT.map(i => addDoc(col(), { ...i, createdAt: Timestamp.now() }))
    )
  }

  async function addItem(item: Omit<Item, 'id' | 'createdAt'>) {
    const ordem = itens.value.length
    await addDoc(col(), { ...item, ordem, createdAt: Timestamp.now() })
  }

  async function updateItem(id: string, data: Partial<Item>) {
    await updateDoc(doc($db, 'itens', id), data)
  }

  async function deleteItem(id: string) {
    await deleteDoc(doc($db, 'itens', id))
  }

  // Grupos únicos ordenados
  const grupos = computed(() => [...new Set(itens.value.map(i => i.group))])

  // Itens agrupados
  const groupedItens = computed<[string, Item[]][]>(() => {
    const map = new Map<string, Item[]>()
    itens.value.forEach(i => {
      if (!map.has(i.group)) map.set(i.group, [])
      map.get(i.group)!.push(i)
    })
    return [...map.entries()]
  })

  return {
    itens, loading, error,
    subscribe, unsubscribeAll,
    addItem, updateItem, deleteItem,
    grupos, groupedItens,
  }
}
