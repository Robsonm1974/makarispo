import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ParticipantWithRelations, ParticipantInsert } from '@/types/participants'

export function useParticipants(eventId?: string) {
  const [participants, setParticipants] = useState<ParticipantWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParticipants = useCallback(async () => {
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

      if (eventId) {
        query = query.eq('event_id', eventId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setParticipants((data as unknown as ParticipantWithRelations[]) || [])
    } catch (err: unknown) {
      console.error('Erro ao buscar participantes:', err)
      const error = err instanceof Error ? err.message : 'Erro ao carregar participantes'
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  const createParticipant = async (participantData: ParticipantInsert): Promise<ParticipantWithRelations> => {
    try {
      console.log('Dados sendo enviados:', participantData)
      
      // Remover qr_code dos dados enviados - será gerado pelo trigger
      const { qr_code, ...dataToInsert } = participantData
      console.log('QR code será gerado automaticamente, removendo:', qr_code)
      
      const { data, error: createError } = await supabase
        .from('participants')
        // @ts-expect-error - Temporary workaround for type mismatch
        .insert(dataToInsert)

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
        console.error('Erro do Supabase:', createError)
        console.error('Detalhes do erro:', {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code
        })
        throw new Error(`Erro ao criar participante: ${createError.message || createError.details || 'Erro desconhecido'}`)
      }

      if (!data) {
        throw new Error('Nenhum dado retornado ao criar participante')
      }

      const newParticipant = data as unknown as ParticipantWithRelations
      setParticipants(prev => [newParticipant, ...prev])
      return newParticipant

    } catch (err) {
      console.error('Erro completo:', err)
      const errorInstance = err instanceof Error ? err : new Error('Erro desconhecido ao criar participante')
      throw errorInstance
    }
  }

  const updateParticipant = async (
    id: string, 
    updates: Partial<ParticipantInsert>
  ): Promise<ParticipantWithRelations> => {
    try {
      const { data, error: updateError } = await supabase
        .from('participants')
        .update(updates as unknown as Record<string, unknown>)
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
        throw new Error(`Erro ao atualizar participante: ${updateError.message}`)
      }

      if (!data) {
        throw new Error('Nenhum dado retornado ao atualizar participante')
      }

      const updatedParticipant = data as unknown as ParticipantWithRelations
      setParticipants(prev => 
        prev.map(p => p.id === id ? updatedParticipant : p)
      )
      return updatedParticipant

    } catch (err) {
      console.error('Erro ao atualizar participante:', err)
      const errorInstance = err instanceof Error ? err : new Error('Erro desconhecido ao atualizar participante')
      throw errorInstance
    }
  }

  const deleteParticipant = async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('participants')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(`Erro ao excluir participante: ${deleteError.message}`)
      }

      setParticipants(prev => prev.filter(p => p.id !== id))

    } catch (err) {
      console.error('Erro ao excluir participante:', err)
      const errorInstance = err instanceof Error ? err : new Error('Erro desconhecido ao excluir participante')
      throw errorInstance
    }
  }

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