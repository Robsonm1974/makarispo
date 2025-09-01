// Definir tipos explícitos para evitar problemas de inferência
export interface Participant {
  id: string
  event_id: string
  name: string
  class: string | null
  qr_code: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ParticipantInsert {
  id?: string
  event_id: string
  name: string
  class?: string | null
  qr_code: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface ParticipantUpdate {
  id?: string
  event_id?: string
  name?: string
  class?: string | null
  qr_code?: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface ParticipantFormData {
  name: string
  event_id: string
  class?: string
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