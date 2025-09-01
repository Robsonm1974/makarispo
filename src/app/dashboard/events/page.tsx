'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, Plus, Users, Image, Building2, Edit, Trash2 } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useSchools } from '@/hooks/useSchools'
import { useParticipants } from '@/hooks/useParticipants'
import { useAuth } from '@/contexts/AuthContext'
import { EventDialog } from '@/components/forms/event-dialog'
import { SchoolDialog } from '@/components/forms/school-dialog'
import ParticipantsModal from '@/components/modals/participants-modal'
import PhotosModal from '@/components/modals/photos-modal'
import { createEventInsert } from '@/types/events'
import type { EventWithSchool, EventFormData } from '@/types/events'

// Type guard para verificar se tenant tem ID válido
function hasValidTenantId(tenant: unknown): tenant is { id: string } {
  return typeof tenant === 'object' && tenant !== null && 'id' in tenant && typeof (tenant as Record<string, unknown>).id === 'string'
}

// Type guard para verificar se evento tem ID válido
function hasValidEventId(event: unknown): event is { id: string } {
  return typeof event === 'object' && event !== null && 'id' in event && typeof (event as Record<string, unknown>).id === 'string'
}

export default function EventsPage() {
  const { user, tenant } = useAuth()
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents()
  const { schools, refetch: refetchSchools } = useSchools()
  const { participants } = useParticipants()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventWithSchool | null>(null)
  const [showSchoolDialog, setShowSchoolDialog] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [showPhotosModal, setShowPhotosModal] = useState(false)

  const handleCreateEvent = async (data: EventFormData) => {
    if (!tenant) {
      toast.error('Tenant não encontrado')
      return
    }

    try {
      // Usar type guard para verificar tenant
      if (hasValidTenantId(tenant)) {
        const eventData = createEventInsert(data, tenant.id)
        await createEvent(eventData)
        toast.success('Evento criado com sucesso!')
      } else {
        toast.error('Tenant inválido')
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      toast.error('Erro ao criar evento')
    }
  }

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!tenant || !selectedEvent) {
      toast.error('Tenant ou evento não encontrado')
      return
    }

    try {
      // Usar type guard para verificar tenant
      if (hasValidTenantId(tenant)) {
        // Criar dados de atualização compatíveis com EventFormData
        const updateData: Partial<EventFormData> = {
          name: data.name,
          school_id: data.school_id,
          event_date: data.event_date,
          event_end_date: data.event_end_date,
          commission_percent: data.commission_percent,
          notes: data.notes,
          status: data.status,
          products_enabled: data.products_enabled
        }
        
        // Usar type guard para verificar evento
        if (hasValidEventId(selectedEvent)) {
          await updateEvent(selectedEvent.id, updateData)
          toast.success('Evento atualizado com sucesso!')
          setSelectedEvent(null)
        } else {
          toast.error('Evento inválido')
        }
      } else {
        toast.error('Tenant inválido')
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
      toast.error('Erro ao atualizar evento')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      toast.success('Evento deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      toast.error('Erro ao deletar evento')
    }
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.status && event.status.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getEventStats = (eventId: string) => {
    const eventParticipants = participants.filter(p => p.event_id === eventId)
    return {
      total: eventParticipants.length,
      withPhotos: 0 // TODO: Implementar contagem de fotos quando o sistema estiver completo
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar eventos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
              <p className="text-gray-600 mt-2">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar eventos por nome, escola ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const stats = getEventStats(event.id)
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {event.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{event.school.name}</span>
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      {event.event_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.event_date).toLocaleDateString('pt-BR')}
                            {event.event_end_date && (
                              <> - {new Date(event.event_end_date).toLocaleDateString('pt-BR')}</>
                            )}
                          </span>
                        </div>
                      )}

                      {event.commission_percent && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Comissão: {event.commission_percent}%</span>
                        </div>
                      )}

                      {event.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {event.notes}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
                        <div className="text-xs text-gray-600">Participantes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{stats.withPhotos}</div>
                        <div className="text-xs text-gray-600">Com Fotos</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                        onClick={() => {
                          setShowParticipantsModal(true)
                          setSelectedEvent(event)
                        }}
                      >
                        <Users className="h-4 w-4" />
                        Participantes
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                        onClick={() => {
                          setShowPhotosModal(true)
                          setSelectedEvent(event)
                        }}
                      >
                        <Image className="h-4 w-4" />
                        Fotos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            // Empty state
            <div className="col-span-full">
              <Card className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento ainda'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? 'Tente ajustar os termos de busca'
                    : 'Crie seu primeiro evento para começar a capturar fotos'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowSchoolDialog(true)}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Nova Escola
                  </Button>
                  <EventDialog
                    onSubmit={handleCreateEvent}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Evento
                      </Button>
                    }
                  />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedEvent && (
          <EventDialog
            event={selectedEvent}
            onSubmit={handleUpdateEvent}
            trigger={<div className="hidden" />}
          />
        )}

        {showSchoolDialog && (
          <SchoolDialog
            onSubmit={async () => {
              setShowSchoolDialog(false)
              await refetchSchools()
              toast.success('Escola criada com sucesso!')
            }}
            trigger={<div className="hidden" />}
          />
        )}

        {showParticipantsModal && selectedEvent && (
          <ParticipantsModal
            event={selectedEvent}
            onClose={() => setShowParticipantsModal(false)}
          />
        )}

        {showPhotosModal && selectedEvent && (
          <PhotosModal
            event={selectedEvent}
            onClose={() => setShowPhotosModal(false)}
          />
        )}
      </div>
    </div>
  )
}