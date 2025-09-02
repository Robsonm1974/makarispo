import type { Tables } from './database'

// Tipo base para eventos
export type Event = Tables<'events'>

// Tipo para eventos com relacionamentos - CORRIGIDO
export type EventWithSchool = {
  id: string
  tenant_id: string
  school_id: string
  name: string
  event_date: string | null
  event_end_date: string | null
  commission_percent: number | null
  notes: string | null
  status: string
  products_enabled: string[] | null
  created_at: string
  updated_at: string
  school: {
    id: string
    name: string
    type: string | null
    address: string | null
    director_name: string | null
    phone: string | null
    email: string | null
    students_count: number | null
    director_message: string | null
    notes: string | null
    slug: string | null
    active: boolean
    created_at: string
    updated_at: string
  }
}

// Tipo para formulário de eventos
export interface EventFormData {
  name: string
  school_id: string
  event_date: string | null
  event_end_date: string | null
  commission_percent: number | null
  notes: string | null
  status: string
}

// Tipo para inserção de eventos
export interface EventInsert {
  tenant_id: string
  school_id: string
  name: string
  event_date?: string | null
  event_end_date?: string | null
  commission_percent?: number | null
  notes?: string | null
  status?: string
  products_enabled?: string[] | null
}

// Função helper para criar dados de inserção
export function createEventInsert(data: EventFormData, tenantId: string): EventInsert {
  return {
    tenant_id: tenantId,
    school_id: data.school_id,
    name: data.name,
    event_date: data.event_date,
    event_end_date: data.event_end_date,
    commission_percent: data.commission_percent,
    notes: data.notes,
    status: data.status || 'active',
    products_enabled: data.products_enabled
  }
}

// Tipo para atualização de eventos
export interface EventUpdate {
  name?: string
  school_id?: string
  event_date?: string | null
  event_end_date?: string | null
  commission_percent?: number | null
  notes?: string | null
  status?: string
  products_enabled?: string[] | null
}