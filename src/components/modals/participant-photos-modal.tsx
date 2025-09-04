'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Trash2, Eye, Download } from 'lucide-react'
import { useParticipantPhotos } from '@/hooks/useParticipantPhotos'
import type { ParticipantWithRelations } from '@/types/participants'

interface ParticipantPhotosModalProps {
  participant: ParticipantWithRelations | null
  open: boolean
  onClose: () => void
}

export function ParticipantPhotosModal({ participant, open, onClose }: ParticipantPhotosModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  const { 
    photos, 
    loading, 
    uploading, 
    uploadMultiplePhotos, 
    deletePhoto 
  } = useParticipantPhotos(participant?.id)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadMultiplePhotos(files)
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    const success = await deletePhoto(photoId)
    if (success) {
      setShowDeleteConfirm(null)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A'
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  if (!participant) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Fotos de {participant.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Adicionar Fotos</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Clique para selecionar fotos ou arraste arquivos aqui
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG, WebP - Máximo 5MB por arquivo
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleFileSelect}
                    disabled={uploading}
                    className="mt-4"
                  >
                    {uploading ? 'Enviando...' : 'Selecionar Fotos'}
                  </Button>
                </div>

                {/* Input oculto para seleção de arquivos */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de Fotos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Fotos ({photos.length})
              </h3>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              )}
            </div>

            {photos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Upload className="mx-auto h-12 w-12 mb-4" />
                    <p>Nenhuma foto encontrada</p>
                    <p className="text-sm">Adicione fotos usando o botão acima</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={photo.photo_url}
                        alt={photo.original_filename || 'Foto do participante'}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedPhoto(photo.photo_url)}
                      />
                      
                      {/* Badge com número de arquivo */}
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 text-xs"
                      >
                        {formatFileSize(photo.file_size)}
                      </Badge>

                      {/* Botões de ação */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedPhoto(photo.photo_url)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(photo.photo_url, '_blank')}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {showDeleteConfirm === photo.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeletePhoto(photo.id)}
                              title="Confirmar exclusão"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={() => setShowDeleteConfirm(null)}
                              title="Cancelar"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowDeleteConfirm(photo.id)}
                            title="Excluir foto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Informações da foto */}
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate" title={photo.original_filename || ''}>
                          {photo.original_filename || 'Sem nome'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(photo.uploaded_at)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de visualização da foto */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img
                  src={selectedPhoto}
                  alt="Foto ampliada"
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
