'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface ParticipantPhoto {
  id: string
  participant_id: string
  filename: string
  original_filename: string | null
  photo_url: string
  file_size: number | null
  uploaded_at: string
}

export function useParticipantPhotos(participantId?: string) {
  const [photos, setPhotos] = useState<ParticipantPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar fotos do participante
  const fetchPhotos = async () => {
    if (!participantId) {
      setPhotos([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('participant_id', participantId)
        .order('uploaded_at', { ascending: false })

      if (fetchError) {
        console.error('Erro ao buscar fotos:', fetchError)
        setError('Erro ao carregar fotos')
        return
      }

      setPhotos(data || [])
    } catch (error) {
      console.error('Erro ao buscar fotos:', error)
      setError('Erro ao carregar fotos')
    } finally {
      setLoading(false)
    }
  }

  // Upload de foto
  const uploadPhoto = async (file: File): Promise<boolean> => {
    if (!participantId) {
      toast.error('ID do participante não encontrado')
      return false
    }


    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return false
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Arquivo muito grande. Máximo: 5MB')
      return false
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use: JPEG, PNG ou WebP')
      return false
    }

    setUploading(true)
    setError(null)

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${participantId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload para o bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        toast.error('Erro ao fazer upload da foto')
        return false
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      if (!urlData.publicUrl) {
        toast.error('Erro ao obter URL da foto')
        return false
      }

      // Salvar registro na tabela photos
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          participant_id: participantId,
          filename: fileName,
          original_filename: file.name,
          photo_url: urlData.publicUrl,
          file_size: file.size
        })

      if (dbError) {
        console.error('Erro ao salvar no banco:', dbError)
        // Tentar deletar arquivo do storage se falhou no banco
        await supabase.storage.from('photos').remove([fileName])
        toast.error('Erro ao salvar informações da foto')
        return false
      }

      toast.success('Foto enviada com sucesso!')
      // Recarregar fotos
      await fetchPhotos()
      return true

    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro inesperado ao enviar foto')
      return false
    } finally {
      setUploading(false)
    }
  }

  // Upload múltiplo
  const uploadMultiplePhotos = async (files: FileList): Promise<boolean> => {
    const fileArray = Array.from(files)
    let successCount = 0

    for (const file of fileArray) {
      const success = await uploadPhoto(file)
      if (success) successCount++
    }

    if (successCount === fileArray.length) {
      toast.success(`${successCount} foto(s) enviada(s) com sucesso!`)
      return true
    } else if (successCount > 0) {
      toast.warning(`${successCount} de ${fileArray.length} foto(s) enviada(s)`)
      return true
    } else {
      toast.error('Nenhuma foto foi enviada')
      return false
    }
  }

  // Deletar foto
  const deletePhoto = async (photoId: string): Promise<boolean> => {
    try {
      // Buscar informações da foto
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('filename')
        .eq('id', photoId)
        .single()

      if (fetchError || !photo) {
        toast.error('Foto não encontrada')
        return false
      }

      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.filename])

      if (storageError) {
        console.error('Erro ao deletar do storage:', storageError)
        // Continuar mesmo com erro no storage para limpar o banco
      }

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (dbError) {
        console.error('Erro ao deletar do banco:', dbError)
        toast.error('Erro ao deletar foto')
        return false
      }

      toast.success('Foto deletada com sucesso!')
      // Recarregar fotos
      await fetchPhotos()
      return true

    } catch (error) {
      console.error('Erro ao deletar foto:', error)
      toast.error('Erro inesperado ao deletar foto')
      return false
    }
  }

  // Carregar fotos quando participantId mudar
  useEffect(() => {
    fetchPhotos()
  }, [participantId])

  return {
    photos,
    loading,
    uploading,
    error,
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    refetch: fetchPhotos
  }
}
