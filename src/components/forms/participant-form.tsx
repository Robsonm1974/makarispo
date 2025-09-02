'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    tipo: 'aluno',
    notes: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        class: participant.class || '',
        tipo: participant.tipo || 'aluno',
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

        {/* Tipo */}
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            value={formData.tipo || 'aluno'}
            onValueChange={(value) => handleChange('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluno">Aluno</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="funcionario">Funcionário</SelectItem>
              <SelectItem value="diretor">Diretor</SelectItem>
              <SelectItem value="coordenador">Coordenador</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
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
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informações adicionais sobre o participante"
          rows={3}
        />
      </div>

      {/* Informação sobre QR Code */}
      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>QR Code:</strong> Será gerado automaticamente quando o participante for criado.
        </p>
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