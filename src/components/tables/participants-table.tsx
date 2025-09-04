'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, User, QrCode, Camera, ChevronUp, ChevronDown, Image } from 'lucide-react'
import { QRCodeModal } from '@/components/modals/qr-code-modal'
import { useParticipantPhotoCounts } from '@/hooks/useParticipantPhotoCounts'
import type { ParticipantWithRelations } from '@/types/participants'

type SortField = 'name' | 'turma' | 'school' | 'event' | 'photos'
type SortDirection = 'asc' | 'desc'

interface ParticipantsTableProps {
  participants: ParticipantWithRelations[]
  onEdit: (participant: ParticipantWithRelations) => void
  onPhotos: (participant: ParticipantWithRelations) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ParticipantsTable({ participants, onEdit, onPhotos, searchQuery, onSearchChange }: ParticipantsTableProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithRelations | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Buscar contagem de fotos
  const participantIds = participants.map(p => p.id)
  const { photoCounts } = useParticipantPhotoCounts(participantIds)


  // Filtrar e ordenar participantes
  const filteredAndSortedParticipants = useMemo(() => {
    let filtered = participants

    // Filtrar por pesquisa
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = participants.filter(participant =>
        participant.name.toLowerCase().includes(query)
      )
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'turma':
          aValue = a.turma?.toLowerCase() || ''
          bValue = b.turma?.toLowerCase() || ''
          break
        case 'school':
          aValue = a.event?.school?.name?.toLowerCase() || ''
          bValue = b.event?.school?.name?.toLowerCase() || ''
          break
        case 'event':
          aValue = a.event?.name?.toLowerCase() || ''
          bValue = b.event?.name?.toLowerCase() || ''
          break
        case 'photos':
          aValue = photoCounts[a.id] || 0
          bValue = photoCounts[b.id] || 0
          break
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [participants, searchQuery, sortField, sortDirection, photoCounts])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const handleViewQRCode = (participant: ParticipantWithRelations) => {
    setSelectedParticipant(participant)
    setQrModalOpen(true)
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

  if (filteredAndSortedParticipants.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum participante encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Nenhum participante corresponde à pesquisa &quot;{searchQuery}&quot;.
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
                    className="h-auto p-0 font-semibold"
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
                    className="h-auto p-0 font-semibold"
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
                    className="h-auto p-0 font-semibold"
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
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('turma')}
                  >
                    Turma
                    {getSortIcon('turma')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[80px] hidden lg:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('photos')}
                  >
                    Fotos
                    {getSortIcon('photos')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[100px] hidden xl:table-cell">QR Code</TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedParticipants.map((participant) => (
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
                    <div className="flex items-center gap-1">
                      <Image className="h-4 w-4 text-gray-500" alt="" />
                      <span className="text-sm font-medium">
                        {photoCounts[participant.id] || 0}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="hidden xl:table-cell">
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