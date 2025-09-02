'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash2, User } from 'lucide-react'
import type { ParticipantWithRelations } from '@/types/participants'

interface ParticipantsTableProps {
  participants: ParticipantWithRelations[]
  onEdit: (participant: ParticipantWithRelations) => void
  onDelete: (id: string) => Promise<void>
}

export function ParticipantsTable({ participants, onEdit, onDelete }: ParticipantsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não definida'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
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
            <TableHead>Turma</TableHead>
            <TableHead>QR Code</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{participant.name}</div>
                  {participant.notes && (
                    <div className="text-sm text-gray-500">{participant.notes}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {participant.event?.school?.name || 'Escola não encontrada'}
                  </div>
                  {participant.event?.school?.type && (
                    <Badge variant="outline" className="text-xs">
                      {participant.event.school.type === 'publica' ? 'Pública' : 'Privada'}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {participant.event?.name || 'Evento não encontrado'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {participant.event?.event_date ? formatDate(participant.event.event_date) : 'Data não definida'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {participant.turma && (
                  <Badge variant="secondary">{participant.turma}</Badge>
                )}
              </TableCell>
              <TableCell>
                {participant.qr_code && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {participant.qr_code}
                  </Badge>
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