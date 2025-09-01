'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Search, Plus } from 'lucide-react'
import { useParticipants } from '@/hooks/useParticipants'
import { ParticipantsTable } from '@/components/tables/participants-table'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { createParticipantInsert } from '@/types/participants'
import { useAuth } from '@/contexts/AuthContext'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

// Type guard para verificar se tenant tem ID válido
function hasValidTenantId(tenant: unknown): tenant is { id: string } {
  return typeof tenant === 'object' && tenant !== null && 'id' in tenant && typeof (tenant as Record<string, unknown>).id === 'string'
}

export default function ParticipantsPage() {
  const { tenant } = useAuth()
  const { participants, loading, error, createParticipant, updateParticipant, deleteParticipant } = useParticipants()

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithRelations | null>(null)

  const filteredParticipants = participants.filter(participant =>
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
        const participantData = createParticipantInsert(data, 'temp-event-id', tenant.id)
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

  const handleDeleteParticipant = async (id: string) => {
    try {
      await deleteParticipant(id)
      toast.success('Participante deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar participante:', error)
      toast.error('Erro ao deletar participante')
    }
  }

  const handleEditParticipant = (participant: ParticipantWithRelations) => {
    setEditingParticipant(participant)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando participantes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar participantes</h2>
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
              <h1 className="text-3xl font-bold text-gray-900">Participantes</h1>
              <p className="text-gray-600 mt-2">
                Gerencie todos os participantes dos eventos
              </p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Participante
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar participantes por nome, turma ou QR code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Participants Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Participantes
            </CardTitle>
            <CardDescription>
              {filteredParticipants.length} participante(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipantsTable
              participants={filteredParticipants}
              onEdit={handleEditParticipant}
              onDelete={handleDeleteParticipant}
            />
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}