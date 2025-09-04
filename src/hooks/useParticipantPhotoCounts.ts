'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface ParticipantPhotoCount {
  participant_id: string
  photo_count: number
}

export function useParticipantPhotoCounts(participantIds: string[]) {
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  const fetchPhotoCounts = useCallback(async () => {
    if (participantIds.length === 0) {
      setPhotoCounts({})
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('participant_id')
        .in('participant_id', participantIds)

      if (error) {
        console.error('Erro ao buscar contagem de fotos:', error)
        return
      }

      // Contar fotos por participante
      const counts: Record<string, number> = {}
      participantIds.forEach(id => {
        counts[id] = 0
      })

      data?.forEach(photo => {
        counts[photo.participant_id] = (counts[photo.participant_id] || 0) + 1
      })

      setPhotoCounts(counts)
    } catch (error) {
      console.error('Erro ao buscar contagem de fotos:', error)
    } finally {
      setLoading(false)
    }
  }, [participantIds])

  useEffect(() => {
    fetchPhotoCounts()
  }, [fetchPhotoCounts])

  return {
    photoCounts,
    loading,
    refetch: fetchPhotoCounts
  }
}
