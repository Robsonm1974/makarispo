'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Search } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/contexts/AuthContext'
import { EventsTable } from '@/components/tables/events-table'
import { EventDialog } from '@/components/forms/event-dialog'
import type { EventWithSchool, EventFormData, EventInsert } from '@/types/events'

export default function EventsPage() {
  const { user } = useAuth()
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingEvent, setEditingEvent] = useState<EventWithSchool | null>(null)

  // Criar evento
  const handleCreateEvent = async (data: EventFormData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      // Converter EventFormData para EventInsert adicionando tenant_id
      const eventData: EventInsert = {
        ...data,
        tenant_id: user.id,
        status: data.status || 'planned'
      }
      
      await createEvent(eventData)
      toast.success('Evento criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar evento. Tente novamente.')
      throw error
    }
  }

  // Atualizar evento
  const handleUpdateEvent = async (data: EventFormData) => {
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

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.school.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    {
      title: 'Total de Eventos',
      value: events.length,
      description: 'Eventos cadastrados'
    },
    {
      title: 'Eventos Ativos',
      value: events.filter(e => e.status === 'active').length,
      description: 'Em andamento'
    },
    {
      title: 'Eventos Concluídos',
      value: events.filter(e => e.status === 'completed').length,
      description: 'Finalizados'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Eventos</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <EventDialog onSubmit={handleCreateEvent} />
          </div>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Eventos</CardTitle>
              <CardDescription>
                Gerencie todos os eventos fotográficos das suas escolas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">Erro: {error}</p>
                </div>
              )}
              
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
      </div>
    </div>
  )
}