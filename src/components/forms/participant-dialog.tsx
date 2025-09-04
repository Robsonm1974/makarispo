'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit } from 'lucide-react'
import { ParticipantForm } from './participant-form'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'
// import type { EventWithSchool } from '@/types/events' // Removido - não utilizado

interface ParticipantDialogProps {
  participant?: ParticipantWithRelations
  onSubmit: (data: ParticipantFormData) => Promise<void>
  trigger?: React.ReactNode
  onClose?: () => void
  open?: boolean
  onDelete?: (id: string) => Promise<void>
}

export function ParticipantDialog({ 
  participant, 
  onSubmit, 
  trigger,
  onClose,
  open: externalOpen,
  onDelete 
}: ParticipantDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Se open é fornecido externamente, use-o; caso contrário, use estado interno
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOpen !== undefined ? (value: boolean) => {
    if (!value) onClose?.()
  } : setInternalOpen

  const handleSubmit = async (data: ParticipantFormData) => {
    try {
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {participant ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Novo Participante
              </>
            )}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {participant ? 'Editar Participante' : 'Novo Participante'}
          </DialogTitle>
        </DialogHeader>
        <ParticipantForm
          participant={participant}
          //events={events}
          //selectedEventId={selectedEventId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  )
}