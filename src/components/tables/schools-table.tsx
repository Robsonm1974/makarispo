'use client'

import { useState } from 'react'
import { School } from '@/types/schools'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Building2, Users } from 'lucide-react'

interface SchoolsTableProps {
  schools: School[]
  onEdit: (school: School) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export function SchoolsTable({ schools, onEdit, onDelete, loading = false }: SchoolsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma escola encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira escola.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Escola</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Diretor</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{school.name}</div>
                  {school.address && (
                    <div className="text-sm text-gray-500">{school.address}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={school.type === 'privada' ? 'default' : 'secondary'}>
                  {school.type === 'privada' ? 'Privada' : 'Pública'}
                </Badge>
              </TableCell>
              <TableCell>
                {school.director_name || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{school.students_count || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {school.phone && <div>{school.phone}</div>}
                  {school.email && <div className="text-gray-500">{school.email}</div>}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(school)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(school.id)}
                      disabled={deletingId === school.id}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === school.id ? 'Deletando...' : 'Deletar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}