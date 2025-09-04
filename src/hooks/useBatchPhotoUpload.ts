'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { ParticipantWithRelations } from '@/types/participants'

export interface BatchUploadResult {
  success: number
  errors: number
  totalFiles: number
  successFiles: string[]
  errorFiles: Array<{
    filename: string
    error: string
  }>
  orphanFiles: string[] // Arquivos sem QR code correspondente
}

interface ParticipantQRMap {
  [qrCode: string]: ParticipantWithRelations
}

export function useBatchPhotoUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const extractQRCodeFromFilename = (filename: string): string | null => {
    // Regex para encontrar QR code no formato QR1234567
    const qrMatch = filename.match(/QR\d{7}/i)
    return qrMatch ? qrMatch[0].toUpperCase() : null
  }

  const createParticipantQRMap = (participants: ParticipantWithRelations[]): ParticipantQRMap => {
    const qrMap: ParticipantQRMap = {}
    participants.forEach(participant => {
      if (participant.qr_code) {
        qrMap[participant.qr_code] = participant
      }
    })
    return qrMap
  }

  const uploadPhotoToSupabase = async (
    file: File,
    participant: ParticipantWithRelations,
    originalFilename: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${participant.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload para o bucket photos
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        return { success: false, error: uploadError.message }
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // Inserir registro na tabela photos
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          participant_id: participant.id,
          filename: fileName,
          original_filename: originalFilename,
          photo_url: urlData.publicUrl,
          file_size: file.size
        })

      if (insertError) {
        // Se falhou ao inserir, remover arquivo do storage
        await supabase.storage.from('photos').remove([fileName])
        return { success: false, error: insertError.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  }

  const uploadBatchPhotos = async (
    files: FileList,
    participants: ParticipantWithRelations[]
  ): Promise<BatchUploadResult> => {
    setIsUploading(true)
    setProgress(0)

    const result: BatchUploadResult = {
      success: 0,
      errors: 0,
      totalFiles: files.length,
      successFiles: [],
      errorFiles: [],
      orphanFiles: []
    }

    const qrMap = createParticipantQRMap(participants)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const qrCode = extractQRCodeFromFilename(file.name)

        if (!qrCode) {
          result.orphanFiles.push(file.name)
          result.errors++
          continue
        }

        const participant = qrMap[qrCode]
        if (!participant) {
          result.orphanFiles.push(file.name)
          result.errors++
          continue
        }

        const uploadResult = await uploadPhotoToSupabase(file, participant, file.name)
        
        if (uploadResult.success) {
          result.success++
          result.successFiles.push(file.name)
        } else {
          result.errors++
          result.errorFiles.push({
            filename: file.name,
            error: uploadResult.error || 'Erro desconhecido'
          })
        }

        // Atualizar progresso
        const newProgress = Math.round(((i + 1) / files.length) * 100)
        setProgress(newProgress)
      }

      toast.success(`Upload concluído! ${result.success} fotos importadas com sucesso.`)
      
    } catch (error) {
      toast.error('Erro durante o upload em lote')
      console.error('Batch upload error:', error)
    } finally {
      setIsUploading(false)
      setProgress(0)
    }

    return result
  }

  return {
    isUploading,
    progress,
    uploadBatchPhotos
  }
}
