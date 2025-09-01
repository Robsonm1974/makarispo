import type { Tables } from './database'

export type School = Tables<'schools'>
export type SchoolInsert = Tables<'schools'>['Insert']
export type SchoolUpdate = Tables<'schools'>['Update']

export interface SchoolFormData {
  name: string
  address?: string
  director_name?: string
  phone?: string
  email?: string
  type?: 'publica' | 'privada'
  students_count?: number
  director_message?: string
  notes?: string
  slug?: string
}