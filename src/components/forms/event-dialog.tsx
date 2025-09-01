'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit } from 'lucide-react'
import { EventForm } from './event-form'
import type { EventWithSchool, EventFormData } from '@/types/events'

interface EventDialogProps {
  event?: EventWithSchool
  onSubmit: (data: EventFormData) => Promise<void>
  trigger?: React.ReactNode
}

export function EventDialog({ event, onSubmit, trigger }: EventDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: EventFormData) => {
    try {
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
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
            {event ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          event={event}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}