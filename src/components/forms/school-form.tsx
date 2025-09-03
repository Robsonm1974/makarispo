'use client'

import { useState, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin, Phone, Users, Image as ImageIcon, FileText, X, User } from 'lucide-react'
import { schoolImageValidation } from '@/lib/school-storage'
import type { School, SchoolFormData } from '@/types/schools'

interface SchoolFormProps {
  school?: School
  onSubmit: (data: SchoolFormData) => Promise<void>
  onCancel?: () => void
}

export function SchoolForm({ school, onSubmit, onCancel }: SchoolFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    address: null,
    director_name: null,
    director_photo_file: null,
    phone: null,
    email: null,
    type: 'publica',
    students_count: null,
    school_photo_file: null,
    director_message: null,
    social_media: null,
    notes: null,
    slug: null,
    active: true
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewSchoolImage, setPreviewSchoolImage] = useState<string | null>(null)
  const [previewDirectorImage, setPreviewDirectorImage] = useState<string | null>(null)

  const schoolImageRef = useRef<HTMLInputElement>(null)
  const directorImageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name || '',
        address: school.address,
        director_name: school.director_name,
        director_photo_file: null,
        phone: school.phone,
        email: school.email,
        type: school.type || 'publica',
        students_count: school.students_count,
        school_photo_file: null,
        director_message: school.director_message,
        social_media: school.social_media,
        notes: school.notes,
        slug: school.slug,
        active: school.active
      })

      // Set preview images if they exist
      if (school.school_photo_url) {
        setPreviewSchoolImage(school.school_photo_url)
      }
      if (school.director_photo_url) {
        setPreviewDirectorImage(school.director_photo_url)
      }
    }
  }, [school])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validate required fields
      const newErrors: Record<string, string> = {}
      
      if (!formData.name.trim()) {
        newErrors.name = 'Nome da escola é obrigatório'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar escola:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof SchoolFormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleImageUpload = (field: 'school_photo_file' | 'director_photo_file', file: File) => {
    const validation = field === 'school_photo_file' 
      ? schoolImageValidation.validateSchoolImage(file)
      : schoolImageValidation.validateDirectorImage(file)

    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        [field]: validation.error || 'Erro na validação da imagem'
      }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      if (field === 'school_photo_file') {
        setPreviewSchoolImage(preview)
      } else {
        setPreviewDirectorImage(preview)
      }
    }
    reader.readAsDataURL(file)

    // Update form data
    handleChange(field, file)
  }

  const removeImage = (field: 'school_photo_file' | 'director_photo_file') => {
    handleChange(field, null)
    if (field === 'school_photo_file') {
      setPreviewSchoolImage(null)
    } else {
      setPreviewDirectorImage(null)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (value: string) => {
    handleChange('name', value)
    
    // Auto-generate slug if empty
    if (!formData.slug && value.trim()) {
      handleChange('slug', generateSlug(value))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 school-form-fade-in">
      {/* Layout principal em duas colunas para desktop */}
      <div className="school-form-grid">
        {/* Coluna principal - Informações básicas */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome da Escola */}
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome da Escola *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Digite o nome da escola"
                    required
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Tipo de Escola */}
                <div>
                  <Label htmlFor="type">Tipo de Escola</Label>
                  <Select
                    value={formData.type || 'publica'}
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
                    min="0"
                    value={formData.students_count || ''}
                    onChange={(e) => handleChange('students_count', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Ex: 500"
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

                {/* Status */}
                <div>
                  <Label htmlFor="active">Status</Label>
                  <Select
                    value={formData.active ? 'active' : 'inactive'}
                    onValueChange={(value) => handleChange('active', value === 'active')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Digite o endereço completo da escola"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Diretor */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <Users className="h-5 w-5" />
                Diretor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <FileText className="h-5 w-5" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes">Observações Adicionais</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Informações adicionais sobre a escola"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - Imagens */}
        <div className="space-y-6">
          {/* Foto da Escola */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <ImageIcon className="h-5 w-5" />
                Foto da Escola
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewSchoolImage ? (
                  <div className="relative school-image-preview h-48 w-full">
                    <NextImage
                      src={previewSchoolImage}
                      alt="Foto da escola"
                      fill
                      className="object-cover rounded-lg border"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 school-image-remove"
                      onClick={() => removeImage('school_photo_file')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => schoolImageRef.current?.click()}
                    className="w-full h-48 flex flex-col items-center justify-center border-dashed school-image-upload"
                  >
                    <ImageIcon className="h-12 w-12 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Adicionar Foto da Escola</span>
                  </Button>
                )}
                <input
                  ref={schoolImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload('school_photo_file', file)
                    }
                  }}
                  className="hidden"
                />
                {errors.school_photo_file && (
                  <p className="text-sm text-red-500">{errors.school_photo_file}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Formatos: JPEG, PNG, WebP. Máximo: 5MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Foto do Diretor */}
          <Card className="school-form-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg school-form-card-title">
                <User className="h-5 w-5" />
                Foto do Diretor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewDirectorImage ? (
                  <div className="relative school-image-preview h-32 w-full">
                    <NextImage
                      src={previewDirectorImage}
                      alt="Foto do diretor"
                      fill
                      className="object-cover rounded-lg border"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 school-image-remove"
                      onClick={() => removeImage('director_photo_file')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => directorImageRef.current?.click()}
                    className="w-full h-32 flex flex-col items-center justify-center border-dashed school-image-upload"
                  >
                    <User className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Adicionar Foto</span>
                  </Button>
                )}
                <input
                  ref={directorImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload('director_photo_file', file)
                    }
                  }}
                  className="hidden"
                />
                {errors.director_photo_file && (
                  <p className="text-sm text-red-500">{errors.director_photo_file}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Formatos: JPEG, PNG, WebP. Máximo: 3MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 justify-end pt-6 border-t school-form-transition">
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