'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ParticipantWithRelations, ParticipantInsert } from '@/types/participants'

export function useParticipants(eventId?: string) {
  const [participants, setParticipants] = useState<ParticipantWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchParticipants()
  }, [eventId])

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('participants')
        .select(`
          *,
          event:events(
            id,
            name,
            event_date,
            event_end_date,
            status,
            school:schools(
              id,
              name,
              type
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Filtrar por evento se especificado
      if (eventId) {
        query = query.eq('event_id', eventId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setParticipants((data as ParticipantWithRelations[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar participantes')
    } finally {
      setLoading(false)
    }
  }

  const createParticipant = async (participantData: ParticipantInsert) => {
    try {
      const { data, error: createError } = await supabase
        .from('participants')
        .insert(participantData)
        .select(`
          *,
          event:events(
            id,
            name,
            event_date,
            event_end_date,
            status,
            school:schools(
              id,
              name,
              type
            )
          )
        `)
        .single()

      if (createError) {
        throw createError
      }

      setParticipants((prev: ParticipantWithRelations[]) => [data as ParticipantWithRelations, ...prev])
      return data as ParticipantWithRelations
    } catch (err) {
      throw err
    }
  }

  const updateParticipant = async (id: string, updates: Partial<ParticipantInsert>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('participants')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          event:events(
            id,
            name,
            event_date,
            event_end_date,
            status,
            school:schools(
              id,
              name,
              type
            )
          )
        `)
        .single()

      if (updateError) {
        throw updateError
      }

      setParticipants((prev: ParticipantWithRelations[]) => 
        prev.map((p: ParticipantWithRelations) => p.id === id ? (data as ParticipantWithRelations) : p)
      )
      return data as ParticipantWithRelations
    } catch (err) {
      throw err
    }
  }

  const deleteParticipant = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      setParticipants((prev: ParticipantWithRelations[]) => prev.filter((p: ParticipantWithRelations) => p.id !== id))
    } catch (err) {
      throw err
    }
  }

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