import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { schoolStorageUtils } from '@/lib/school-storage'
import type { School, SchoolFormData } from '@/types/schools'

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

  const createSchool = useCallback(async (schoolData: SchoolFormData, tenantId: string) => {
    try {
      setError(null)

      // Upload images if provided
      let schoolPhotoUrl: string | null = null
      let directorPhotoUrl: string | null = null

      // Create school first to get ID for image uploads
      const insertData = {
        tenant_id: tenantId,
        name: schoolData.name,
        address: schoolData.address,
        director_name: schoolData.director_name,
        phone: schoolData.phone,
        email: schoolData.email,
        type: schoolData.type,
        students_count: schoolData.students_count,
        director_message: schoolData.director_message,
        social_media: schoolData.social_media,
        notes: schoolData.notes,
        slug: schoolData.slug,
        active: schoolData.active
      }

      const { data: newSchool, error: createError } = await supabase
        .from('schools')
        .insert([insertData])
        .select()
        .single()

      if (createError) throw createError

      if (newSchool) {
        // Upload images if provided
        if (schoolData.school_photo_file) {
          try {
            const schoolPhotoResult = await schoolStorageUtils.uploadSchoolPhoto(
              schoolData.school_photo_file,
              newSchool.id
            )
            schoolPhotoUrl = schoolPhotoResult.url
          } catch (uploadError) {
            console.error('Error uploading school photo:', uploadError)
          }
        }

        if (schoolData.director_photo_file) {
          try {
            const directorPhotoResult = await schoolStorageUtils.uploadDirectorPhoto(
              schoolData.director_photo_file,
              newSchool.id
            )
            directorPhotoUrl = directorPhotoResult.url
          } catch (uploadError) {
            console.error('Error uploading director photo:', uploadError)
          }
        }

        // Update school with photo URLs if uploaded
        if (schoolPhotoUrl || directorPhotoUrl) {
          const updateData: any = {}
          if (schoolPhotoUrl) updateData.school_photo_url = schoolPhotoUrl
          if (directorPhotoUrl) updateData.director_photo_url = directorPhotoUrl

          const { data: updatedSchool, error: updateError } = await supabase
            .from('schools')
            .update(updateData)
            .eq('id', newSchool.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating school with photos:', updateError)
          } else if (updatedSchool) {
            // Mapear a escola atualizada para o tipo correto
            const finalSchool: School = {
              id: updatedSchool.id,
              tenant_id: updatedSchool.tenant_id,
              name: updatedSchool.name,
              address: updatedSchool.address,
              director_name: updatedSchool.director_name,
              director_photo_url: updatedSchool.director_photo_url,
              phone: updatedSchool.phone,
              email: updatedSchool.email,
              type: updatedSchool.type as 'publica' | 'privada' | null,
              students_count: updatedSchool.students_count,
              school_photo_url: updatedSchool.school_photo_url,
              director_message: updatedSchool.director_message,
              social_media: updatedSchool.social_media as Record<string, unknown> | null,
              notes: updatedSchool.notes,
              slug: updatedSchool.slug,
              active: updatedSchool.active,
              created_at: updatedSchool.created_at,
              updated_at: updatedSchool.updated_at
            }
            
            setSchools(prev => [finalSchool, ...prev])
            return finalSchool
          }
        }

        // Mapear a nova escola para o tipo correto
        const finalSchool: School = {
          id: newSchool.id,
          tenant_id: newSchool.tenant_id,
          name: newSchool.name,
          address: newSchool.address,
          director_name: newSchool.director_name,
          director_photo_url: newSchool.director_photo_url,
          phone: newSchool.phone,
          email: newSchool.email,
          type: newSchool.type as 'publica' | 'privada' | null,
          students_count: newSchool.students_count,
          school_photo_url: newSchool.school_photo_url,
          director_message: newSchool.director_message,
          social_media: newSchool.social_media as Record<string, unknown> | null,
          notes: newSchool.notes,
          slug: newSchool.slug,
          active: newSchool.active,
          created_at: newSchool.created_at,
          updated_at: newSchool.updated_at
        }
        
        setSchools(prev => [finalSchool, ...prev])
        return finalSchool
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar escola')
      throw err
    }
  }, [])

  const updateSchool = useCallback(async (schoolId: string, schoolData: SchoolFormData) => {
    try {
      setError(null)

      // Upload images if provided
      let schoolPhotoUrl: string | null = null
      let directorPhotoUrl: string | null = null

      if (schoolData.school_photo_file) {
        try {
          const schoolPhotoResult = await schoolStorageUtils.uploadSchoolPhoto(
            schoolData.school_photo_file,
            schoolId
          )
          schoolPhotoUrl = schoolPhotoResult.url
        } catch (uploadError) {
          console.error('Error uploading school photo:', uploadError)
        }
      }

      if (schoolData.director_photo_file) {
        try {
          const directorPhotoResult = await schoolStorageUtils.uploadDirectorPhoto(
            schoolData.director_photo_file,
            schoolId
          )
          directorPhotoUrl = directorPhotoResult.url
        } catch (uploadError) {
          console.error('Error uploading director photo:', uploadError)
        }
      }

      // Prepare update data
      const updateData: any = {
        name: schoolData.name,
        address: schoolData.address,
        director_name: schoolData.director_name,
        phone: schoolData.phone,
        email: schoolData.email,
        type: schoolData.type,
        students_count: schoolData.students_count,
        director_message: schoolData.director_message,
        social_media: schoolData.social_media,
        notes: schoolData.notes,
        slug: schoolData.slug,
        active: schoolData.active
      }

      // Add photo URLs if uploaded
      if (schoolPhotoUrl) updateData.school_photo_url = schoolPhotoUrl
      if (directorPhotoUrl) updateData.director_photo_url = directorPhotoUrl

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

      // Get school data to delete associated images
      const school = schools.find(s => s.id === schoolId)
      if (school) {
        // Delete associated images
        if (school.school_photo_url) {
          try {
            await schoolStorageUtils.deleteSchoolPhoto(school.school_photo_url)
          } catch (deleteError) {
            console.error('Error deleting school photo:', deleteError)
          }
        }

        if (school.director_photo_url) {
          try {
            await schoolStorageUtils.deleteDirectorPhoto(school.director_photo_url)
          } catch (deleteError) {
            console.error('Error deleting director photo:', deleteError)
          }
        }
      }

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
  }, [schools])

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