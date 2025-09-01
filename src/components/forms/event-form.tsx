'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSchools } from '@/hooks/useSchools'
import type { Event, EventFormData } from '@/types/events'

interface EventFormProps {
  event?: Event
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function EventForm({ event, onSubmit, onCancel, loading }: EventFormProps) {
  const { schools } = useSchools()
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    school_id: '',
    event_date: '',
    event_end_date: '',
    commission_percent: 0,
    notes: '',
    status: 'planned',
    products_enabled: []
  })

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        school_id: event.school_id,
        event_date: event.event_date || '',
        event_end_date: event.event_end_date || '',
        commission_percent: event.commission_percent || 0,
        notes: event.notes || '',
        status: (event.status as 'planned' | 'active' | 'completed') || 'planned',
        products_enabled: event.products_enabled || []
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: keyof EventFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Evento *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nome do evento"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school_id">Escola *</Label>
          <Select
            value={formData.school_id}
            onValueChange={(value) => handleChange('school_id', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma escola" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Data de Início</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => handleChange('event_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_end_date">Data de Término</Label>
          <Input
            id="event_end_date"
            type="date"
            value={formData.event_end_date}
            onChange={(e) => handleChange('event_end_date', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="commission_percent">Comissão (%)</Label>
          <Input
            id="commission_percent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.commission_percent}
            onChange={(e) => handleChange('commission_percent', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planejado</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Observações sobre o evento"
          rows={3}
        />
      </div>

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
          {loading ? 'Salvando...' : (event ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}