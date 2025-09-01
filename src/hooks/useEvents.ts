'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Event, EventInsert, EventUpdate, EventWithSchool } from '@/types/events'

export function useEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventWithSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar eventos do tenant com dados da escola
  const fetchEvents = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          school:schools(name, type)
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar eventos')
    } finally {
      setLoading(false)
    }
  }

  // Criar evento
  const createEvent = async (eventData: EventInsert) => {
    if (!user) throw new Error('Usuário não autenticado')

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          tenant_id: user.id
        })
        .select(`
          *,
          school:schools(name, type)
        `)
        .single()

      if (error) throw error
      
      setEvents(prev => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar evento')
    }
  }

  // Atualizar evento
  const updateEvent = async (id: string, updates: EventUpdate) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          school:schools(name, type)
        `)
        .single()

      if (error) throw error
      
      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar evento')
    }
  }

  // Deletar evento
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao deletar evento')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [user])

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  }
}