'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { EventForm } from './event-form'
import type { Event, EventFormData } from '@/types/events'

interface EventDialogProps {
  event?: Event
  onSubmit: (data: EventFormData) => Promise<void>
  trigger?: React.ReactNode
}

export function EventDialog({ event, onSubmit, trigger }: EventDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: EventFormData) => {
    setLoading(true)
    try {
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error('Error submitting event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {event ? 'Editar Evento' : 'Novo Evento'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          event={event}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}