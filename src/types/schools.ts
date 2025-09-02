// Definir tipos explícitos para evitar problemas de inferência
export interface School {
  id: string
  tenant_id: string
  name: string
  address: string | null
  director_name: string | null
  director_photo_url: string | null
  phone: string | null
  email: string | null
  type: 'publica' | 'privada' | null
  students_count: number | null
  school_photo_url: string | null
  director_message: string | null
  social_media: Record<string, unknown> | null
  notes: string | null
  slug: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface SchoolInsert {
  id?: string
  tenant_id: string
  name: string
  address?: string | null
  director_name?: string | null
  director_photo_url?: string | null
  phone?: string | null
  email?: string | null
  type?: 'publica' | 'privada' | null
  students_count?: number | null
  school_photo_url?: string | null
  director_message?: string | null
  social_media?: Record<string, unknown> | null
  notes?: string | null
  slug?: string | null
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SchoolUpdate {
  id?: string
  tenant_id?: string
  name?: string
  address?: string | null
  director_name?: string | null
  director_photo_url?: string | null
  phone?: string | null
  email?: string | null
  type?: 'publica' | 'privada' | null
  students_count?: number | null
  school_photo_url?: string | null
  director_message?: string | null
  social_media?: Record<string, unknown> | null
  notes?: string | null
  slug?: string | null
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SchoolFormData {
  name: string
  address?: string | null
  director_name?: string | null
  director_photo_file?: File | null
  phone?: string | null
  email?: string | null
  type?: 'publica' | 'privada' | null
  students_count?: number | null
  school_photo_file?: File | null
  director_message?: string | null
  social_media?: Record<string, unknown> | null
  notes?: string | null
  slug?: string | null
  active?: boolean
}