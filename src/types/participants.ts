import type { Tables } from './database'

export type Participant = Tables<'participants'>
export type ParticipantInsert = Tables<'participants'>['Insert']
export type ParticipantUpdate = Tables<'participants'>['Update']

export interface ParticipantFormData {
  name: string
  email?: string
  phone?: string
  school_id: string
  event_id: string
  grade?: string
  class_name?: string
  notes?: string
}

export interface ParticipantWithRelations extends Participant {
  school: {
    name: string
    type: 'publica' | 'privada'
  }
  event: {
    name: string
    event_date: string
  }
}