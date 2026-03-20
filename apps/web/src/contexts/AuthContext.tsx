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
    // Add a timeout to ensure loading is never stuck
    const timeout = setTimeout(() => {
      setLoading(false)
      console.log('Auth timeout reached, showing sign in button')
    }, 3000) // 3 seconds timeout

    // Get initial user
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        console.log('Auth initialized, user:', currentUser)
      } catch (error) {
        console.error('Error initializing auth:', error)
        // If there's an error, set loading to false so button shows
        setLoading(false)
      } finally {
        setLoading(false)
        clearTimeout(timeout)
      }
    }

    initializeAuth()

    // Listen for auth changes
    try {
      const { data: { subscription } } = onAuthStateChange((user) => {
        setUser(user)
        setLoading(false)
        console.log('Auth state changed, user:', user)
        clearTimeout(timeout)
      })
      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    } catch (error) {
      console.error('Error setting up auth state change:', error)
      setLoading(false)
      clearTimeout(timeout)
      return () => {}
    }
  }, [])

  const signIn = async () => {
    const { signInWithGoogle } = await import('@/lib/supabase')
    await signInWithGoogle()
  }

  const logout = async () => {
    await signOut()
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
