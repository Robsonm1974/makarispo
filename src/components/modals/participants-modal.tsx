'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, Search, Plus, Edit, Trash2, QrCode, Download } from 'lucide-react'
import { useParticipants } from '@/hooks/useParticipants'
import { useAuth } from '@/contexts/AuthContext'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { createParticipantInsert } from '@/types/participants'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'
import type { EventWithSchool } from '@/types/events'

// Type guard para verificar se tenant tem ID válido
function hasValidTenantId(tenant: unknown): tenant is { id: string } {
  return typeof tenant === 'object' && tenant !== null && 'id' in tenant && typeof (tenant as Record<string, unknown>).id === 'string'
}

interface ParticipantsModalProps {
  event: EventWithSchool
  onClose: () => void
}

export default function ParticipantsModal({ event, onClose }: ParticipantsModalProps) {
  const { tenant } = useAuth()
  const { participants, createParticipant, updateParticipant, deleteParticipant } = useParticipants()

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithRelations | null>(null)

  // Filtrar participantes do evento atual
  const eventParticipants = participants.filter(p => p.event_id === event.id)

  const filteredParticipants = eventParticipants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (participant.class && participant.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (participant.qr_code && participant.qr_code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateParticipant = async (data: ParticipantFormData) => {
    if (!tenant) {
      toast.error('Tenant não encontrado')
      return
    }

    try {
      // Usar type guard para verificar tenant
      if (hasValidTenantId(tenant)) {
        const participantData = createParticipantInsert(data, event.id, tenant.id)
        await createParticipant(participantData)
        toast.success('Participante criado com sucesso!')
        setShowAddDialog(false)
      } else {
        toast.error('Tenant inválido')
      }
    } catch (error) {
      console.error('Erro ao criar participante:', error)
      toast.error('Erro ao criar participante')
    }
  }

  const handleUpdateParticipant = async (data: ParticipantFormData) => {
    if (!editingParticipant) return

    try {
      await updateParticipant(editingParticipant.id, data)
      toast.success('Participante atualizado com sucesso!')
      setEditingParticipant(null)
    } catch (error) {
      console.error('Erro ao atualizar participante:', error)
      toast.error('Erro ao atualizar participante')
    }
  }

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      await deleteParticipant(participantId)
      toast.success('Participante deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar participante:', error)
      toast.error('Erro ao deletar participante')
    }
  }

  const exportParticipants = () => {
    const csvContent = [
      ['Nome', 'Turma', 'QR Code', 'Observações'],
      ...filteredParticipants.map(p => [
        p.name,
        p.class || '',
        p.qr_code || '',
        p.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `participantes-${event.name}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-6 w-6" />
            Participantes - {event.name}
            <Badge variant="outline" className="ml-2">
              {event.school.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar participantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportParticipants}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Participante
              </Button>
            </div>
          </div>

          {/* Participants List */}
          <div className="grid gap-4">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <Card key={participant.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{participant.name}</h3>
                          {participant.class && (
                            <Badge variant="secondary">{participant.class}</Badge>
                          )}
                          {participant.qr_code && (
                            <Badge variant="outline" className="font-mono">
                              <QrCode className="h-3 w-3 mr-1" />
                              {participant.qr_code}
                            </Badge>
                          )}
                        </div>
                        {participant.notes && (
                          <p className="text-sm text-gray-600">{participant.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingParticipant(participant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteParticipant(participant.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum participante encontrado' : 'Nenhum participante ainda'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? 'Tente ajustar os termos de busca'
                    : 'Adicione participantes para começar a capturar fotos'
                  }
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Participante
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Add/Edit Participant Dialog */}
        {showAddDialog && (
          <ParticipantDialog
            onSubmit={handleCreateParticipant}
            trigger={<div className="hidden" />}
          />
        )}

        {editingParticipant && (
          <ParticipantDialog
            participant={editingParticipant}
            onSubmit={handleUpdateParticipant}
            trigger={<div className="hidden" />}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}