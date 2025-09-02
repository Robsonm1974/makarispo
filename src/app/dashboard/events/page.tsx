'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { EventDialog } from '@/components/forms/event-dialog'
import { SchoolDialog } from '@/components/forms/school-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import { useSchools } from '@/hooks/useSchools'
import { useParticipants } from '@/hooks/useParticipants'
import { 
  Calendar, 
  Building2, 
  Users, 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Search
} from 'lucide-react'
import { toast } from 'sonner'
import type { EventWithSchool, EventFormData, EventInsert } from '@/types/events'
import { createEventInsert } from '@/types/events'

interface EventStats {
  total: number
  withPhotos: number
}

export default function EventsPage() {
  const { user, tenant } = useAuth()
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents()
  const { schools } = useSchools()
  const { participants } = useParticipants()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventWithSchool | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showSchoolDialog, setShowSchoolDialog] = useState(false)

  // Filtrar eventos baseado no termo de busca
  const filteredEvents = events.filter(event => {
    const school = schools.find(s => s.id === event.school_id)
    const searchLower = searchTerm.toLowerCase()
    
    return (
      event.name.toLowerCase().includes(searchLower) ||
      (school?.name.toLowerCase().includes(searchLower)) ||
      event.status?.toLowerCase().includes(searchLower)
    )
  })

  // Calcular estatísticas para cada evento
  const getEventStats = (eventId: string): EventStats => {
    const eventParticipants = participants.filter(p => p.event_id === eventId)
    // Mock: assumir que 30% dos participantes têm fotos
    const withPhotos = Math.floor(eventParticipants.length * 0.3)
    
    return {
      total: eventParticipants.length,
      withPhotos
    }
  }

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      if (!user) {
        toast.error('Usuário não autenticado')
        return
      }

      // Converter EventFormData para EventInsert
      const eventInsert: EventInsert = createEventInsert(eventData, user.id)
      
      await createEvent(eventInsert)
      toast.success('Evento criado com sucesso!')
      setShowEventDialog(false)
    } catch (error) {
      toast.error('Erro ao criar evento')
      console.error('Create event error:', error)
    }
  }

  const handleUpdateEvent = async (eventData: EventFormData) => {
    try {
      if (!selectedEvent) return
      
      await updateEvent(selectedEvent.id, eventData)
      toast.success('Evento atualizado com sucesso!')
      setSelectedEvent(null)
      setShowEventDialog(false)
    } catch (error) {
      toast.error('Erro ao atualizar evento')
      console.error('Update event error:', error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await deleteEvent(eventId)
        toast.success('Evento excluído com sucesso!')
      } catch (error) {
        toast.error('Erro ao excluir evento')
        console.error('Delete event error:', error)
      }
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não definida'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!user || !tenant) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h1 className="loading-text">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content-compact">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-description">Carregando eventos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-content-compact">
          <div className="error-container">
            <h2 className="error-title">Erro ao carregar eventos</h2>
            <p className="error-description">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-content-compact">
        {/* Header */}
        <div className="page-header-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="page-header">Eventos</h1>
              <p className="page-description">
                Gerencie todos os seus eventos fotográficos
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSchoolDialog(true)}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Nova Escola
              </Button>
              <EventDialog
                onSubmit={handleCreateEvent}
                trigger={
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Evento
                  </Button>
                }
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar eventos por nome, escola ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search input-default input-focus"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const stats = getEventStats(event.id)
              return (
                <Card key={event.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-1">
                          {event.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event.school.name}</span>
                          <Badge variant={event.school.type === 'publica' ? 'default' : 'secondary'}>
                            {event.school.type}
                          </Badge>
                        </div>
                        {event.status && (
                          <Badge
                            variant={
                              event.status === 'active' ? 'default' :
                              event.status === 'completed' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {event.status === 'active' ? 'Ativo' :
                             event.status === 'completed' ? 'Concluído' : 'Planejado'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="content-spacing-lg">
                    {/* Event Dates */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.event_date)}</span>
                      {event.event_end_date && event.event_end_date !== event.event_date && (
                        <>
                          <span>até</span>
                          <span>{formatDate(event.event_end_date)}</span>
                        </>
                      )}
                    </div>

                    {/* Event Notes */}
                    {event.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        {event.notes}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">Participantes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{stats.withPhotos}</div>
                        <div className="text-xs text-muted-foreground">Com Fotos</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Navegar para participantes do evento
                          window.location.href = `/dashboard/participants?event=${event.id}`
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Participantes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Navegar para fotos do evento
                          window.location.href = `/dashboard/photos?event=${event.id}`
                        }}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Fotos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full">
              <Card className="empty-state">
                <Calendar className="empty-state-icon" />
                <h3 className="empty-state-title">
                  {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento ainda'}
                </h3>
                <p className="empty-state-description">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca'
                    : 'Crie seu primeiro evento para começar'
                  }
                </p>
                {!searchTerm && (
                  <EventDialog
                    onSubmit={handleCreateEvent}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Evento
                      </Button>
                    }
                  />
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Event Dialog */}
      {showEventDialog && (
        <EventDialog
          event={selectedEvent || undefined}
          onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        />
      )}

            {/* School Dialog */}
            {showSchoolDialog && (
        <SchoolDialog
          onSubmit={async () => {
            setShowSchoolDialog(false)
            toast.success('Escola criada com sucesso!')
          }}
        />
      )}
    </div>
  )
}