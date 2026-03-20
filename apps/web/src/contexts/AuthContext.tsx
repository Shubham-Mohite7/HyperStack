import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, getCurrentUser, onAuthStateChange, signOut } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      const { signInWithGoogle } = await import('@/lib/supabase')
      await signInWithGoogle()
    } catch (error) {
      // Demo mode: Create a mock user when Supabase is not configured
      console.warn('Running in demo mode - creating mock user')
      const mockUser: AuthUser = {
        id: 'demo-user',
        email: 'demo@hyperstack.app',
        name: 'Demo User',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user`
      }
      setUser(mockUser)
    }
  }

  const logout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.warn('Supabase not configured, just clearing mock user')
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
