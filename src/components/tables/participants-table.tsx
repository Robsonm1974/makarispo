'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, User } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { ParticipantWithRelations } from '@/types/participants'

interface ParticipantsTableProps {
  participants: ParticipantWithRelations[]
  onEdit: (participant: ParticipantWithRelations) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export function ParticipantsTable({ participants, onEdit, onDelete, loading = false }: ParticipantsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum participante encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece adicionando um novo participante.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Escola</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{participant.name}</div>
                  {participant.grade && (
                    <div className="text-sm text-gray-500">{participant.grade}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{participant.school.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {participant.school.type === 'publica' ? 'Pública' : 'Privada'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{participant.event.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(participant.event.event_date)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {participant.email && (
                    <div className="text-sm">{participant.email}</div>
                  )}
                  {participant.phone && (
                    <div className="text-sm text-gray-500">{participant.phone}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {participant.class_name && (
                  <Badge variant="secondary">{participant.class_name}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(participant)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(participant.id)}
                      disabled={deletingId === participant.id}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingId === participant.id ? 'Excluindo...' : 'Excluir'}
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