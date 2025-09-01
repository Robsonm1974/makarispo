import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Photo {
  id: string
  participant_id: string
  file_path: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
  created_at: string
  updated_at: string
}

interface PhotoWithRelations extends Photo {
  participant: {
    id: string
    name: string
    event_id: string
    event: {
      id: string
      name: string
      school: {
        name: string
        type: string | null
      }
    }
  }
}

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          participant:participants(
            id,
            name,
            event_id,
            event:events(
              id,
              name,
              school:schools(
                name,
                type
              )
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        // Mapear os dados para o tipo correto
        const mappedPhotos: PhotoWithRelations[] = data.map(item => ({
          id: item.id,
          participant_id: item.participant_id,
          file_path: item.file_path,
          file_name: item.file_name,
          file_size: item.file_size,
          mime_type: item.mime_type,
          uploaded_at: item.uploaded_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
          participant: {
            id: item.participant.id,
            name: item.participant.name,
            event_id: item.participant.event_id,
            event: {
              id: item.participant.event.id,
              name: item.participant.event.name,
              school: {
                name: item.participant.event.school.name || 'Escola não encontrada',
                type: item.participant.event.school.type
              }
            }
          }
        }))
        setPhotos(mappedPhotos)
      }
    } catch (err) {
      console.error('Erro ao buscar fotos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  const createPhoto = useCallback(async (photoData: {
    participant_id: string
    file_path: string
    file_name: string
    file_size: number
    mime_type: string
  }) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('photos')
        .insert([photoData])
        .select(`
          *,
          participant:participants(
            id,
            name,
            event_id,
            event:events(
              id,
              name,
              school:schools(
                name,
                type
              )
            )
          )
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear a nova foto para o tipo correto
        const newPhoto: PhotoWithRelations = {
          id: data.id,
          participant_id: data.participant_id,
          file_path: data.file_path,
          file_name: data.file_name,
          file_size: data.file_size,
          mime_type: data.mime_type,
          uploaded_at: data.uploaded_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
          participant: {
            id: data.participant.id,
            name: data.participant.name,
            event_id: data.participant.event_id,
            event: {
              id: data.participant.event.id,
              name: data.participant.event.name,
              school: {
                name: data.participant.event.school.name || 'Escola não encontrada',
                type: data.participant.event.school.type
              }
            }
          }
        }
        
        setPhotos(prev => [newPhoto, ...prev])
        return newPhoto
      }
    } catch (err) {
      console.error('Erro ao criar foto:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const updatePhoto = useCallback(async (photoId: string, photoData: Partial<Photo>) => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('photos')
        .update(photoData)
        .eq('id', photoId)
        .select(`
          *,
          participant:participants(
            id,
            name,
            event_id,
            event:events(
              id,
              name,
              school:schools(
                name,
                type
              )
            )
          )
        `)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        // Mapear a foto atualizada para o tipo correto
        const updatedPhoto: PhotoWithRelations = {
          id: data.id,
          participant_id: data.participant_id,
          file_path: data.file_path,
          file_name: data.file_name,
          file_size: data.file_size,
          mime_type: data.mime_type,
          uploaded_at: data.uploaded_at,
          created_at: data.created_at,
          updated_at: data.updated_at,
          participant: {
            id: data.participant.id,
            name: data.participant.name,
            event_id: data.participant.event_id,
            event: {
              id: data.participant.event.id,
              name: data.participant.event.name,
              school: {
                name: data.participant.event.school.name || 'Escola não encontrada',
                type: data.participant.event.school.type
              }
            }
          }
        }
        
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId ? updatedPhoto : photo
        ))
        return updatedPhoto
      }
    } catch (err) {
      console.error('Erro ao atualizar foto:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (error) {
        throw error
      }

      setPhotos(prev => prev.filter(photo => photo.id !== photoId))
    } catch (err) {
      console.error('Erro ao deletar foto:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return {
    photos,
    loading,
    error,
    createPhoto,
    updatePhoto,
    deletePhoto,
    refetch: fetchPhotos
  }
}