import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        if (email === 'admin@homiepg.com' && password === 'admin123') {
          set({ isAuthenticated: true, user: { email, name: 'Super Administrator' } })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'admin-auth' }
  )
)
