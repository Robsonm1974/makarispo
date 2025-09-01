'use client'

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export interface Photo {
  id: string
  participant_id: string | null
  filename: string
  original_filename: string | null
  url: string
  thumbnail_url: string | null
  file_size: number | null
  uploaded_at: string
  participant?: {
    id: string
    name: string
    class: string | null
    event_id: string
    school: {
      name: string
      type: string
    }
    event: {
      name: string
      event_date: string
    }
  }
}

export interface PhotoUpload {
  file: File
  participant_id?: string
  event_id: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface PhotoFilters {
  event_id?: string
  participant_id?: string
  search?: string
  date_from?: string
  date_to?: string
}

export function usePhotos() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar fotos com filtros
  const loadPhotos = useCallback(async (filters: PhotoFilters = {}) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('photos')
        .select(`
          *,
          participant:participants(
            id,
            name,
            class,
            event_id,
            school:schools(name, type),
            event:events(name, event_date)
          )
        `)
        .order('uploaded_at', { ascending: false })

      // Aplicar filtros
      if (filters.event_id) {
        query = query.eq('participant.event_id', filters.event_id)
      }

      if (filters.participant_id) {
        query = query.eq('participant_id', filters.participant_id)
      }

      if (filters.date_from) {
        query = query.gte('uploaded_at', filters.date_from)
      }

      if (filters.date_to) {
        query = query.lte('uploaded_at', filters.date_to)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Converter dados para tipo Photo
      const photosData: Photo[] = (data || []).map(item => {
        const participant = item.participant ? {
          id: item.participant.id,
          name: item.participant.name,
          class: item.participant.class,
          event_id: item.participant.event_id,
          school: {
            name: item.participant.school?.name || 'Escola não encontrada',
            type: item.participant.school?.type || 'tipo_desconhecido'
          },
          event: {
            name: item.participant.event?.name || 'Evento não encontrado',
            event_date: item.participant.event?.event_date || new Date().toISOString()
          }
        } : undefined

        return {
          id: item.id,
          participant_id: item.participant_id,
          filename: item.filename,
          original_filename: item.original_filename,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          file_size: item.file_size,
          uploaded_at: item.uploaded_at,
          participant
        }
      })

      // Aplicar filtro de busca se especificado
      let filteredPhotos = photosData
      if (filters.search) {
        filteredPhotos = photosData.filter(photo =>
          photo.original_filename?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          photo.participant?.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          photo.participant?.school.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          photo.participant?.event.name.toLowerCase().includes(filters.search!.toLowerCase())
        )
      }

      setPhotos(filteredPhotos)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar fotos'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Upload de foto única
  const uploadPhoto = useCallback(async (
    file: File,
    eventId: string,
    participantId?: string
  ): Promise<Photo | null> => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return null
    }

    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem')
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('Arquivo muito grande (máximo 10MB)')
      }

      // Gerar nome único
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const filename = `IMG_${timestamp}.${fileExtension}`

      // Upload para storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(`${user.id}/${eventId}/${filename}`, file)

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(`${user.id}/${eventId}/${filename}`)

      // Tentar associar por QR Code
      let finalParticipantId = participantId
      if (!finalParticipantId) {
        const qrCode = extractQRCodeFromFilename(file.name)
        if (qrCode) {
          const { data: participantData } = await supabase
            .from('participants')
            .select('id')
            .eq('qr_code', qrCode)
            .eq('event_id', eventId)
            .single()

          if (participantData) {
            finalParticipantId = participantData.id
          }
        }
      }

      // Salvar no banco
      const { data: photoData, error: dbError } = await supabase
        .from('photos')
        .insert({
          participant_id: finalParticipantId,
          filename,
          original_filename: file.name,
          url: urlData.publicUrl,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Retornar foto criada
      const newPhoto: Photo = {
        id: photoData.id,
        participant_id: photoData.participant_id,
        filename: photoData.filename,
        original_filename: photoData.original_filename,
        url: photoData.url,
        thumbnail_url: photoData.thumbnail_url,
        file_size: photoData.file_size,
        uploaded_at: photoData.uploaded_at
      }

      toast.success('Foto enviada com sucesso!')
      return newPhoto
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no upload'
      toast.error(errorMessage)
      throw err
    }
  }, [user])

  // Upload em lote
  const uploadPhotosBatch = useCallback(async (
    files: File[],
    eventId: string,
    onProgress?: (progress: number) => void
  ): Promise<Photo[]> => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return []
    }

    setUploading(true)
    const uploadedPhotos: Photo[] = []
    let completed = 0

    try {
      for (const file of files) {
        try {
          const photo = await uploadPhoto(file, eventId)
          if (photo) {
            uploadedPhotos.push(photo)
          }
        } catch (error) {
          console.error(`Erro no upload de ${file.name}:`, error)
        }

        completed++
        if (onProgress) {
          onProgress((completed / files.length) * 100)
        }
      }

      if (uploadedPhotos.length > 0) {
        toast.success(`${uploadedPhotos.length} de ${files.length} fotos enviadas com sucesso!`)
        // Recarregar lista
        await loadPhotos({ event_id: eventId })
      }

      return uploadedPhotos
    } finally {
      setUploading(false)
    }
  }, [user, uploadPhoto, loadPhotos])

  // Deletar foto
  const deletePhoto = useCallback(async (photoId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (error) throw error

      // Remover da lista local
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      toast.success('Foto deletada com sucesso!')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar foto'
      toast.error(errorMessage)
      return false
    }
  }, [])

  // Atualizar foto
  const updatePhoto = useCallback(async (
    photoId: string,
    updates: Partial<Pick<Photo, 'participant_id'>>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', photoId)

      if (error) throw error

      // Atualizar lista local
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, ...updates } : p
      ))

      toast.success('Foto atualizada com sucesso!')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar foto'
      toast.error(errorMessage)
      return false
    }
  }, [])

  // Extrair QR Code do nome do arquivo
  const extractQRCodeFromFilename = (filename: string): string | null => {
    const match = filename.match(/IMG_\d+_(\d{7})\.(jpg|jpeg|png)/i)
    return match ? match[1] : null
  }

  // Gerar thumbnail (simulado - em produção usar serviço de imagem)
  const generateThumbnail = useCallback(async (photoUrl: string): Promise<string> => {
    // Por enquanto, retorna a URL original
    // Em produção, implementar geração de thumbnail
    return photoUrl
  }, [])

  // Estatísticas
  const getStats = useCallback(() => {
    const total = photos.length
    const associated = photos.filter(p => p.participant_id).length
    const pending = total - associated

    return { total, associated, pending }
  }, [photos])

  // Carregar fotos na inicialização
  useEffect(() => {
    if (user) {
      loadPhotos()
    }
  }, [user, loadPhotos])

  return {
    // Estado
    photos,
    loading,
    uploading,
    error,
    
    // Ações
    loadPhotos,
    uploadPhoto,
    uploadPhotosBatch,
    deletePhoto,
    updatePhoto,
    
    // Utilitários
    extractQRCodeFromFilename,
    generateThumbnail,
    getStats,
    
    // Limpar erro
    clearError: () => setError(null)
  }
}