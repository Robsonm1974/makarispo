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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EventDialog({ event, onSubmit, trigger, open, onOpenChange }: EventDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Usar estado controlado se fornecido, senão usar interno
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const handleSubmit = async (data: EventFormData) => {
    try {
      await onSubmit(data)
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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