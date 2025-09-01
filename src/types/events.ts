// Definir tipos explícitos para evitar problemas de inferência
export interface Event {
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
}

export interface EventInsert {
  id?: string
  tenant_id: string
  school_id: string
  name: string
  event_date?: string | null
  event_end_date?: string | null
  commission_percent?: number | null
  notes?: string | null
  status?: string
  products_enabled?: string[] | null
  created_at?: string
  updated_at?: string
}

export interface EventUpdate {
  id?: string
  tenant_id?: string
  school_id?: string
  name?: string
  event_date?: string | null
  event_end_date?: string | null
  commission_percent?: number | null
  notes?: string | null
  status?: string
  products_enabled?: string[] | null
  created_at?: string
  updated_at?: string
}

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