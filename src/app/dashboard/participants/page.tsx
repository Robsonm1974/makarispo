'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useParticipants } from '@/hooks/useParticipants'
import { useEvents } from '@/hooks/useEvents'
import { useSchools } from '@/hooks/useSchools'
import { 
  Users, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

export default function ParticipantsPage() {
  const { user, tenant } = useAuth()
  const { participants, loading, error, createParticipant, updateParticipant, deleteParticipant } = useParticipants()
  const { events } = useEvents()
  const { schools } = useSchools()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [showDialog, setShowDialog] = useState(false)

  // Filtrar participantes baseado no termo de busca
  const filteredParticipants = participants.filter(participant => {
    const event = events.find(e => e.id === participant.event_id)
    const school = event ? schools.find(s => s.id === event.school_id) : null
    const searchLower = searchTerm.toLowerCase()
    
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.class?.toLowerCase().includes(searchLower) ||
      (event?.name.toLowerCase().includes(searchLower)) ||
      (school?.name.toLowerCase().includes(searchLower))
    )
  })

  const handleCreateParticipant = async (participantData: any) => {
    try {
      await createParticipant(participantData)
      toast.success('Participante criado com sucesso!')
      setShowDialog(false)
    } catch (error) {
      toast.error('Erro ao criar participante')
      console.error('Create participant error:', error)
    }
  }

  const handleUpdateParticipant = async (participantData: any) => {
    try {
      await updateParticipant(selectedParticipant.id, participantData)
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
                Gerencie todos os participantes dos seus eventos
              </p>
            </div>
            <ParticipantDialog
              onSubmit={handleCreateParticipant}
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Participante
                </Button>
              }
            />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar participantes por nome, turma, evento ou escola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search input-default input-focus"
            />
          </div>
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => {
              const event = events.find(e => e.id === participant.event_id)
              const school = event ? schools.find(s => s.id === event.school_id) : null
              
              return (
                <Card key={participant.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-1">
                          {participant.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event?.name || 'Evento não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{school?.name || 'Escola não encontrada'}</span>
                          <Badge variant="secondary">{school?.type || 'tipo_desconhecido'}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedParticipant(participant)}
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
                    {/* Participant Details */}
                    <div className="content-spacing">
                      {participant.class && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Turma: {participant.class}</span>
                        </div>
                      )}
                      {participant.email && (
                        <div className="text-sm text-muted-foreground">
                          📧 {participant.email}
                        </div>
                      )}
                      {participant.phone && (
                        <div className="text-sm text-muted-foreground">
                          📞 {participant.phone}
                        </div>
                      )}
                      {participant.notes && (
                        <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          {participant.notes}
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    {participant.qr_code && (
                      <div className="text-center pt-4 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">Código QR</div>
                        <div className="font-mono text-sm bg-muted/50 p-2 rounded">
                          {participant.qr_code}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
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
                    : 'Cadastre participantes para seus eventos'
                  }
                </p>
                {!searchTerm && (
                  <ParticipantDialog
                    onSubmit={handleCreateParticipant}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Participante
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
          participant={selectedParticipant}
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