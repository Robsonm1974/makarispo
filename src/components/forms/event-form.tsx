'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSchools } from '@/hooks/useSchools'
import type { EventWithSchool, EventFormData } from '@/types/events'

interface EventFormProps {
  event?: EventWithSchool
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel?: () => void
}

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const { schools } = useSchools()
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    school_id: '',
    event_date: undefined,
    event_end_date: undefined,
    commission_percent: undefined,
    notes: undefined,
    status: 'active',
    products_enabled: undefined
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        school_id: event.school_id || '',
        event_date: event.event_date || undefined,
        event_end_date: event.event_end_date || undefined,
        commission_percent: event.commission_percent || undefined,
        notes: event.notes || undefined,
        status: event.status || 'active',
        products_enabled: event.products_enabled || undefined
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EventFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Evento */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Nome do Evento *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome do evento"
            required
          />
        </div>

        {/* Escola */}
        <div className="md:col-span-2">
          <Label htmlFor="school_id">Escola *</Label>
          <Select
            value={formData.school_id}
            onValueChange={(value) => handleChange('school_id', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a escola" />
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

        {/* Data de Início */}
        <div>
          <Label htmlFor="event_date">Data de Início</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date || ''}
            onChange={(e) => handleChange('event_date', e.target.value || undefined)}
          />
        </div>

        {/* Data de Fim */}
        <div>
          <Label htmlFor="event_end_date">Data de Fim</Label>
          <Input
            id="event_end_date"
            type="date"
            value={formData.event_end_date || ''}
            onChange={(e) => handleChange('event_end_date', e.target.value || undefined)}
          />
        </div>

        {/* Percentual de Comissão */}
        <div>
          <Label htmlFor="commission_percent">Percentual de Comissão (%)</Label>
          <Input
            id="commission_percent"
            type="number"
            min="0"
            max="100"
            value={formData.commission_percent || ''}
            onChange={(e) => handleChange('commission_percent', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 15"
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="planned">Planejado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value || undefined)}
          placeholder="Informações adicionais sobre o evento"
          rows={3}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : event ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  )
}