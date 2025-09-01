import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { EventWithSchool, EventFormData, EventInsert } from '@/types/events'

export function useEvents() {
  const [events, setEvents] = useState<EventWithSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          school:schools(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        // Mapear os dados para o tipo correto
        const mappedEvents: EventWithSchool[] = data.map(event => ({
          id: event.id,
          tenant_id: event.tenant_id,
          school_id: event.school_id,
          name: event.name,
          event_date: event.event_date,
          event_end_date: event.event_end_date,
          commission_percent: event.commission_percent,
          notes: event.notes,
          status: event.status,
          products_enabled: event.products_enabled,
          created_at: event.created_at,
          updated_at: event.updated_at,
          school: {
            id: event.school.id,
            name: event.school.name,
            type: event.school.type,
            address: event.school.address,
            director_name: event.school.director_name,
            phone: event.school.phone,
            email: event.school.email,
            students_count: event.school.students_count,
            director_message: event.school.director_message,
            notes: event.school.notes,
            slug: event.school.slug,
            active: event.school.active,
            created_at: event.school.created_at,
            updated_at: event.school.updated_at
          }
        }))
        setEvents(mappedEvents)
      }
    } catch (err) {
      console.error('Erro ao buscar eventos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (eventData: EventInsert) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select(`
          *,
          school:schools(*)
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear o novo evento para o tipo correto
        const newEvent: EventWithSchool = {
          id: data.id,
          tenant_id: data.tenant_id,
          school_id: data.school_id,
          name: data.name,
          event_date: data.event_date,
          event_end_date: data.event_end_date,
          commission_percent: data.commission_percent,
          notes: data.notes,
          status: data.status,
          products_enabled: data.products_enabled,
          created_at: data.created_at,
          updated_at: data.updated_at,
          school: {
            id: data.school.id,
            name: data.school.name,
            type: data.school.type,
            address: data.school.address,
            director_name: data.school.director_name,
            phone: data.school.phone,
            email: data.school.email,
            students_count: data.school.students_count,
            director_message: data.school.director_message,
            notes: data.school.notes,
            slug: data.school.slug,
            active: data.school.active,
            created_at: data.school.created_at,
            updated_at: data.school.updated_at
          }
        }
        
        setEvents(prev => [newEvent, ...prev])
        return newEvent
      }
    } catch (err) {
      console.error('Erro ao criar evento:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<EventFormData>) => {
    try {
      setError(null)

      // Converter os dados para o formato esperado pelo Supabase
      const updateData = {
        ...eventData,
        // Converter commission_percent para string se necessário
        commission_percent: eventData.commission_percent?.toString() || null
      }

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)
        .select(`
          *,
          school:schools(*)
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear o evento atualizado para o tipo correto
        const updatedEvent: EventWithSchool = {
          id: data.id,
          tenant_id: data.tenant_id,
          school_id: data.school_id,
          name: data.name,
          event_date: data.event_date,
          event_end_date: data.event_end_date,
          commission_percent: data.commission_percent,
          notes: data.notes,
          status: data.status,
          products_enabled: data.products_enabled,
          created_at: data.created_at,
          updated_at: data.updated_at,
          school: {
            id: data.school.id,
            name: data.school.name,
            type: data.school.type,
            address: data.school.address,
            director_name: data.school.director_name,
            phone: data.school.phone,
            email: data.school.email,
            students_count: data.school.students_count,
            director_message: data.school.director_message,
            notes: data.school.notes,
            slug: data.school.slug,
            active: data.school.active,
            created_at: data.school.created_at,
            updated_at: data.school.updated_at
          }
        }
        
        setEvents(prev => prev.map(event => 
          event.id === eventId ? updatedEvent : event
        ))
        return updatedEvent
      }
    } catch (err) {
      console.error('Erro ao atualizar evento:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) {
        throw error
      }

      setEvents(prev => prev.filter(event => event.id !== eventId))
    } catch (err) {
      console.error('Erro ao deletar evento:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

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