'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useParticipants } from '@/hooks/useParticipants'
import { ParticipantDialog } from '@/components/forms/participant-dialog'
import { ParticipantImportDialog } from '@/components/forms/participant-import-dialog'
import { ParticipantExportButton } from '@/components/forms/participant-export-button'
import { ParticipantsTable } from '@/components/tables/participants-table'
import { Plus, Users, Upload, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useParticipantBatchPrint } from '@/hooks/useParticipantBatchPrint'
import type { ParticipantFormData, ParticipantWithRelations, ParticipantInsert } from '@/types/participants'

export default function ParticipantsPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event')
  const [eventData, setEventData] = useState<{ tenant_id: string; school_id: string } | null>(null)
  const { user } = useAuth()
  const { participants, loading, error, createParticipant, updateParticipant, deleteParticipant, refetch } = useParticipants(eventId)
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithRelations | null>(null)
  const { isPrinting, printAllQRCodes } = useParticipantBatchPrint()

  // Buscar dados do evento quando eventId mudar
  useEffect(() => {
    if (!eventId) return

    const fetchEventData = async () => {
      try {
        const { data, error: eventError } = await supabase
          .from('events')
          .select('tenant_id, school_id')
          .eq('id', eventId)
          .single()

        if (eventError) {
          console.error('Erro ao buscar evento:', eventError)
          toast.error('Erro ao buscar dados do evento')
          return
        }

        setEventData(data)
      } catch (error) {
        console.error('Erro ao buscar evento:', error)
        toast.error('Erro ao buscar dados do evento')
      }
    }

    fetchEventData()
  }, [eventId])

  const handleCreateParticipant = async (formData: ParticipantFormData) => {
    try {
      if (!user) {
        toast.error('Usuário não autenticado')
        return
      }

      // Buscar dados do evento para obter tenant_id e school_id
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('tenant_id, school_id')
        .eq('id', eventId)
        .single()

      if (eventError || !eventData) {
        console.error('Erro ao buscar evento:', eventError)
        toast.error('Erro ao buscar dados do evento')
        return
      }

      if (!eventId) {
        toast.error('ID do evento não encontrado')
        return
      }

      const participantData: ParticipantInsert = {
        tenant_id: eventData.tenant_id || user.id, // Usar user.id como fallback
        school_id: eventData.school_id,
        event_id: eventId,
        name: formData.name,
        turma: formData.turma || null,
        tipo: formData.tipo || 'aluno',
        notes: formData.notes || null
        // qr_code será gerado automaticamente pelo trigger
      }

      console.log('Criando participante com dados completos:', participantData)
      await createParticipant(participantData)
      toast.success('Participante criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar participante:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar participante'
      toast.error(`Erro ao criar participante: ${errorMessage}`)
      throw error
    }
  }

  const handleUpdateParticipant = async (formData: ParticipantFormData) => {
    if (!editingParticipant) return
    
    try {
      const updates: Partial<ParticipantInsert> = {
        name: formData.name,
        turma: formData.turma || null,
        tipo: formData.tipo || 'aluno',
        notes: formData.notes || null
        // qr_code não pode ser atualizado manualmente
      }

      await updateParticipant(editingParticipant.id, updates)
      setEditingParticipant(null)
      toast.success('Participante atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar participante:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar participante'
      toast.error(`Erro ao atualizar participante: ${errorMessage}`)
      throw error
    }
  }

  const handleDeleteParticipant = async (id: string) => {
    try {
      await deleteParticipant(id)
      // Fechar o dialog após exclusão bem-sucedida
      setEditingParticipant(null)
      toast.success('Participante excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir participante:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao excluir participante'
      toast.error(`Erro ao excluir participante: ${errorMessage}`)
      throw error
    }
  }

  const openEditDialog = (participant: ParticipantWithRelations) => {
    setEditingParticipant(participant)
  }

  const closeDialog = () => {
    setEditingParticipant(null)
  }

  const handleSubmit = async (formData: ParticipantFormData) => {
    if (editingParticipant) {
      await handleUpdateParticipant(formData)
    } else {
      await handleCreateParticipant(formData)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando participantes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar participantes: {error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Participantes</h1>
          <p className="text-muted-foreground">
            Gerencie os participantes do evento
            {!eventId && ' (selecione um evento)'}
          </p>
        </div>
        <div className="flex gap-2">
          {eventId && eventData && user && (
            <>
              <Button
                variant="outline"
                onClick={() => printAllQRCodes(participants)}
                disabled={loading || participants.length === 0 || isPrinting}
                title="Imprimir todos os QR Codes em folha A4"
              >
                {isPrinting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Imprimindo...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir QR Codes
                  </>
                )}
              </Button>
              <ParticipantExportButton
                participants={participants}
                disabled={loading || participants.length === 0}
              />
              <ParticipantImportDialog
                eventId={eventId}
                tenantId={eventData.tenant_id || user.id}
                schoolId={eventData.school_id}
                onImportComplete={refetch}
                trigger={
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Lista
                  </Button>
                }
              />
            </>
          )}
          <ParticipantDialog
            onSubmit={handleSubmit}
            onClose={closeDialog}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Participante
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{participants.length}</div>
            <p className="text-xs text-muted-foreground">
              Participantes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <Badge variant="secondary">Alunos</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {participants.filter(p => p.tipo === 'aluno').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Participantes do tipo aluno
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <Badge variant="outline">Funcionários</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {participants.filter(p => p.tipo !== 'aluno').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Professores e funcionários
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Participantes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os participantes do evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipantsTable
            participants={participants}
            onEdit={openEditDialog}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <ParticipantDialog
        participant={editingParticipant}
        open={!!editingParticipant}
        onSubmit={handleSubmit}
        onClose={closeDialog}
        onDelete={editingParticipant ? handleDeleteParticipant : undefined}
      />
    </div>
  )
}