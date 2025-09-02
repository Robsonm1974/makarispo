'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit } from 'lucide-react'
import { ParticipantForm } from './participant-form'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'
//import type { Event } from '@/types/events'
import type { EventWithSchool } from '@/types/events'

interface ParticipantDialogProps {
  participant?: ParticipantWithRelations
  onSubmit: (data: ParticipantFormData) => Promise<void>
  trigger?: React.ReactNode
  onClose?: () => void
}

export function ParticipantDialog({ 
  participant, 
  onSubmit, 
  trigger,
  onClose 
}: ParticipantDialogProps) {
  const [open, setOpen] = useState(false)

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
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
        )}
      </DialogTrigger>
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
        />
      </DialogContent>
    </Dialog>
  )
}