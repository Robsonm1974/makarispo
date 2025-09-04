import type { Tables } from './database'

// Tipo base para participantes
export type Participant = Tables<'participants'>

// Tipo para participantes com relacionamentos - CORRIGIDO
export type ParticipantWithRelations = {
  id: string
  event_id: string
  name: string
  turma: string | null // Apenas turma, sem class
  tipo: string | null
  qr_code: string | null
  notes: string | null
  active: boolean | null
  created_at: string
  updated_at: string
  deleted_at: string | null
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
  turma?: string | null
  tipo?: string | null
  notes?: string | null
}

// Tipo para inserção no Supabase - CORRIGIDO
export interface ParticipantInsert {
  tenant_id?: string
  school_id?: string
  event_id: string
  name: string
  turma?: string | null // Campo real da tabela
  tipo?: string | null
  qr_code?: string | null // Opcional - trigger gera automaticamente
  notes?: string | null
  active?: boolean | null
}