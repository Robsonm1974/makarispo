'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Search } from 'lucide-react'
import { useSchools } from '@/hooks/useSchools'
import { useAuth } from '@/contexts/AuthContext'
import { SchoolsTable } from '@/components/tables/schools-table'
import { SchoolDialog } from '@/components/forms/school-dialog'
import type { School, SchoolFormData, SchoolInsert } from '@/types/schools'

export default function SchoolsPage() {
  const { user } = useAuth()
  const { schools, loading, error, createSchool, updateSchool, deleteSchool } = useSchools()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSchool, setEditingSchool] = useState<School | null>(null)

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.director_name && school.director_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Criar escola
  const handleCreateSchool = async (data: SchoolFormData) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      // Converter SchoolFormData para SchoolInsert adicionando tenant_id
      const schoolData: SchoolInsert = {
        ...data,
        tenant_id: user.id,
        active: true
      }
      
      await createSchool(schoolData)
      toast.success('Escola criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar escola. Tente novamente.')
      throw error
    }
  }

  // Atualizar escola
  const handleUpdateSchool = async (data: SchoolFormData) => {
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

  const stats = [
    {
      title: 'Total de Escolas',
      value: schools.length,
      description: 'Escolas cadastradas'
    },
    {
      title: 'Escolas Públicas',
      value: schools.filter(s => s.type === 'publica').length,
      description: 'Ensino público'
    },
    {
      title: 'Escolas Privadas',
      value: schools.filter(s => s.type === 'privada').length,
      description: 'Ensino privado'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Escolas</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar escolas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <SchoolDialog onSubmit={handleCreateSchool} />
          </div>

          {/* Schools Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Escolas</CardTitle>
              <CardDescription>
                Gerencie todas as escolas onde você realiza trabalhos fotográficos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">Erro: {error}</p>
                </div>
              )}
              
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
      </div>
    </div>
  )
}