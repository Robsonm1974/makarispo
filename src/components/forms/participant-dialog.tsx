'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit } from 'lucide-react'
import { ParticipantForm } from './participant-form'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

interface ParticipantDialogProps {
  participant?: ParticipantWithRelations
  onSubmit: (data: ParticipantFormData) => Promise<void>
  trigger?: React.ReactNode
}

export function ParticipantDialog({ participant, onSubmit, trigger }: ParticipantDialogProps) {
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
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}