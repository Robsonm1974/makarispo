'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

interface ParticipantFormProps {
  participant?: ParticipantWithRelations
  onSubmit: (data: ParticipantFormData) => Promise<void>
  onCancel?: () => void
}

export function ParticipantForm({ participant, onSubmit, onCancel }: ParticipantFormProps) {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    class: '',
    qr_code: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        class: participant.class || '',
        qr_code: participant.qr_code || '',
        notes: participant.notes || ''
      })
    }
  }, [participant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ParticipantFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Participante */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Nome do Participante *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        {/* Turma */}
        <div>
          <Label htmlFor="class">Turma</Label>
          <Input
            id="class"
            value={formData.class || ''}
            onChange={(e) => handleChange('class', e.target.value)}
            placeholder="Ex: 3º A, 2º B"
          />
        </div>

        {/* QR Code */}
        <div>
          <Label htmlFor="qr_code">QR Code *</Label>
          <Input
            id="qr_code"
            value={formData.qr_code}
            onChange={(e) => handleChange('qr_code', e.target.value)}
            placeholder="Código QR único"
            required
          />
        </div>
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informações adicionais sobre o participante"
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
          {loading ? 'Salvando...' : participant ? 'Atualizar Participante' : 'Criar Participante'}
        </Button>
      </div>
    </form>
  )
}