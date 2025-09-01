'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Participant, ParticipantInsert, ParticipantUpdate, ParticipantWithRelations } from '@/types/participants'

export function useParticipants() {
  const { user } = useAuth()
  const [participants, setParticipants] = useState<ParticipantWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          school:schools(name, type),
          event:events(name, event_date)
        `)
        .eq('tenant_id', user.id)
        .is('deleted_at', null) // Apenas participantes não deletados
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setParticipants(data || [])
    } catch (err) {
      console.error('Erro ao buscar participantes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createParticipant = async (participantData: Omit<ParticipantInsert, 'tenant_id'>) => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      const { data, error } = await supabase
        .from('participants')
        .insert({
          ...participantData,
          tenant_id: user.id
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      await fetchParticipants()
      return data
    } catch (err) {
      console.error('Erro ao criar participante:', err)
      throw err
    }
  }

  const updateParticipant = async (id: string, updates: ParticipantUpdate) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', user?.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      await fetchParticipants()
      return data
    } catch (err) {
      console.error('Erro ao atualizar participante:', err)
      throw err
    }
  }

  const deleteParticipant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', user?.id)

      if (error) {
        throw error
      }

      await fetchParticipants()
    } catch (err) {
      console.error('Erro ao deletar participante:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [user])

  return {
    participants,
    loading,
    error,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    refetch: fetchParticipants
  }
}