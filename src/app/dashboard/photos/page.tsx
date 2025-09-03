'use client'

import { useState, useCallback } from 'react'
import NextImage from 'next/image'
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
    turma: string | null
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
        turma: participant.turma,
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
      (photo.participant.turma && photo.participant.turma.toLowerCase().includes(searchTerm.toLowerCase()))

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

  const handleDelete = useCallback(async (_photoId: string) => {
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
      <div className="loading-container">
        <div className="loading-content">
          <h1 className="loading-text">Carregando...</h1>
        </div>
      </div>
    )
  }

  const uniqueEvents = Array.from(new Set(events.map(e => e.name)))
  const uniqueSchools = Array.from(new Set(schools.map(s => s.name)))

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header */}
        <div className="page-header-section">
          <h1 className="page-header">Gerenciar Fotos</h1>
          <p className="page-description">
            Upload, organização e visualização de fotos dos participantes
          </p>
        </div>

        {/* Upload Section */}
        <Card className="section-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="h-5 w-5 text-primary" />
              Upload de Fotos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Faça upload de fotos em lote ou individualmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="content-spacing-lg">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  disabled={uploading}
                  className="flex-1 input-default"
                />
                <Button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="btn-primary"
                >
                  {uploading ? 'Enviando...' : 'Selecionar Arquivos'}
                </Button>
              </div>
              
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <div className="loading-spinner h-4 w-4"></div>
                  Processando upload...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="grid-filters">
          <div>
            <label className="form-label">
              Buscar
            </label>
            <Input
              placeholder="Nome, evento, escola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-default"
            />
          </div>
          
          <div>
            <label className="form-label">
              Evento
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="select-default"
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
            <label className="form-label">
              Escola
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="select-default"
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
              className="w-full btn-outline"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid-photos">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden card-hover">
              <div className="aspect-square bg-muted relative group">
                <NextImage
                  src={photo.file_path}
                  alt={`Foto de ${photo.participant.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(photo)}
                      className="btn-secondary"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(photo.file_path, '_blank')}
                      className="btn-secondary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(photo.id)}
                      className="btn-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="content-spacing">
                  <h3 className="font-medium text-foreground truncate">
                    {photo.participant.name}
                  </h3>
                  
                  <div className="text-sm text-muted-foreground content-spacing">
                    <p className="truncate">
                      <span className="font-medium">Evento:</span> {photo.participant.event.name}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">Escola:</span> {photo.participant.event.school.name}
                    </p>
                    {photo.participant.turma && (
                      <p className="truncate">
                        <span className="font-medium">Turma:</span> {photo.participant.turma}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
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
          <Card className="empty-state">
            <Image className="empty-state-icon" />
            <h3 className="empty-state-title">
              {searchTerm || selectedEvent !== 'all' || selectedSchool !== 'all' 
                ? 'Nenhuma foto encontrada' 
                : 'Nenhuma foto ainda'
              }
            </h3>
            <p className="empty-state-description">
              {searchTerm || selectedEvent !== 'all' || selectedSchool !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Faça upload da primeira foto para começar'
              }
            </p>
            {!searchTerm && selectedEvent === 'all' && selectedSchool === 'all' && (
              <Button onClick={triggerFileInput} className="btn-primary">
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