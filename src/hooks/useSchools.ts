'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { School, SchoolInsert, SchoolUpdate } from '@/types/schools'

export function useSchools() {
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar escolas do tenant
  const fetchSchools = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('tenant_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSchools(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar escolas')
    } finally {
      setLoading(false)
    }
  }

  // Criar escola
  const createSchool = async (schoolData: SchoolInsert) => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      const { data, error } = await supabase
        .from('schools')
        .insert({
          ...schoolData,
          tenant_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      
      setSchools(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar escola')
    }
  }

  // Atualizar escola
  const updateSchool = async (id: string, updates: SchoolUpdate) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      setSchools(prev => prev.map(school => 
        school.id === id ? data : school
      ))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar escola')
    }
  }

  // Deletar escola (soft delete)
  const deleteSchool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ active: false })
        .eq('id', id)

      if (error) throw error
      
      setSchools(prev => prev.filter(school => school.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao deletar escola')
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [user])

  return {
    schools,
    loading,
    error,
    createSchool,
    updateSchool,
    deleteSchool,
    refetch: fetchSchools
  }
}