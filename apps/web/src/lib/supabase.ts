import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Running in demo mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        debug: false // Disable debug in production
      }
    })
  : null

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set environment variables.')
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set environment variables.')
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0],
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture
  }
}

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
