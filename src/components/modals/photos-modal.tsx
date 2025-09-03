'use client'

import { useState, useCallback } from 'react'
import NextImage from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge' // Removido - não utilizado
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Image, Search, Upload, Download, Eye, Trash2, Grid3X3, List } from 'lucide-react'
import { useParticipants } from '@/hooks/useParticipants'
import type { EventWithSchool } from '@/types/events'

interface Photo {
  id: string
  participant_id: string
  file_path: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
  participant: {
    name: string
    turma: string | null
    qr_code: string | null
  }
}

interface PhotosModalProps {
  event: EventWithSchool
  onClose: () => void
}

export default function PhotosModal({ event, onClose }: PhotosModalProps) {
  const { participants } = useParticipants()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploading, setUploading] = useState(false)

  // Filtrar participantes do evento atual
  const eventParticipants = participants.filter(p => p.event_id === event.id)

  // Mock data para fotos (será substituído pelo hook real)
  const mockPhotos: Photo[] = eventParticipants.map(participant => ({
    id: `photo-${participant.id}`,
    participant_id: participant.id,
    file_path: `/mock/photos/${participant.id}.jpg`,
    file_name: `${participant.name}.jpg`,
    file_size: 2048576, // 2MB
    mime_type: 'image/jpeg',
    uploaded_at: new Date().toISOString(),
    participant: {
      name: participant.name,
              turma: participant.turma,
      qr_code: participant.qr_code
    }
  }))

  const filteredPhotos = mockPhotos.filter(photo => {
    const matchesSearch = 
      photo.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.participant.turma && photo.participant.turma.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (photo.participant.qr_code && photo.participant.qr_code.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesParticipant = selectedParticipant === 'all' || photo.participant_id === selectedParticipant

    return matchesSearch && matchesParticipant
  })

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      // Mock upload - será implementado com Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`${files.length} foto(s) enviada(s) com sucesso!`)
    } catch (error) {
      toast.error('Erro ao enviar fotos')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }, [])

  const handleDownload = useCallback(async (photo: Photo) => {
    try {
      // Mock download - será implementado com Supabase Storage
      toast.success(`Download iniciado: ${photo.file_name}`)
    } catch (error) {
      toast.error('Erro ao baixar foto')
      console.error('Download error:', error)
    }
  }, [])

  const handleDelete = useCallback(async (photoId: string) => {
    try {
      // Mock delete - será implementado com Supabase
      console.log('Deleting photo:', photoId)
      toast.success('Foto excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir foto')
      console.error('Delete error:', error)
    }
  }, [])

  const triggerFileInput = useCallback(() => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }, [])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" role="img" aria-label="Ícone fotos" />
            Fotos - {event.name}
          </DialogTitle>
          <CardDescription>
            Gerencie as fotos dos participantes do evento {event.name}
          </CardDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Fotos
              </CardTitle>
              <CardDescription>
                Faça upload de fotos para os participantes deste evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={triggerFileInput}
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Selecionar Arquivos'}
                  </Button>
                </div>
                
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Processando upload...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar fotos por nome, turma ou QR code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Participantes</option>
                {eventParticipants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name} {participant.turma ? `(${participant.turma})` : ''}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                {viewMode === 'grid' ? 'Lista' : 'Grid'}
              </Button>
            </div>
          </div>

          {/* Photos Display */}
          <div className="flex-1 overflow-y-auto">
            {filteredPhotos.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPhotos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100 relative group">
                        <NextImage
                          src={photo.file_path}
                          alt={`Foto de ${photo.participant.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        
                        {/* Overlay com ações */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownload(photo)}
                              className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(photo.file_path, '_blank')}
                              className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(photo.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 truncate">
                            {photo.participant.name}
                          </h4>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            {photo.participant.turma && (
                              <p className="truncate">
                                <span className="font-medium">Turma:</span> {photo.participant.turma}
                              </p>
                            )}
                            <p className="truncate text-xs">
                              <span className="font-medium">QR:</span> {photo.participant.qr_code}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {(photo.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span>
                              {new Date(photo.uploaded_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPhotos.map((photo) => (
                    <Card key={photo.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <NextImage
                              src={photo.file_path}
                              alt={`Foto de ${photo.participant.name}`}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {photo.participant.name}
                            </h4>
                            
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              {photo.participant.turma && (
                                <p className="truncate">
                                  <span className="font-medium">Turma:</span> {photo.participant.turma}
                                </p>
                              )}
                              <p className="truncate">
                                <span className="font-medium">QR:</span> {photo.participant.qr_code}
                              </p>
                              <p className="truncate">
                                <span className="font-medium">Arquivo:</span> {photo.file_name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(photo)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(photo.file_path, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(photo.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" role="img" aria-label="Ícone fotos" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedParticipant !== 'all' 
                    ? 'Nenhuma foto encontrada' 
                    : 'Nenhuma foto ainda'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedParticipant !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Faça upload da primeira foto para este evento'
                  }
                </p>
                {!searchTerm && selectedParticipant === 'all' && (
                  <Button onClick={triggerFileInput}>
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Upload
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* Footer Stats */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total: {filteredPhotos.length} foto{filteredPhotos.length !== 1 ? 's' : ''}
              </span>
              <span>
                {filteredPhotos.length} de {mockPhotos.length} exibida{filteredPhotos.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}