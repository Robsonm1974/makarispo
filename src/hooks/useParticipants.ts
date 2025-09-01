import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

export function useParticipants() {
  const [participants, setParticipants] = useState<ParticipantWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          event:events(
            *,
            school:schools(*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        // Mapear os dados para o tipo correto
        const mappedParticipants: ParticipantWithRelations[] = data.map(participant => ({
          id: participant.id,
          event_id: participant.event_id,
          name: participant.name,
          class: participant.class,
          qr_code: participant.qr_code,
          notes: participant.notes,
          created_at: participant.created_at,
          updated_at: participant.updated_at,
          event: {
            id: participant.event.id,
            name: participant.event.name,
            event_date: participant.event.event_date,
            event_end_date: participant.event.event_end_date,
            status: participant.event.status,
            school: {
              id: participant.event.school.id,
              name: participant.event.school.name,
              type: participant.event.school.type as 'publica' | 'privada'
            }
          }
        }))
        setParticipants(mappedParticipants)
      }
    } catch (err) {
      console.error('Erro ao buscar participantes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const createParticipant = useCallback(async (participantData: {
    event_id: string
    name: string
    class?: string | null
    qr_code: string
    notes?: string | null
  }) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('participants')
        .insert([participantData])
        .select(`
          *,
          event:events(
            *,
            school:schools(*)
          )
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear o novo participante para o tipo correto
        const newParticipant: ParticipantWithRelations = {
          id: data.id,
          event_id: data.event_id,
          name: data.name,
          class: data.class,
          qr_code: data.qr_code,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at,
          event: {
            id: data.event.id,
            name: data.event.name,
            event_date: data.event.event_date,
            event_end_date: data.event.event_end_date,
            status: data.event.status,
            school: {
              id: data.event.school.id,
              name: data.event.school.name,
              type: data.event.school.type as 'publica' | 'privada'
            }
          }
        }
        
        setParticipants(prev => [newParticipant, ...prev])
        return newParticipant
      }
    } catch (err) {
      console.error('Erro ao criar participante:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const updateParticipant = useCallback(async (participantId: string, participantData: Partial<ParticipantFormData>) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('participants')
        .update(participantData)
        .eq('id', participantId)
        .select(`
          *,
          event:events(
            *,
            school:schools(*)
          )
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear o participante atualizado para o tipo correto
        const updatedParticipant: ParticipantWithRelations = {
          id: data.id,
          event_id: data.event_id,
          name: data.name,
          class: data.class,
          qr_code: data.qr_code,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at,
          event: {
            id: data.event.id,
            name: data.event.name,
            event_date: data.event.event_date,
            event_end_date: data.event.event_end_date,
            status: data.event.status,
            school: {
              id: data.event.school.id,
              name: data.event.school.name,
              type: data.event.school.type as 'publica' | 'privada'
            }
          }
        }
        
        setParticipants(prev => prev.map(participant => 
          participant.id === participantId ? updatedParticipant : participant
        ))
        return updatedParticipant
      }
    } catch (err) {
      console.error('Erro ao atualizar participante:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const deleteParticipant = useCallback(async (participantId: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId)

      if (error) {
        throw error
      }

      setParticipants(prev => prev.filter(participant => participant.id !== participantId))
    } catch (err) {
      console.error('Erro ao deletar participante:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchParticipants()
  }, [fetchParticipants])

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