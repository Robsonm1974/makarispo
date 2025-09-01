'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { School, SchoolFormData } from '@/types/schools'

interface SchoolFormProps {
  school?: School
  onSubmit: (data: SchoolFormData) => Promise<void>
  onCancel?: () => void
}

export function SchoolForm({ school, onSubmit, onCancel }: SchoolFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    address: '',
    director_name: '',
    phone: '',
    email: '',
    type: 'publica',
    students_count: undefined,
    director_message: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        address: school.address || '',
        director_name: school.director_name || '',
        phone: school.phone || '',
        email: school.email || '',
        type: school.type || 'publica',
        students_count: school.students_count || undefined,
        director_message: school.director_message || '',
        notes: school.notes || ''
      })
    }
  }, [school])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar escola:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof SchoolFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome da Escola */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Nome da Escola *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Digite o nome da escola"
            required
          />
        </div>

        {/* Tipo de Escola */}
        <div>
          <Label htmlFor="type">Tipo de Escola</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value as 'publica' | 'privada')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publica">Pública</SelectItem>
              <SelectItem value="privada">Privada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Número de Estudantes */}
        <div>
          <Label htmlFor="students_count">Número de Estudantes</Label>
          <Input
            id="students_count"
            type="number"
            value={formData.students_count || ''}
            onChange={(e) => handleChange('students_count', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Ex: 500"
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Digite o endereço completo"
          />
        </div>

        {/* Nome do Diretor */}
        <div>
          <Label htmlFor="director_name">Nome do Diretor</Label>
          <Input
            id="director_name"
            value={formData.director_name || ''}
            onChange={(e) => handleChange('director_name', e.target.value)}
            placeholder="Nome do diretor"
          />
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="escola@exemplo.com"
          />
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug (URL amigável)</Label>
          <Input
            id="slug"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="nome-da-escola"
          />
        </div>
      </div>

      {/* Mensagem do Diretor */}
      <div>
        <Label htmlFor="director_message">Mensagem do Diretor</Label>
        <Textarea
          id="director_message"
          value={formData.director_message || ''}
          onChange={(e) => handleChange('director_message', e.target.value)}
          placeholder="Uma mensagem especial do diretor para os pais e alunos"
          rows={3}
        />
      </div>

      {/* Observações */}
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informações adicionais sobre a escola"
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
          {loading ? 'Salvando...' : school ? 'Atualizar Escola' : 'Criar Escola'}
        </Button>
      </div>
    </form>
  )
}