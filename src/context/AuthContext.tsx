import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { validateEmail, validatePassword } from '../lib/validation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (error) console.error('Unable to restore authentication session', error)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }).catch((error: unknown) => {
      if (mounted) {
        console.error('Unable to restore authentication session', error)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const result = await supabase.auth.signUp({ email: validateEmail(email), password: validatePassword(password) })
      return { error: result.error }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unable to create account.') }
    }
  }

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const result = await supabase.auth.signInWithPassword({ email: validateEmail(email), password })
      return { error: result.error }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unable to sign in.') }
    }
  }

  const signOut = async (): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = useMemo(() => ({ user, session, loading, signUp, signIn, signOut }), [user, session, loading])

  return (
    <AuthContext.Provider value={value}>
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
