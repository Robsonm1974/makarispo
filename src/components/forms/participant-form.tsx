'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

interface ParticipantFormProps {
  participant?: ParticipantWithRelations
  onSubmit: (data: ParticipantFormData) => Promise<void>
  onCancel?: () => void
  onDelete?: (id: string) => Promise<void>
}

export function ParticipantForm({ participant, onSubmit, onCancel, onDelete }: ParticipantFormProps) {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    turma: '',
    tipo: 'aluno',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        turma: participant.turma || '',
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

  const handleDelete = async () => {
    if (!participant?.id || !onDelete) return
    
    setDeleting(true)
    try {
      await onDelete(participant.id)
    } catch (error) {
      console.error('Erro ao excluir participante:', error)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
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
          <Label htmlFor="turma">Turma</Label>
          <Input
            id="turma"
            value={formData.turma || ''}
            onChange={(e) => handleChange('turma', e.target.value)}
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
      <div className="flex gap-3 justify-between">
        {/* Botão Excluir (apenas em edição) */}
        <div>
          {participant && onDelete && (
            <>
              {!showDeleteConfirm ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading || deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Participante
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading || deleting}
                    size="sm"
                  >
                    {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading || deleting}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Botões principais */}
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading || deleting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={loading || deleting}>
            {loading ? 'Salvando...' : participant ? 'Atualizar Participante' : 'Criar Participante'}
          </Button>
        </div>
      </div>
    </form>
  )
}