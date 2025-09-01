'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, createServerSupabaseClient } from '@/lib/supabase'
import type { Tables } from '@/types/database'

// Hook for table operations
export function useSupabaseTable<T extends keyof Tables>(
  table: T,
  query?: {
    select?: string
    filters?: Record<string, unknown>
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
      let queryBuilder = supabase.from(table).select(query?.select || '*')

      // Apply filters
      if (query?.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value)
          }
        })
      }

      // Apply ordering
      if (query?.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, {
          ascending: query.orderBy.ascending ?? true
        })
      }

      // Apply limit
      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit)
      }

      const { data: result, error: fetchError } = await queryBuilder

      if (fetchError) {
        throw fetchError
      }

      setData(result || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [table, query])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh
  }
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
      const { data: result, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('id', recordId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
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
    refresh: () => id ? fetchRecord(id) : undefined
  }
}

// Hook for authentication
export function useSupabaseAuth() {
  const [user, setUser] = useState<unknown>(null)
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
  callback: (payload: unknown) => void
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