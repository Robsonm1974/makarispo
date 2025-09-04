'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, User, QrCode, Eye, Camera } from 'lucide-react'
import { QRCodeModal } from '@/components/modals/qr-code-modal'
import type { ParticipantWithRelations } from '@/types/participants'

interface ParticipantsTableProps {
  participants: ParticipantWithRelations[]
  onEdit: (participant: ParticipantWithRelations) => void
  onPhotos: (participant: ParticipantWithRelations) => void
}

export function ParticipantsTable({ participants, onEdit, onPhotos }: ParticipantsTableProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithRelations | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)


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

  return (
    <>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Nome</TableHead>
                <TableHead className="min-w-[120px] hidden sm:table-cell">Escola</TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">Evento</TableHead>
                <TableHead className="min-w-[80px]">Turma</TableHead>
                <TableHead className="min-w-[100px] hidden lg:table-cell">QR Code</TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
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