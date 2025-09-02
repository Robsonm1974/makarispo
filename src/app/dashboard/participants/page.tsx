'use client'

import { useState, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useParticipants } from '@/hooks/useParticipants'
import { useEvents } from '@/hooks/useEvents'
import { 
  Users, 
  User, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Calendar,
  Building2
} from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import type { ParticipantWithRelations, ParticipantFormData, ParticipantInsert } from '@/types/participants'

function ParticipantsContent() {
  const { user, tenant } = useAuth()
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get('event')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEventId, setSelectedEventId] = useState<string>(eventIdFromUrl || 'all')
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithRelations | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  // Buscar eventos
  const { events } = useEvents()
  
  // Usar hook com filtro por evento
  const { participants, loading, error, createParticipant, updateParticipant, deleteParticipant } = useParticipants(
    selectedEventId !== 'all' ? selectedEventId : undefined
  )

  // Filtrar participantes baseado no termo de busca (apenas por nome e turma)
  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchTerm.toLowerCase()
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.class?.toLowerCase().includes(searchLower)
    )
  })

  // Função para converter ParticipantFormData para ParticipantInsert
  const createParticipantInsert = (formData: ParticipantFormData): ParticipantInsert => {
    return {
      event_id: selectedEventId !== 'all' ? selectedEventId : '',
      name: formData.name,
      class: formData.class || null,
      qr_code: '', // Será gerado pelo Supabase
      notes: formData.notes || null
    }
  }

  const handleCreateParticipant = async (participantData: ParticipantFormData) => {
    try {
      if (!user) {
        toast.error('Usuário não autenticado')
        return
      }

      if (selectedEventId === 'all') {
        toast.error('Selecione um evento primeiro')
        return
      }

      // Converter ParticipantFormData para ParticipantInsert
      const participantInsert: ParticipantInsert = createParticipantInsert(participantData)
      
      await createParticipant(participantInsert)
      toast.success('Participante criado com sucesso!')
      setShowDialog(false)
    } catch (error) {
      toast.error('Erro ao criar participante')
      console.error('Create participant error:', error)
    }
  }

  const handleUpdateParticipant = async (participantData: ParticipantFormData) => {
    try {
      if (!selectedParticipant) return
      
      await updateParticipant(selectedParticipant.id, {
        name: participantData.name,
        class: participantData.class || null,
        notes: participantData.notes || null
      })
      toast.success('Participante atualizado com sucesso!')
      setSelectedParticipant(null)
      setShowDialog(false)
    } catch (error) {
      toast.error('Erro ao atualizar participante')
      console.error('Update participant error:', error)
    }
  }

  const handleDeleteParticipant = async (participantId: string) => {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
      try {
        await deleteParticipant(participantId)
        toast.success('Participante excluído com sucesso!')
      } catch (error) {
        toast.error('Erro ao excluir participante')
        console.error('Delete participant error:', error)
      }
    }
  }

  // Encontrar o evento selecionado para exibir informações
  const selectedEvent = events.find(event => event.id === selectedEventId)

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
            <p className="loading-description">Carregando participantes...</p>
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
            <h2 className="error-title">Erro ao carregar participantes</h2>
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
              <h1 className="page-header">Participantes</h1>
              <p className="page-description">
                Gerencie os participantes dos seus eventos
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard/events'}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Ver Eventos
              </Button>
              {selectedEventId !== 'all' && (
                <ParticipantDialog
                  onSubmit={handleCreateParticipant}
                  trigger={
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Participante
                    </Button>
                  }
                />
              )}
            </div>
          </div>

          {/* Event Selection or Event Info */}
          <div className="mb-4">
            {eventIdFromUrl ? (
              // Quando acessado via URL com event ID - mostrar apenas informações do evento
              selectedEvent && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedEvent.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedEvent.school.name}</span>
                        <Badge variant={selectedEvent.school.type === 'publica' ? 'default' : 'secondary'} className="text-xs">
                          {selectedEvent.school.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // Quando acessado via "Ver Participantes" - mostrar lista de seleção
              <>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Selecionar Evento
                </label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Selecione um evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Eventos Disponíveis</SelectLabel>
                      <SelectItem value="all">Todos os eventos</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name} - {event.school.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar participantes por nome ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search input-default input-focus"
            />
          </div>
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <Card key={participant.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground mb-1">
                        {participant.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{participant.event.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{participant.event.school.name}</span>
                        <Badge variant={participant.event.school.type === 'publica' ? 'default' : 'secondary'}>
                          {participant.event.school.type}
                        </Badge>
                      </div>
                      {participant.class && (
                        <Badge variant="outline" className="text-xs">
                          Turma: {participant.class}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedParticipant(participant)
                          setShowDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="content-spacing-lg">
                  {/* QR Code */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">
                      QR: {participant.qr_code}
                    </span>
                  </div>

                  {/* Notes */}
                  {participant.notes && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {participant.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Navegar para fotos do participante
                        window.location.href = `/dashboard/photos?participant=${participant.id}`
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Ver Fotos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Imprimir QR code
                        window.open(`/api/qr/${participant.qr_code}`, '_blank')
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Imprimir QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="empty-state">
                <Users className="empty-state-icon" />
                <h3 className="empty-state-title">
                  {searchTerm ? 'Nenhum participante encontrado' : 'Nenhum participante ainda'}
                </h3>
                <p className="empty-state-description">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca'
                    : selectedEventId === 'all'
                    ? 'Selecione um evento para ver os participantes'
                    : 'Adicione participantes ao evento selecionado'
                  }
                </p>
                {!searchTerm && selectedEventId !== 'all' && (
                  <ParticipantDialog
                    onSubmit={handleCreateParticipant}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Participante
                      </Button>
                    }
                  />
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Participant Dialog */}
      {showDialog && (
        <ParticipantDialog
          participant={selectedParticipant || undefined}
          onSubmit={selectedParticipant ? handleUpdateParticipant : handleCreateParticipant}
          onClose={() => {
            setShowDialog(false)
            setSelectedParticipant(null)
          }}
        />
      )}
    </div>
  )
}

export default function ParticipantsPage() {
  return (
    <Suspense fallback={
      <div className="page-container">
        <div className="page-content-compact">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-description">Carregando...</p>
          </div>
        </div>
      </div>
    }>
      <ParticipantsContent />
    </Suspense>
  )
}