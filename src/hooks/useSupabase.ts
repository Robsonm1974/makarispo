import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

// Hook for authentication
export function useSupabaseAuth() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [loading] = useState(true) // Removido setLoading - não utilizado

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setUser(data.user)
      return data
    } catch (err) {
      throw err
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      return data
    } catch (err) {
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
    } catch (err) {
      throw err
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (err) {
      throw err
    }
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}

// Hook específico para eventos
export function useEvents() {
  const [data, setData] = useState<Database['public']['Tables']['events']['Row'][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: result, error } = await supabase
        .from('events')
        .select('*')

      if (error) throw error

      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const insertData = useCallback(async (insertData: Database['public']['Tables']['events']['Insert']) => {
    try {
      setError(null)

      const { data: result, error } = await supabase
        .from('events')
        .insert([insertData])
        .select()

      if (error) throw error

      if (result) {
        setData(prev => [...result, ...prev])
        return result
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inserir dados')
      throw err
    }
  }, [])

  const updateData = useCallback(async (id: string, updateData: Partial<Database['public']['Tables']['events']['Update']>) => {
    try {
      setError(null)

      const { data: result, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      if (result) {
        setData(prev => prev.map(item => 
          item.id === id ? result[0] : item
        ))
        return result[0]
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dados')
      throw err
    }
  }, [])

  const deleteData = useCallback(async (id: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error

      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar dados')
      throw err
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData
  }
}

// Hook específico para escolas
export function useSchools() {
  const [data, setData] = useState<Database['public']['Tables']['schools']['Row'][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: result, error } = await supabase
        .from('schools')
        .select('*')

      if (error) throw error

      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const insertData = useCallback(async (insertData: Database['public']['Tables']['schools']['Insert']) => {
    try {
      setError(null)

      const { data: result, error } = await supabase
        .from('schools')
        .insert([insertData])
        .select()

      if (error) throw error

      if (result) {
        setData(prev => [...result, ...prev])
        return result
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao inserir dados')
      throw err
    }
  }, [])

  const updateData = useCallback(async (id: string, updateData: Partial<Database['public']['Tables']['schools']['Update']>) => {
    try {
      setError(null)

      const { data: result, error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      if (result) {
        setData(prev => prev.map(item => 
          item.id === id ? result[0] : item
        ))
        return result[0]
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dados')
      throw err
    }
  }, [])

  const deleteData = useCallback(async (id: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id)

      if (error) throw error

      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar dados')
      throw err
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData
  }
}