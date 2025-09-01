// Custom hooks for Supabase operations
// PHOTOMANAGER V2 - Multi-tenant SaaS

import { useState, useEffect, useCallback } from 'react'
import { supabase, createServerSupabaseClient } from '@/lib/supabase-config'
import type { Tables, Inserts, Updates } from '@/types/database'

// Generic data fetching hook
export function useSupabaseData<T extends keyof Tables>(
  table: T,
  query?: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
) {
  const [data, setData] = useState<Tables<T>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let queryBuilder = supabase.from(table)
      
      if (query?.select) {
        queryBuilder = queryBuilder.select(query.select)
      }
      
      if (query?.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value)
        })
      }
      
      if (query?.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, {
          ascending: query.orderBy.ascending ?? true
        })
      }
      
      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit)
      }
      
      const { data: result, error: queryError } = await queryBuilder
      
      if (queryError) throw queryError
      
      setData(result || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [table, query])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = () => fetchData()

  return { data, loading, error, refresh }
}

// Hook for single record operations
export function useSupabaseRecord<T extends keyof Tables>(
  table: T,
  id?: string
) {
  const [data, setData] = useState<Tables<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecord = useCallback(async (recordId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: queryError } = await supabase
        .from(table)
        .select('*')
        .eq('id', recordId)
        .single()
      
      if (queryError) throw queryError
      
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [table])

  const createRecord = useCallback(async (record: Inserts<T>) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: queryError } = await supabase
        .from(table)
        .insert(record)
        .select()
        .single()
      
      if (queryError) throw queryError
      
      setData(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [table])

  const updateRecord = useCallback(async (id: string, updates: Updates<T>) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: queryError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (queryError) throw queryError
      
      setData(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [table])

  const deleteRecord = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error: queryError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (queryError) throw queryError
      
      setData(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }, [table])

  useEffect(() => {
    if (id) {
      fetchRecord(id)
    }
  }, [id, fetchRecord])

  return {
    data,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    refresh: () => id ? fetchRecord(id) : undefined
  }
}

// Hook for authentication
export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}

// Hook for real-time subscriptions
export function useSupabaseRealtime<T extends keyof Tables>(
  table: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, callback])
}
