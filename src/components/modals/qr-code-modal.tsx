'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Printer, X } from 'lucide-react'
import { toast } from 'sonner'
import type { ParticipantWithRelations } from '@/types/participants'

interface QRCodeModalProps {
  participant: ParticipantWithRelations | null
  open: boolean
  onClose: () => void
}

export function QRCodeModal({ participant, open, onClose }: QRCodeModalProps) {
  const [printing, setPrinting] = useState(false)

  if (!participant) return null

  // Gerar URL do QR Code maior para melhor legibilidade
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(participant.qr_code || '')}&bgcolor=ffffff&color=000000&margin=5`

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Data não definida'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Data inválida'
    }
  }

  const handlePrint = () => {
    try {
      setPrinting(true)
      
      // Criar uma nova janela para impressão
      const printWindow = window.open('', '_blank', 'width=400,height=600')
      
      if (!printWindow) {
        toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
        return
      }

      // HTML para impressão com o mesmo layout do modal
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${participant.name}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: Arial, sans-serif;
                background: white;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
              }
              .qr-card {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                width: 320px;
                height: 480px;
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .participant-info {
                space-y: 12px;
              }
              .participant-name {
                color: black;
                font-size: 20px;
                font-weight: bold;
                line-height: 1.2;
                margin-bottom: 12px;
              }
              .school-info {
                color: black;
                font-size: 16px;
                margin-bottom: 8px;
              }
              .school-name {
                font-weight: 600;
              }
              .event-name {
                font-weight: 600;
                margin-top: 8px;
              }
              .qr-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 16px 0;
              }
              .qr-image {
                border: 1px solid #d1d5db;
                border-radius: 8px;
                margin-bottom: 12px;
              }
              .qr-code-text {
                color: black;
                font-family: monospace;
                font-weight: bold;
                font-size: 18px;
              }
              .footer-info {
                border-top: 1px solid #e5e7eb;
                padding-top: 12px;
              }
              .event-date {
                color: black;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
              }
              .instruction {
                color: black;
                font-size: 12px;
                font-weight: 600;
              }
              @media print {
                body {
                  padding: 0;
                  background: white;
                }
                .qr-card {
                  box-shadow: none;
                  border: 2px solid black;
                }
              }
            </style>
          </head>
          <body>
            <div class="qr-card">
              <div class="participant-info">
                <div class="participant-name">"${participant.name}"</div>
                <div class="school-info">
                  <div class="school-name">${participant.event?.school?.name || 'Escola não definida'}</div>
                  ${participant.turma ? `<div>Turma: "${participant.turma}"</div>` : ''}
                  <div class="event-name">${participant.event?.name || 'Evento não definido'}</div>
                </div>
              </div>
              
              <div class="qr-section">
                ${participant.qr_code ? `
                  <img 
                    src="${qrCodeUrl}" 
                    alt="QR Code para ${participant.name}"
                    class="qr-image"
                    width="240" 
                    height="240"
                  />
                  <div class="qr-code-text">${participant.qr_code}</div>
                ` : `
                  <div style="width: 240px; height: 240px; border: 2px dashed #9ca3af; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #6b7280;">
                      <div style="font-size: 16px; font-weight: 600;">QR Code não gerado</div>
                    </div>
                  </div>
                `}
              </div>
              
              <div class="footer-info">
                <div class="event-date">${formatDate(participant.event?.event_date)}</div>
                <div class="instruction">Fotografe este QR Code junto com o participante</div>
              </div>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      // Aguardar a imagem carregar antes de imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          toast.success('QR Code enviado para impressão!')
        }, 500)
      }

    } catch (error) {
      console.error('Erro ao imprimir:', error)
      toast.error('Erro ao imprimir QR Code')
    } finally {
      setPrinting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-auto p-0 bg-black bg-opacity-50 border-none shadow-none">
        {/* Título oculto para acessibilidade */}
        <DialogTitle className="sr-only">
          QR Code do participante {participant.name}
        </DialogTitle>

        {/* Botão Fechar melhorado - mais visível */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 z-50 bg-white hover:bg-gray-100 text-black border-2 border-gray-300 shadow-lg h-10 w-10 p-0"
          onClick={onClose}
          title="Fechar"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Card retangular vertical - proporção 7:9 aproximadamente */}
        <Card className="bg-white border-2 border-gray-200 shadow-2xl w-[320px] h-[480px] mx-auto overflow-hidden relative">
          <CardContent className="p-6 h-full flex flex-col justify-between text-center">
            
            {/* Seção Superior - Informações do Participante */}
            <div className="space-y-3">
              <div className="text-black text-xl font-bold leading-tight">
                "{participant.name}"
              </div>
              
              <div className="space-y-2 text-black text-base">
                <div className="font-medium">
                  {participant.event?.school?.name || 'Escola não definida'}
                </div>
                
                {participant.turma && (
                  <div>
                    Turma: "{participant.turma}"
                  </div>
                )}
                
                <div className="font-medium">
                  {participant.event?.name || 'Evento não definido'}
                </div>
              </div>
            </div>

            {/* Seção Central - QR Code */}
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              {participant.qr_code ? (
                <div className="space-y-3">
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code para ${participant.name}`}
                    className="border border-gray-300 rounded-lg shadow-sm mx-auto"
                    width={240}
                    height={240}
                    style={{ imageRendering: 'pixelated' }}
                  />
                  
                  {/* Código QR em texto - fonte 18px */}
                  <div className="text-black font-mono font-bold text-lg">
                    {participant.qr_code}
                  </div>
                </div>
              ) : (
                <div className="w-[240px] h-[240px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <QrCode className="h-12 w-12 mx-auto mb-3" />
                    <p className="text-base font-medium">QR Code não gerado</p>
                  </div>
                </div>
              )}
            </div>

            {/* Seção Inferior - Data e Instrução */}
            <div className="space-y-3">
              <div className="text-black text-sm font-medium">
                {formatDate(participant.event?.event_date)}
              </div>
              
              <div className="text-black text-xs font-medium border-t border-gray-200 pt-3">
                Fotografe este QR Code junto com o participante
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Botões de Ação - externos ao card */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white hover:bg-gray-100 text-black border-2 border-gray-300 shadow-lg"
            onClick={handlePrint}
            disabled={printing || !participant.qr_code}
            title="Imprimir QR Code"
          >
            {printing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                Imprimindo...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
