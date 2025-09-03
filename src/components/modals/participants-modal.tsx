'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useParticipants } from '@/hooks/useParticipants'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { ParticipantsTable } from '@/components/tables/participants-table'
import { Users, Search, Download, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { ParticipantWithRelations, ParticipantFormData, ParticipantInsert } from '@/types/participants'
import type { EventWithSchool } from '@/types/events'

interface ParticipantsModalProps {
  event: EventWithSchool
  onClose: () => void
}

export function ParticipantsModal({ event, onClose }: ParticipantsModalProps) {
  const { participants, createParticipant, updateParticipant, deleteParticipant } = useParticipants(event.id)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithRelations | null>(null)

  // Filtrar participantes baseado no termo de busca
  const filteredParticipants = useMemo(() => {
    if (!searchTerm.trim()) return participants

    const term = searchTerm.toLowerCase()
    return participants.filter(participant =>
      participant.name.toLowerCase().includes(term) ||
      (participant.turma && participant.turma.toLowerCase().includes(term)) ||
      (participant.qr_code && participant.qr_code.toLowerCase().includes(term)) ||
      (participant.notes && participant.notes.toLowerCase().includes(term))
    )
  }, [participants, searchTerm])

  const handleCreateParticipant = async (data: ParticipantFormData) => {
    try {
      const participantData: ParticipantInsert = {
        event_id: event.id,
        name: data.name,
        turma: data.turma || null,
        tipo: data.tipo || 'aluno',
        qr_code: '', // Valor temporário - trigger irá substituir
        notes: data.notes || null
      }

      await createParticipant(participantData)
      toast.success('Participante criado com sucesso!')
      setShowAddDialog(false)
    } catch (error) {
      console.error('Erro ao criar participante:', error)
      toast.error('Erro ao criar participante')
    }
  }

  const handleUpdateParticipant = async (data: ParticipantFormData) => {
    if (!editingParticipant) return

    try {
      const updates: Partial<ParticipantInsert> = {
        name: data.name,
        turma: data.turma || null,
        tipo: data.tipo || 'aluno',
        notes: data.notes || null
        // qr_code não pode ser atualizado manualmente
      }

      await updateParticipant(editingParticipant.id, updates)
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
      ['Nome', 'Turma', 'Tipo', 'QR Code', 'Observações'],
      ...filteredParticipants.map(p => [
        p.name,
        p.turma || '',
        p.tipo || '',
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
                Adicionar Participante
              </Button>
            </div>
          </div>

          {/* Participants Table */}
          <div className="border rounded-lg">
            <ParticipantsTable
              participants={filteredParticipants}
              onEdit={(participant) => setEditingParticipant(participant)}
              onDelete={handleDeleteParticipant}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">{participants.length}</div>
              <div className="text-sm text-muted-foreground">Total de Participantes</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {participants.filter(p => p.tipo === 'aluno').length}
              </div>
              <div className="text-sm text-muted-foreground">Alunos</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {participants.filter(p => p.tipo !== 'aluno').length}
              </div>
              <div className="text-sm text-muted-foreground">Funcionários</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {filteredParticipants.length}
              </div>
              <div className="text-sm text-muted-foreground">Resultados da Busca</div>
            </div>
          </div>
        </div>

        {/* Add Participant Dialog */}
        {showAddDialog && (
          <ParticipantDialog
            onSubmit={handleCreateParticipant}
            onClose={() => setShowAddDialog(false)}
          />
        )}

        {/* Edit Participant Dialog */}
        {editingParticipant && (
          <ParticipantDialog
            participant={editingParticipant}
            onSubmit={handleUpdateParticipant}
            onClose={() => setEditingParticipant(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}