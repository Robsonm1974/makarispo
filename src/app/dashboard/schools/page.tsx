'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SchoolDialog } from '@/components/forms/school-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useSchools } from '@/hooks/useSchools'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import type { School, SchoolFormData } from '@/types/schools'

export default function SchoolsPage() {
  const { user } = useAuth()
  const { schools, loading, error, createSchool, updateSchool, deleteSchool } = useSchools()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)


  // Filtrar escolas baseado no termo de busca
  const filteredSchools = schools.filter(school => {
    const searchLower = searchTerm.toLowerCase()
    
    return (
      school.name.toLowerCase().includes(searchLower) ||
      (school.director_name?.toLowerCase().includes(searchLower)) ||
      (school.type?.toLowerCase().includes(searchLower)) ||
      (school.address?.toLowerCase().includes(searchLower))
    )
  })

  const handleCreateSchool = async (schoolData: SchoolFormData) => {
    try {
      if (!user) {
        toast.error('Usuário não autenticado')
        return
      }

      await createSchool(schoolData, user.id)
      toast.success('Escola criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar escola')
      console.error('Create school error:', error)
    }
  }

  const handleUpdateSchool = async (schoolData: SchoolFormData) => {
    try {
      if (!selectedSchool) return
      
      await updateSchool(selectedSchool.id, schoolData)
      toast.success('Escola atualizada com sucesso!')
      setSelectedSchool(null)
    } catch (error) {
      toast.error('Erro ao atualizar escola')
      console.error('Update school error:', error)
    }
  }

  const handleDeleteSchool = async (schoolId: string) => {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      try {
        await deleteSchool(schoolId)
        toast.success('Escola excluída com sucesso!')
      } catch (error) {
        toast.error('Erro ao excluir escola')
        console.error('Delete school error:', error)
      }
    }
  }

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h1 className="loading-text">Carregando...</h1>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content-compact">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-description">Carregando escolas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-content-compact">
          <div className="error-container">
            <h2 className="error-title">Erro ao carregar escolas</h2>
            <p className="error-description">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-content-compact">
        {/* Header */}
        <div className="page-header-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="page-header">Escolas</h1>
              <p className="page-description">
                Gerencie todas as escolas parceiras
              </p>
            </div>
            <SchoolDialog
              onSubmit={handleCreateSchool}
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Escola
                </Button>
              }
            />
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar escolas por nome, diretor ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-search input-default input-focus"
            />
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school) => (
              <Card key={school.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground mb-1">
                        {school.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={school.type === 'publica' ? 'default' : 'secondary'}>
                          {school.type}
                        </Badge>
                        <Badge
                          variant={school.active ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {school.active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {/* Abrir diálogo de edição diretamente sem botão extra no canto */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSchool(school)}
                        aria-label="Editar escola"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchool(school.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* School Photo */}
                  {school.school_photo_url && (
                    <div className="mb-3 relative h-32 w-full">
                      <NextImage
                        src={school.school_photo_url}
                        alt={school.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Director Info */}
                  {school.director_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{school.director_name}</span>
                      {school.director_photo_url && (
                        <div className="relative w-6 h-6">
                          <NextImage
                            src={school.director_photo_url}
                            alt={school.director_name}
                            fill
                            className="rounded-full object-cover"
                            sizes="24px"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-1">
                    {school.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{school.phone}</span>
                      </div>
                    )}
                    {school.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{school.email}</span>
                      </div>
                    )}
                    {school.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{school.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Students Count */}
                  {school.students_count && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-foreground">{school.students_count}</div>
                        <div className="text-xs text-muted-foreground">Estudantes</div>
                      </div>
                    </div>
                  )}

                  {/* Public Profile Link */}
                  {school.slug && (
                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full">
                        <a href={`/escolas/${school.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`Ver perfil público de ${school.name}`}>
                          Ver perfil público
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="empty-state">
                <Building2 className="empty-state-icon" />
                <h3 className="empty-state-title">
                  {searchTerm ? 'Nenhuma escola encontrada' : 'Nenhuma escola ainda'}
                </h3>
                <p className="empty-state-description">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca'
                    : 'Cadastre sua primeira escola para começar'
                  }
                </p>
                {!searchTerm && (
                  <SchoolDialog
                    onSubmit={handleCreateSchool}
                    trigger={
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Escola
                      </Button>
                    }
                  />
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* School Dialog */}
      <SchoolDialog
        school={selectedSchool || undefined}
        onSubmit={async (data) => {
          if (selectedSchool) {
            await handleUpdateSchool(data)
          } else {
            await handleCreateSchool(data)
          }
          setSelectedSchool(null)
        }}
      />
    </div>
  )
}