'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Search } from 'lucide-react'
import { useParticipants } from '@/hooks/useParticipants'
import { useAuth } from '@/contexts/AuthContext'
import { ParticipantsTable } from '@/components/tables/participants-table'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import type { ParticipantWithRelations, ParticipantFormData, ParticipantInsert } from '@/types/participants'

export default function ParticipantsPage() {
  const { user } = useAuth()
  const { participants, loading, error, createParticipant, updateParticipant, deleteParticipant } = useParticipants()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithRelations | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (participant.class && participant.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (participant.qr_code && participant.qr_code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateParticipant = async (data: ParticipantFormData) => {
    if (!user) {
      console.error('Usuário não autenticado')
      return
    }

    try {
      // Converter ParticipantFormData para ParticipantInsert
      const participantData: ParticipantInsert = {
        ...data,
        qr_code: generateQRCode(), // Função para gerar QR code único
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await createParticipant(participantData)
    } catch (error) {
      console.error('Erro ao criar participante:', error)
      throw error
    }
  }

  const handleUpdateParticipant = async (data: ParticipantFormData) => {
    if (!editingParticipant) return

    try {
      await updateParticipant(editingParticipant.id, data)
      setEditingParticipant(null)
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar participante:', error)
      throw error
    }
  }

  const handleDeleteParticipant = async (id: string) => {
    try {
      await deleteParticipant(id)
    } catch (error) {
      console.error('Erro ao deletar participante:', error)
      throw error
    }
  }

  const handleEditParticipant = (participant: ParticipantWithRelations) => {
    setEditingParticipant(participant)
    setEditDialogOpen(true)
  }

  // Função para gerar QR code único (7 dígitos)
  const generateQRCode = (): string => {
    const min = 1000000
    const max = 9999999
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
  }

  const stats = [
    {
      title: 'Total de Participantes',
      value: participants.length,
      description: 'Participantes cadastrados'
    },
    {
      title: 'Escolas',
      value: new Set(participants.map(p => p.school.name)).size,
      description: 'Escolas com participantes'
    },
    {
      title: 'Eventos',
      value: new Set(participants.map(p => p.event.name)).size,
      description: 'Eventos com participantes'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Participantes</h1>
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
                  <Users className="h-4 w-4 text-muted-foreground" />
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
                placeholder="Buscar participantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <ParticipantDialog onSubmit={handleCreateParticipant} />
          </div>

          {/* Participants Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Participantes</CardTitle>
              <CardDescription>
                Gerencie todos os participantes dos seus eventos fotográficos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">Erro: {error}</p>
                </div>
              )}
              
              <ParticipantsTable
                participants={filteredParticipants}
                onEdit={handleEditParticipant}
                onDelete={handleDeleteParticipant}
                loading={loading}
              />
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <ParticipantDialog
            participant={editingParticipant || undefined}
            onSubmit={handleUpdateParticipant}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            trigger={<div style={{ display: 'none' }} />}
          />
        </div>
      </div>
    </div>
  )
}