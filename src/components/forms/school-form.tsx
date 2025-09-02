'use client'

import { useState, useEffect, useRef } from 'react'
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

  const handleChange = (field: keyof SchoolFormData, value: string | number | boolean | null) => {
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
    <form onSubmit={handleSubmit} className="school-form-container school-form-fade-in">
      {/* Layout principal otimizado para desktop */}
      <div className="school-form-grid">
        
        {/* Coluna principal - Informações básicas e contato */}
        <div className="school-form-main">
          
          {/* Informações Básicas */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <Building2 className="h-6 w-6 text-primary" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="school-form-card-content">
              {/* Nome da Escola - Ocupa toda a largura */}
              <div className="school-form-field">
                <Label htmlFor="name" className="school-form-label">Nome da Escola *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Digite o nome da escola"
                  required
                  className={`school-form-input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Tipo, Estudantes e Status em linha */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="school-form-field">
                  <Label htmlFor="type" className="school-form-label">Tipo de Escola</Label>
                  <Select
                    value={formData.type || 'publica'}
                    onValueChange={(value) => handleChange('type', value as 'publica' | 'privada')}
                  >
                    <SelectTrigger className="school-form-input">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publica">Pública</SelectItem>
                      <SelectItem value="privada">Privada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="school-form-field">
                  <Label htmlFor="students_count" className="school-form-label">Número de Estudantes</Label>
                  <Input
                    id="students_count"
                    type="number"
                    min="0"
                    value={formData.students_count || ''}
                    onChange={(e) => handleChange('students_count', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Ex: 500"
                    className="school-form-input"
                  />
                </div>

                <div className="school-form-field">
                  <Label htmlFor="active" className="school-form-label">Status</Label>
                  <Select
                    value={formData.active ? 'active' : 'inactive'}
                    onValueChange={(value) => handleChange('active', value === 'active')}
                  >
                    <SelectTrigger className="school-form-input">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Slug */}
              <div className="school-form-field">
                <Label htmlFor="slug" className="school-form-label">Slug (URL amigável)</Label>
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="nome-da-escola"
                  className="school-form-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <MapPin className="h-6 w-6 text-primary" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="school-form-field">
                <Label htmlFor="address" className="school-form-label">Endereço Completo</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Digite o endereço completo da escola"
                  rows={3}
                  className="school-form-textarea"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <Phone className="h-6 w-6 text-primary" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="school-form-field">
                  <Label htmlFor="phone" className="school-form-label">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="school-form-input"
                  />
                </div>

                <div className="school-form-field">
                  <Label htmlFor="email" className="school-form-label">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="escola@exemplo.com"
                    className="school-form-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diretor */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <Users className="h-6 w-6 text-primary" />
                Diretor
              </CardTitle>
            </CardHeader>
            <CardContent className="school-form-card-content">
              <div className="school-form-field">
                <Label htmlFor="director_name" className="school-form-label">Nome do Diretor</Label>
                <Input
                  id="director_name"
                  value={formData.director_name || ''}
                  onChange={(e) => handleChange('director_name', e.target.value)}
                  placeholder="Nome do diretor"
                  className="school-form-input"
                />
              </div>

              <div className="school-form-field">
                <Label htmlFor="director_message" className="school-form-label">Mensagem do Diretor</Label>
                <Textarea
                  id="director_message"
                  value={formData.director_message || ''}
                  onChange={(e) => handleChange('director_message', e.target.value)}
                  placeholder="Uma mensagem especial do diretor para os pais e alunos"
                  rows={4}
                  className="school-form-textarea"
                />
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <FileText className="h-6 w-6 text-primary" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="school-form-field">
                <Label htmlFor="notes" className="school-form-label">Observações Adicionais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Informações adicionais sobre a escola"
                  rows={3}
                  className="school-form-textarea"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - Imagens */}
        <div className="school-form-sidebar">
          {/* Foto da Escola */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <ImageIcon className="h-5 w-5 text-primary" />
                Foto da Escola
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previewSchoolImage ? (
                  <div className="school-image-preview-container">
                    <img
                      src={previewSchoolImage}
                      alt="Foto da escola"
                      className="school-image-preview h-48"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="school-image-remove-btn"
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
                    className="school-image-upload-area h-48"
                  >
                    <ImageIcon className="h-12 w-12 mb-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground text-center">Adicionar Foto da Escola</span>
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
                <p className="text-xs text-muted-foreground text-center">
                  Formatos: JPEG, PNG, WebP<br />
                  Máximo: 5MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Foto do Diretor */}
          <Card className="school-form-card">
            <CardHeader className="school-form-card-header">
              <CardTitle className="school-form-card-title">
                <User className="h-5 w-5 text-primary" />
                Foto do Diretor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previewDirectorImage ? (
                  <div className="school-image-preview-container">
                    <img
                      src={previewDirectorImage}
                      alt="Foto do diretor"
                      className="school-image-preview h-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="school-image-remove-btn"
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
                    className="school-image-upload-area h-32"
                  >
                    <User className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground text-center">Adicionar Foto</span>
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
                <p className="text-xs text-muted-foreground text-center">
                  Formatos: JPEG, PNG, WebP<br />
                  Máximo: 3MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões */}
      <div className="school-form-actions">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="school-form-btn">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading} className="school-form-btn">
          {loading ? 'Salvando...' : school ? 'Atualizar Escola' : 'Criar Escola'}
        </Button>
      </div>
    </form>
  )
}