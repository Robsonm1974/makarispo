'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Interface simplificada para tenant
interface Tenant {
  id: string
  name: string
  domain: string | null
  settings: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

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

  // Cache local para evitar chamadas desnecessárias
  const [tenantCache, setTenantCache] = useState<Map<string, Tenant>>(new Map())

  // Buscar dados do tenant com cache
  const fetchTenant = useCallback(async (userId: string): Promise<Tenant | null> => {
    try {
      // Verificar cache primeiro
      if (tenantCache.has(userId)) {
        return tenantCache.get(userId) || null
      }

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar tenant:', error)
        return null
      }

      // Atualizar cache
      if (data) {
        const tenantData: Tenant = {
          id: data.id,
          name: data.name,
          domain: data.domain,
          settings: data.settings as Record<string, unknown> | null,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        setTenantCache(prev => new Map(prev.set(userId, tenantData)))
        return tenantData
      }

      return null
    } catch (error) {
      console.error('Erro ao buscar tenant:', error)
      return null
    }
  }, [tenantCache])

  // Atualizar tenant (para onboarding) com cache
  const refreshTenant = useCallback(async () => {
    if (user) {
      const tenantData = await fetchTenant(user.id)
      setTenant(tenantData)

      // Limpar cache para forçar atualização
      setTenantCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(user.id)
        return newCache
      })
    }
  }, [user, fetchTenant])

  // Login com Google otimizado
  const signInWithGoogle = useCallback(async () => {
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
  }, [])

  // Logout otimizado
  const signOut = useCallback(async () => {
    try {
      // Limpar cache local
      setTenantCache(new Map())

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  }, [])

  // Efeito para inicializar autenticação
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession()

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            const tenantData = await fetchTenant(session.user.id)
            if (mounted) {
              setTenant(tenantData)
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (event === 'SIGNED_IN' && session?.user) {
            const tenantData = await fetchTenant(session.user.id)
            if (mounted) {
              setTenant(tenantData)
            }
          } else if (event === 'SIGNED_OUT') {
            setTenant(null)
            setTenantCache(new Map())
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchTenant])

  // Valor do contexto memoizado
  const contextValue = useMemo(() => ({
    user,
    tenant,
    session,
    loading,
    signInWithGoogle,
    signOut,
    refreshTenant
  }), [user, tenant, session, loading, signInWithGoogle, signOut, refreshTenant])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}