# Terreiro Ogum 7 Lanças — Nuxt 3 + Firebase

## Stack
- **Nuxt 3** — SSR/SSG
- **Tailwind CSS** — via @nuxtjs/tailwindcss
- **Firebase Firestore** — banco de dados em tempo real
- **Playfair Display + DM Sans + DM Mono** — tipografia

## Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Firebase

1. Acesse https://console.firebase.google.com
2. Crie um projeto (ou use um existente)
3. Vá em **Firestore Database → Criar banco de dados** → modo de produção
4. Vá em **Configurações do projeto → Seus apps → Web app**
5. Copie as credenciais

### 3. Criar o .env
```bash
cp .env.example .env
```
Preencha com as credenciais do Firebase:
```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### 4. Regras do Firestore

No console do Firebase → Firestore → Regras, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Eventos: leitura pública, escrita somente autenticada (use admin panel)
    match /eventos/{doc} {
      allow read: if true;
      allow write: if true; // 🔧 Restrinja após implementar auth
    }
    // Contribuições: leitura e escrita pública (comunidade pode adicionar)
    match /contribuicoes/{doc} {
      allow read, write: if true;
    }
  }
}
```

### 5. Rodar
```bash
npm run dev        # desenvolvimento
npm run generate   # build estático para Vercel
```

## Estrutura

```
├── plugins/
│   └── firebase.client.ts    ← Inicializa Firebase (client-side only)
├── composables/
│   ├── useEventos.ts         ← CRUD eventos + listener realtime
│   ├── useContribuicoes.ts   ← CRUD contribuições + listener realtime
│   └── useAdmin.ts           ← Sessão admin (senha simples)
├── components/
│   ├── AppCalendario.vue     ← Calendário + lista + painel admin
│   └── AppContribuicoes.vue  ← Lista de materiais + formulário
├── pages/
│   └── index.vue             ← Página principal com abas
└── layouts/
    └── default.vue           ← Header + Footer
```

## Coleções no Firestore

**`eventos`**
```
{
  id: string (auto)
  name: string
  type: 'gira' | 'evento' | 'desenvolvimento'
  date: string (YYYY-MM-DD)
  time: string (HH:MM)
  desc: string
  createdAt: Timestamp
}
```

**`contribuicoes`**
```
{
  id: string (auto)
  itemId: string (ex: 'vela-branca')
  nome: string
  qty: string
  createdAt: Timestamp
}
```

## Adicionar outras páginas do site

Quando quiser ativar o restante do site, abra `pages/index.vue` e adicione as abas em `visibleTabs`:

```js
const visibleTabs = [
  { id: 'agenda',        icon: '📅', label: 'Agenda' },
  { id: 'contribuicoes', icon: '🕯️', label: 'Contribuições' },
  { id: 'home',          icon: '🏠', label: 'Início' },        // ← descomente quando pronto
  { id: 'arrecadacao',   icon: '💛', label: 'Arrecadação' },   // ← descomente quando pronto
]
```

## Deploy no Vercel

1. Suba o código no GitHub
2. Importe no Vercel
3. Em **Environment Variables**, adicione todas as variáveis do `.env`
4. Deploy!

## Nova coleção: `itens`

```
{
  id: string (auto)
  name: string
  group: string
  meta: string
  ordem: number
  createdAt: Timestamp
}
```

Adicione às regras do Firestore:
```
match /itens/{doc} {
  allow read: if true;
  allow write: if true;
}
```
