'use client'

import { useState } from 'react'
import { useSchools } from '@/hooks/useSchools'
import { SchoolsTable } from '@/components/tables/schools-table'
import { SchoolDialog } from '@/components/forms/school-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { School } from '@/types/schools'
import { toast } from 'sonner'

export default function SchoolsPage() {
  const { schools, loading, error, createSchool, updateSchool, deleteSchool } = useSchools()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSchool, setEditingSchool] = useState<School | null>(null)

  // Filtrar escolas por termo de busca
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.director_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Criar escola
  const handleCreateSchool = async (data: any) => {
    try {
      await createSchool(data)
      toast.success('Escola criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar escola. Tente novamente.')
      throw error
    }
  }

  // Atualizar escola
  const handleUpdateSchool = async (data: any) => {
    if (!editingSchool) return

    try {
      await updateSchool(editingSchool.id, data)
      setEditingSchool(null)
      toast.success('Escola atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar escola. Tente novamente.')
      throw error
    }
  }

  // Deletar escola
  const handleDeleteSchool = async (id: string) => {
    try {
      await deleteSchool(id)
      toast.success('Escola deletada com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar escola. Tente novamente.')
      throw error
    }
  }

  // Editar escola
  const handleEditSchool = (school: School) => {
    setEditingSchool(school)
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Erro ao carregar escolas: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground">
            Gerencie as escolas onde você trabalha
          </p>
        </div>
        <SchoolDialog onSubmit={handleCreateSchool} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schools.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Públicas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schools.filter(s => s.type === 'publica').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Privadas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schools.filter(s => s.type === 'privada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar escolas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SchoolsTable
            schools={filteredSchools}
            onEdit={handleEditSchool}
            onDelete={handleDeleteSchool}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingSchool && (
        <SchoolDialog
          school={editingSchool}
          onSubmit={handleUpdateSchool}
          trigger={<div style={{ display: 'none' }} />}
        />
      )}
    </div>
  )
}