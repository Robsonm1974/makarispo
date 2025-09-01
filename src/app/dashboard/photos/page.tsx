'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Upload, Download, Eye, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import { useParticipants } from '@/hooks/useParticipants'
import { useSchools } from '@/hooks/useSchools'

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
    class: string | null
    event: {
      name: string
      school: {
        name: string
        type: string
      }
    }
  }
}

export default function PhotosPage() {
  const { user, tenant } = useAuth()
  const { events } = useEvents()
  const { participants } = useParticipants()
  const { schools } = useSchools()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<string>('all')
  const [uploading, setUploading] = useState(false)

  // Mock data para fotos (será substituído pelo hook real)
  const mockPhotos: Photo[] = participants.map(participant => {
    const event = events.find(e => e.id === participant.event_id)
    const school = event ? schools.find(s => s.id === event.school_id) : null
    
    return {
      id: `photo-${participant.id}`,
      participant_id: participant.id,
      file_path: `/mock/photos/${participant.id}.jpg`,
      file_name: `${participant.name}.jpg`,
      file_size: 2048576, // 2MB
      mime_type: 'image/jpeg',
      uploaded_at: new Date().toISOString(),
      participant: {
        name: participant.name,
        class: participant.class,
        event: {
          name: event?.name || 'Evento não encontrado',
          school: {
            name: school?.name || 'Escola não encontrada',
            type: school?.type || 'tipo_desconhecido'
          }
        }
      }
    }
  })

  const filteredPhotos = mockPhotos.filter(photo => {
    const matchesSearch = 
      photo.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.participant.event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.participant.event.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.participant.class && photo.participant.class.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesEvent = selectedEvent === 'all' || photo.participant.event.name === selectedEvent
    const matchesSchool = selectedSchool === 'all' || photo.participant.event.school.name === selectedSchool

    return matchesSearch && matchesEvent && matchesSchool
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

  if (!user || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
        </div>
      </div>
    )
  }

  const uniqueEvents = Array.from(new Set(events.map(e => e.name)))
  const uniqueSchools = Array.from(new Set(schools.map(s => s.name)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Fotos</h1>
          <p className="text-gray-600 mt-2">
            Upload, organização e visualização de fotos dos participantes
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Fotos
            </CardTitle>
            <CardDescription>
              Faça upload de fotos em lote ou individualmente
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

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <Input
              placeholder="Nome, evento, escola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evento
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Eventos</option>
              {uniqueEvents.map(eventName => (
                <option key={eventName} value={eventName}>
                  {eventName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escola
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Escolas</option>
              {uniqueSchools.map(schoolName => (
                <option key={schoolName} value={schoolName}>
                  {schoolName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedEvent('all')
                setSelectedSchool('all')
              }}
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative group">
                <img
                  src={photo.file_path}
                  alt={`Foto de ${photo.participant.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback para imagem não encontrada
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMC40NTcgMTIwIDExOSAxMTEuNDU3IDExOSAxMDFDMTE5IDkwLjU0MzQgMTEwLjQ1NyA4MiAxMDAgODJDODkuNTQzNCA4MiA4MSA5MC41NDM0IDgxIDEwMUM4MSAxMTEuNDU3IDg5LjU0MzQgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDAgMTQwQzExMC40NTcgMTQwIDExOSAxMzEuNDU3IDExOSAxMjFDMTE5IDExMC41NDMgMTEwLjQ1NyAxMDIgMTAwIDEwMkM4OS41NDM0IDEwMiA4MSAxMTAuNTQzIDgxIDEyMUM4MSAxMzEuNDU3IDg5LjU0MzQgMTQwIDEwMCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='
                  }}
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
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {photo.participant.name}
                  </h3>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="truncate">
                      <span className="font-medium">Evento:</span> {photo.participant.event.name}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">Escola:</span> {photo.participant.event.school.name}
                    </p>
                    {photo.participant.class && (
                      <p className="truncate">
                        <span className="font-medium">Turma:</span> {photo.participant.class}
                      </p>
                    )}
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

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <Card className="text-center py-12">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedEvent !== 'all' || selectedSchool !== 'all' 
                ? 'Nenhuma foto encontrada' 
                : 'Nenhuma foto ainda'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedEvent !== 'all' || selectedSchool !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Faça upload da primeira foto para começar'
              }
            </p>
            {!searchTerm && selectedEvent === 'all' && selectedSchool === 'all' && (
              <Button onClick={triggerFileInput}>
                <Upload className="mr-2 h-4 w-4" />
                Fazer Upload
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}