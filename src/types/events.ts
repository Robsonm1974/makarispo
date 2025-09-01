import type { Tables } from './database'

export type Event = Tables<'events'>
export type EventInsert = Tables<'events'>['Insert']
export type EventUpdate = Tables<'events'>['Update']

export interface EventFormData {
  name: string
  school_id: string
  event_date?: string
  event_end_date?: string
  commission_percent?: number
  notes?: string
  status?: 'planned' | 'active' | 'completed'
  products_enabled?: string[]
}

export interface EventWithSchool extends Event {
  school: {
    name: string
    type: 'publica' | 'privada'
  }
}