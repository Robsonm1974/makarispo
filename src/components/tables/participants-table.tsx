'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, User, QrCode, Camera, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { QRCodeModal } from '@/components/modals/qr-code-modal'
import type { ParticipantWithRelations } from '@/types/participants'

type SortField = 'name' | 'school' | 'event' | 'turma' | 'qr_code'
type SortDirection = 'asc' | 'desc' | null

interface ParticipantsTableProps {
  participants: ParticipantWithRelations[]
  onEdit: (participant: ParticipantWithRelations) => void
  onPhotos: (participant: ParticipantWithRelations) => void
}

export function ParticipantsTable({ participants, onEdit, onPhotos }: ParticipantsTableProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithRelations | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)


  const handleViewQRCode = (participant: ParticipantWithRelations) => {
    setSelectedParticipant(participant)
    setQrModalOpen(true)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Se já está ordenando por este campo, alterna a direção
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortField(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      // Novo campo, começa com asc
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4" />
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  const sortedParticipants = useMemo(() => {
    if (!sortField || !sortDirection) {
      return participants
    }

    return [...participants].sort((a, b) => {
      let aValue: string
      let bValue: string

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'school':
          aValue = (a.event?.school?.name || '').toLowerCase()
          bValue = (b.event?.school?.name || '').toLowerCase()
          break
        case 'event':
          aValue = (a.event?.name || '').toLowerCase()
          bValue = (b.event?.name || '').toLowerCase()
          break
        case 'turma':
          aValue = (a.turma || '').toLowerCase()
          bValue = (b.turma || '').toLowerCase()
          break
        case 'qr_code':
          aValue = (a.qr_code || '').toLowerCase()
          bValue = (b.qr_code || '').toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [participants, sortField, sortDirection])

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
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('name')}
                  >
                    Nome
                    {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('school')}
                  >
                    Escola
                    {getSortIcon('school')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('event')}
                  >
                    Evento
                    {getSortIcon('event')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[80px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('turma')}
                  >
                    Turma
                    {getSortIcon('turma')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort('qr_code')}
                  >
                    QR Code
                    {getSortIcon('qr_code')}
                  </Button>
                </TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm sm:text-base">{participant.name}</div>
                      {/* Mostrar informações adicionais em mobile */}
                      <div className="text-xs text-gray-500 sm:hidden space-y-1 mt-1">
                        <div>{participant.event?.school?.name || 'Escola não encontrada'}</div>
                        <div>{participant.event?.name || 'Evento não encontrado'}</div>
                        {participant.event?.event_date && (
                          <div>{formatDate(participant.event.event_date)}</div>
                        )}
                      </div>
                      {participant.notes && (
                        <div className="text-xs text-gray-500 mt-1">{participant.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden sm:table-cell">
                    <div>
                      <div className="font-medium text-sm">
                        {participant.event?.school?.name || 'Escola não encontrada'}
                      </div>
                      {participant.event?.school?.type && (
                        <Badge variant="outline" className="text-xs">
                          {participant.event.school.type === 'publica' ? 'Pública' : 'Privada'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <div className="font-medium text-sm">
                        {participant.event?.name || 'Evento não encontrado'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {participant.event?.event_date ? formatDate(participant.event.event_date) : 'Data não definida'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {participant.turma ? (
                      <Badge variant="secondary" className="text-xs">
                        {participant.turma}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="hidden lg:table-cell">
                    {participant.qr_code ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {participant.qr_code}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">Não gerado</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/* Botão Ver QR Code */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewQRCode(participant)}
                        title="Ver QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                        <span className="sr-only">Ver QR Code</span>
                      </Button>
                      
                      {/* Botão Fotos */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onPhotos(participant)}
                        title="Gerenciar Fotos"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Gerenciar Fotos</span>
                      </Button>
                      
                      {/* Botão Editar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(participant)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal QR Code */}
      <QRCodeModal
        participant={selectedParticipant}
        open={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false)
          setSelectedParticipant(null)
        }}
      />
    </>
  )
}