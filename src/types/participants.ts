import type { Tables } from './database'

// Tipo base para participantes
export type Participant = Tables<'participants'>

// Tipo para participantes com relacionamentos - CORRIGIDO
export type ParticipantWithRelations = {
  id: string
  event_id: string
  name: string
  class: string | null
  qr_code: string
  notes: string | null
  created_at: string
  updated_at: string
  event: {
    id: string
    name: string
    event_date: string | null
    event_end_date: string | null
    status: string
    school: {
      id: string
      name: string
      type: 'publica' | 'privada'
    }
  }
}

// Tipo para formulário de participantes
export interface ParticipantFormData {
  name: string
  class?: string | null
  qr_code: string
  notes?: string | null
}

// Tipo para inserção de participantes
export interface ParticipantInsert {
  event_id: string
  name: string
  class?: string | null
  qr_code: string
  notes?: string | null
}

// Função helper para criar dados de inserção
export function createParticipantInsert(data: ParticipantFormData, eventId: string, tenantId: string): ParticipantInsert {
  return {
    event_id: eventId,
    name: data.name,
    class: data.class,
    qr_code: data.qr_code,
    notes: data.notes
  }
}

// Tipo para atualização de participantes
export interface ParticipantUpdate {
  name?: string
  class?: string | null
  qr_code?: string
  notes?: string | null
}