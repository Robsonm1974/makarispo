'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Camera, Image } from 'lucide-react'
import { useParticipantPhotos } from '@/hooks/useParticipantPhotos'
import { toast } from 'sonner'
import type { ParticipantWithRelations, ParticipantFormData } from '@/types/participants'

// Componente para exibir fotos do participante
function ParticipantPhotosSection({ participantId }: { participantId: string }) {
  const { photos, loading } = useParticipantPhotos(participantId)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando fotos...</span>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">Nenhuma foto encontrada</p>
        <p className="text-xs text-gray-500">Use o botão de fotos na tabela para adicionar</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{photos.length} foto(s)</span>
        <Badge variant="outline" className="text-xs">
          <Image className="h-3 w-3 mr-1" />
          Fotos
        </Badge>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {photos.slice(0, 12).map((photo) => (
          <div key={photo.id} className="relative aspect-square">
            <img
              src={photo.photo_url}
              alt={photo.original_filename || 'Foto'}
              className="w-full h-full object-cover rounded border hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => window.open(photo.photo_url, '_blank')}
              title={photo.original_filename || 'Clique para abrir'}
            />
          </div>
        ))}
        
        {photos.length > 12 && (
          <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-600">+{photos.length - 12}</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Use o botão <Camera className="inline h-3 w-3" /> na tabela para gerenciar fotos
      </p>
    </div>
  )
}

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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
      // Mostrar toast de sucesso após salvar
      if (participant) {
        toast.success('Participante atualizado com sucesso!')
      } else {
        toast.success('Participante criado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar participante:', error)
      toast.error('Erro ao salvar participante')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!participant?.id || !onDelete) return
    
    setDeleting(true)
    try {
      await onDelete(participant.id)
      setShowDeleteDialog(false)
      toast.success('Participante excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir participante:', error)
      toast.error('Erro ao excluir participante')
    } finally {
      setDeleting(false)
    }
  }

  const handleChange = (field: keyof ParticipantFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
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

        {/* Seção de Fotos (apenas em edição) */}
        {participant && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Fotos do Participante</Label>
            <ParticipantPhotosSection participantId={participant.id} />
          </div>
        )}

        {/* Informação sobre QR Code */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>QR Code:</strong> Será gerado automaticamente quando o participante for criado.
          </p>
        </div>

        {/* Botões Padronizados */}
        <div className="flex justify-between items-center pt-4 border-t">
          {/* Botão Excluir (apenas em edição) */}
          {participant && onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="default"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading || deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              EXCLUIR
            </Button>
          )}

          {/* Espaçador quando não há botão excluir */}
          {(!participant || !onDelete) && <div />}
          
          {/* Botão Atualizar/Criar */}
          <Button 
            type="submit" 
            size="default"
            disabled={loading || deleting}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {participant ? 'ATUALIZANDO...' : 'CRIANDO...'}
              </>
            ) : (
              participant ? 'ATUALIZAR' : 'CRIAR PARTICIPANTE'
            )}
          </Button>
        </div>
      </form>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o participante <strong>"{participant?.name}"</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Excluindo...
                </>
              ) : (
                'CONFIRMAR EXCLUSÃO'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}