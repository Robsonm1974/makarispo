'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

type Tenant = Tables<'tenants'>

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshTenant: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar dados do tenant
  const fetchTenant = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar tenant:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar tenant:', error)
      return null
    }
  }

  // Atualizar tenant (para onboarding)
  const refreshTenant = async () => {
    if (user) {
      const tenantData = await fetchTenant(user.id)
      setTenant(tenantData)
    }
  }

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Erro no login:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  }

  // Listener de mudanças de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const tenantData = await fetchTenant(session.user.id)
          setTenant(tenantData)
        } else {
          setTenant(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    tenant,
    session,
    loading,
    signInWithGoogle,
    signOut,
    refreshTenant
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}