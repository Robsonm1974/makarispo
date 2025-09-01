'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { ParticipantForm } from './participant-form'
import type { Participant, ParticipantFormData } from '@/types/participants'

interface ParticipantDialogProps {
  participant?: Participant
  onSubmit: (data: ParticipantFormData) => Promise<void>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ParticipantDialog({ 
  participant, 
  onSubmit, 
  trigger, 
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: ParticipantDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const handleSubmit = async (data: ParticipantFormData) => {
    setLoading(true)
    try {
      await onSubmit(data)
      if (setOpen) setOpen(false)
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (setOpen) setOpen(false)
  }

  // Se não há trigger e não é controlado, não renderiza o DialogTrigger
  if (!trigger && !isControlled) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
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
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}