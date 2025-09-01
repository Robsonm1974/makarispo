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
  onCancel: () => void
  loading: boolean
}

export function SchoolForm({ school, onSubmit, onCancel, loading }: SchoolFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    type: 'publica',
    address: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    notes: ''
  })

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name,
        type: school.type,
        address: school.address || '',
        contact_person: school.contact_person || '',
        contact_email: school.contact_email || '',
        contact_phone: school.contact_phone || '',
        notes: school.notes || ''
      })
    }
  }, [school])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: keyof SchoolFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Escola *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nome da escola"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publica">Pública</SelectItem>
              <SelectItem value="privada">Privada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Endereço completo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contato</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => handleChange('contact_person', e.target.value)}
            placeholder="Nome do contato"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Telefone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            placeholder="Telefone"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Email</Label>
        <Input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => handleChange('contact_email', e.target.value)}
          placeholder="Email de contato"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Observações sobre a escola"
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
          {loading ? 'Salvando...' : (school ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}