'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEvents } from '@/hooks/useEvents'
import { useSchools } from '@/hooks/useSchools'
import type { Participant, ParticipantFormData } from '@/types/participants'

// Schema baseado no ParticipantFormData real
const participantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  event_id: z.string().min(1, 'Evento é obrigatório'),
  class: z.string().optional(),
  notes: z.string().optional()
})

interface ParticipantFormProps {
  participant?: Participant
  onSubmit: (data: ParticipantFormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function ParticipantForm({ participant, onSubmit, onCancel, loading }: ParticipantFormProps) {
  const { events } = useEvents()
  const { schools } = useSchools()
  
  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: '',
      event_id: '',
      class: '',
      notes: ''
    }
  })

  useEffect(() => {
    if (participant) {
      form.reset({
        name: participant.name,
        event_id: participant.event_id,
        class: participant.class || '',
        notes: participant.notes || ''
      })
    }
  }, [participant, form])

  const handleSubmit = async (data: ParticipantFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Participante *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Nome completo"
            className={form.formState.errors.name ? 'border-red-500' : ''}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_id">Evento *</Label>
          <Select
            value={form.watch('event_id')}
            onValueChange={(value) => form.setValue('event_id', value)}
          >
            <SelectTrigger className={form.formState.errors.event_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione um evento" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.event_id && (
            <p className="text-sm text-red-500">{form.formState.errors.event_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="class">Turma</Label>
        <Input
          id="class"
          {...form.register('class')}
          placeholder="Turma (ex: 3º ano A)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          {...form.register('notes')}
          placeholder="Observações sobre o participante"
          rows={3}
        />
      </div>

      {/* Informações do Evento Selecionado */}
      {form.watch('event_id') && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Informações do Evento</h4>
          {(() => {
            const selectedEvent = events.find(e => e.id === form.watch('event_id'))
            const selectedSchool = selectedEvent ? schools.find(s => s.id === selectedEvent.school_id) : null
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Evento:</span> {selectedEvent?.name}
                </div>
                <div>
                  <span className="font-medium">Escola:</span> {selectedSchool?.name}
                </div>
                {selectedEvent?.event_date && (
                  <div>
                    <span className="font-medium">Data:</span> {new Date(selectedEvent.event_date).toLocaleDateString('pt-BR')}
                  </div>
                )}
                {selectedSchool?.type && (
                  <div>
                    <span className="font-medium">Tipo:</span> {selectedSchool.type === 'publica' ? 'Pública' : 'Privada'}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (participant ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}