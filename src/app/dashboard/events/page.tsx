'use client'

import { useState } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { EventsTable } from '@/components/tables/events-table'
import { EventDialog } from '@/components/forms/event-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { EventWithSchool } from '@/types/events'
import { toast } from 'sonner'

export default function EventsPage() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingEvent, setEditingEvent] = useState<EventWithSchool | null>(null)

  // Filtrar eventos por termo de busca
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.school?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Criar evento
  const handleCreateEvent = async (data: any) => {
    try {
      await createEvent(data)
      toast.success('Evento criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar evento. Tente novamente.')
      throw error
    }
  }

  // Atualizar evento
  const handleUpdateEvent = async (data: any) => {
    if (!editingEvent) return

    try {
      await updateEvent(editingEvent.id, data)
      setEditingEvent(null)
      toast.success('Evento atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar evento. Tente novamente.')
      throw error
    }
  }

  // Deletar evento
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id)
      toast.success('Evento deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar evento. Tente novamente.')
      throw error
    }
  }

  // Editar evento
  const handleEditEvent = (event: EventWithSchool) => {
    setEditingEvent(event)
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Erro ao carregar eventos: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie suas sessões fotográficas
          </p>
        </div>
        <EventDialog onSubmit={handleCreateEvent} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planejados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'planned').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EventsTable
            events={filteredEvents}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingEvent && (
        <EventDialog
          event={editingEvent}
          onSubmit={handleUpdateEvent}
          trigger={<div style={{ display: 'none' }} />}
        />
      )}
    </div>
  )
}