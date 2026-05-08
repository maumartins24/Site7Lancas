// composables/useAdmin.ts
// Gerencia sessão de admin (senha simples, sem autenticação Firebase)
// A senha fica no .env como NUXT_PUBLIC_ADMIN_PASSWORD — ou hardcode aqui mesmo

export function useAdmin() {
  const ADMIN_PASS = 'ogum7admin' // 🔧 Troque ou mova para variável de ambiente

  const isAdmin = useState('isAdmin', () => false)

  function login(senha: string): boolean {
    if (senha === ADMIN_PASS) {
      isAdmin.value = true
      return true
    }
    return false
  }

  function logout() {
    isAdmin.value = false
  }

  return { isAdmin, login, logout }
}
