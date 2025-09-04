'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, School, Users } from 'lucide-react'
import { useParticipantExport } from '@/hooks/useParticipantExport'
import { toast } from 'sonner'
import type { ParticipantWithRelations } from '@/types/participants'

interface ParticipantExportButtonProps {
  participants: ParticipantWithRelations[]
  disabled?: boolean
  trigger?: React.ReactNode
}

export function ParticipantExportButton({ 
  participants, 
  disabled = false,
  trigger 
}: ParticipantExportButtonProps) {
  const [open, setOpen] = useState(false)
  const { exporting, exportParticipants, getExportPreview } = useParticipantExport()

  const handleExport = async () => {
    try {
      await exportParticipants(participants)
      toast.success('Lista de participantes exportada com sucesso!')
      setOpen(false)
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na exportação')
    }
  }

  // Obter dados do evento se houver participantes
  const eventData = participants.length > 0 ? participants[0].event : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            disabled={disabled || participants.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Lista
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Lista de Participantes</DialogTitle>
          <DialogDescription>
            Baixe a lista completa de participantes em formato CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Evento */}
          {eventData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Detalhes da Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Evento:</strong> {eventData.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Escola:</strong> {eventData.school?.name || 'Não informada'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Data:</strong> {
                      eventData.event_date 
                        ? new Date(eventData.event_date).toLocaleDateString('pt-BR')
                        : 'Não informada'
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Participantes:</strong> {participants.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formato do Arquivo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Formato do Arquivo</CardTitle>
              <CardDescription>
                O arquivo CSV conterá apenas os dados dos participantes:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Formato:</strong> CSV limpo, pronto para importação
              </div>
              <div className="text-sm">
                <strong>Colunas:</strong>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">Nome</Badge>
                  <Badge variant="secondary">Turma</Badge>
                  <Badge variant="secondary">QR Code</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {participants.length > 0 && (
            <div className="text-sm text-muted-foreground border-l-2 border-primary pl-3">
              {getExportPreview(participants)}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-between gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={exporting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExport}
              disabled={exporting || participants.length === 0}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
