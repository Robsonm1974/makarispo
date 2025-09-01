import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { School } from '@/types/schools'

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      if (data) {
        // Mapear os dados para o tipo correto com type assertion
        const mappedSchools: School[] = data.map(school => ({
          id: school.id,
          tenant_id: school.tenant_id,
          name: school.name,
          address: school.address,
          director_name: school.director_name,
          director_photo_url: school.director_photo_url,
          phone: school.phone,
          email: school.email,
          type: school.type as 'publica' | 'privada' | null,
          students_count: school.students_count,
          school_photo_url: school.school_photo_url,
          director_message: school.director_message,
          social_media: school.social_media as Record<string, unknown> | null,
          notes: school.notes,
          slug: school.slug,
          active: school.active,
          created_at: school.created_at,
          updated_at: school.updated_at
        }))
        setSchools(mappedSchools)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar escolas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSchool = useCallback(async (schoolData: {
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
  }) => {
    try {
      setError(null)

      // Converter social_media para o formato esperado pelo Supabase
      const insertData = {
        ...schoolData,
        social_media: schoolData.social_media ? JSON.stringify(schoolData.social_media) : null
      }

      const { data, error } = await supabase
        .from('schools')
        .insert([insertData])
        .select()
        .single()

      if (error) throw error

      if (data) {
        // Mapear a nova escola para o tipo correto
        const newSchool: School = {
          id: data.id,
          tenant_id: data.tenant_id,
          name: data.name,
          address: data.address,
          director_name: data.director_name,
          director_photo_url: data.director_photo_url,
          phone: data.phone,
          email: data.email,
          type: data.type as 'publica' | 'privada' | null,
          students_count: data.students_count,
          school_photo_url: data.school_photo_url,
          director_message: data.director_message,
          social_media: data.social_media as Record<string, unknown> | null,
          notes: data.notes,
          slug: data.slug,
          active: data.active,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        
        setSchools(prev => [newSchool, ...prev])
        return newSchool
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar escola')
      throw err
    }
  }, [])

  const updateSchool = useCallback(async (schoolId: string, schoolData: Partial<School>) => {
    try {
      setError(null)

      // Converter social_media para o formato esperado pelo Supabase
      const updateData = {
        ...schoolData,
        social_media: schoolData.social_media ? JSON.stringify(schoolData.social_media) : null
      }

      const { data, error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', schoolId)
        .select()
        .single()

      if (error) throw error

      if (data) {
        // Mapear a escola atualizada para o tipo correto
        const updatedSchool: School = {
          id: data.id,
          tenant_id: data.tenant_id,
          name: data.name,
          address: data.address,
          director_name: data.director_name,
          director_photo_url: data.director_photo_url,
          phone: data.phone,
          email: data.email,
          type: data.type as 'publica' | 'privada' | null,
          students_count: data.students_count,
          school_photo_url: data.school_photo_url,
          director_message: data.director_message,
          social_media: data.social_media as Record<string, unknown> | null,
          notes: data.notes,
          slug: data.slug,
          active: data.active,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
        
        setSchools(prev => prev.map(school => 
          school.id === schoolId ? updatedSchool : school
        ))
        return updatedSchool
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar escola')
      throw err
    }
  }, [])

  const deleteSchool = useCallback(async (schoolId: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId)

      if (error) throw error

      setSchools(prev => prev.filter(school => school.id !== schoolId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar escola')
      throw err
    }
  }, [])

  const getSchoolById = useCallback((schoolId: string) => {
    return schools.find(school => school.id === schoolId)
  }, [schools])

  const getSchoolsByType = useCallback((type: 'publica' | 'privada') => {
    return schools.filter(school => school.type === type)
  }, [schools])

  const getActiveSchools = useCallback(() => {
    return schools.filter(school => school.active)
  }, [schools])

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  return {
    schools,
    loading,
    error,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolById,
    getSchoolsByType,
    getActiveSchools,
    refetch: fetchSchools
  }
}