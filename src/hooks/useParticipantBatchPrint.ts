'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { ParticipantWithRelations } from '@/types/participants'

export function useParticipantBatchPrint() {
  const [isPrinting, setIsPrinting] = useState(false)

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

  const printAllQRCodes = async (participants: ParticipantWithRelations[]) => {
    if (!participants.length) {
      toast.error('Nenhum participante encontrado para impressão')
      return
    }

    // Filtrar apenas participantes com QR code
    const participantsWithQR = participants.filter(p => p.qr_code)
    
    if (!participantsWithQR.length) {
      toast.error('Nenhum participante possui QR Code gerado')
      return
    }

    try {
      setIsPrinting(true)
      
      // Criar uma nova janela para impressão
      const printWindow = window.open('', '_blank', 'width=210mm,height=297mm')
      
      if (!printWindow) {
        toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
        return
      }

      // Organizar participantes em páginas (9 por página)
      const participantsPerPage = 9
      const pages: ParticipantWithRelations[][] = []
      
      for (let i = 0; i < participantsWithQR.length; i += participantsPerPage) {
        pages.push(participantsWithQR.slice(i, i + participantsPerPage))
      }

      // Gerar HTML para todas as páginas
      const generatePageHTML = (pageParticipants: ParticipantWithRelations[], pageNumber: number) => {
        const qrCardsHTML = pageParticipants.map(participant => {
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(participant.qr_code || '')}&bgcolor=ffffff&color=000000&margin=3`
          
          return `
            <div class="qr-card">
              <div class="participant-info">
                <div class="participant-name">"${participant.name}"</div>
                <div class="school-info">
                  <div class="school-name">${participant.event?.school?.name || 'Escola não definida'}</div>
                  ${participant.turma ? `<div class="turma">Turma: "${participant.turma}"</div>` : ''}
                  <div class="event-name">${participant.event?.name || 'Evento não definido'}</div>
                </div>
              </div>
              
              <div class="qr-section">
                <img 
                  src="${qrCodeUrl}" 
                  alt="QR Code para ${participant.name}"
                  class="qr-image"
                  width="120" 
                  height="120"
                />
                <div class="qr-code-text">${participant.qr_code}</div>
              </div>
              
              <div class="footer-info">
                <div class="event-date">${formatDate(participant.event?.event_date)}</div>
              </div>
            </div>
          `
        }).join('')

        // Preencher espaços vazios se necessário (para manter layout 3x3)
        const emptyCards = participantsPerPage - pageParticipants.length
        const emptyCardsHTML = Array(emptyCards).fill('').map(() => '<div class="qr-card empty"></div>').join('')

        return `
          <div class="page" ${pageNumber > 1 ? 'style="page-break-before: always;"' : ''}>
            <div class="page-header">
              <h1>${pageParticipants[0]?.event?.name || 'Evento'} - ${pageParticipants[0]?.event?.school?.name || 'Escola'}</h1>
              <p>QR Codes dos Participantes - Página ${pageNumber} de ${pages.length}</p>
            </div>
            <div class="qr-grid">
              ${qrCardsHTML}
              ${emptyCardsHTML}
            </div>
          </div>
        `
      }

      const allPagesHTML = pages.map((pageParticipants, index) => 
        generatePageHTML(pageParticipants, index + 1)
      ).join('')

      // HTML completo para impressão
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Codes - ${participantsWithQR[0]?.event?.name || 'Evento'}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              @page {
                size: A4;
                margin: 15mm;
              }
              
              body {
                font-family: Arial, sans-serif;
                background: white;
                line-height: 1.4;
                color: black;
              }
              
              .page {
                width: 100%;
                min-height: 100vh;
                padding: 10mm 0;
              }
              
              .page-header {
                text-align: center;
                margin-bottom: 8mm;
                padding-bottom: 5mm;
                border-bottom: 2px solid #333;
              }
              
              .page-header h1 {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 2mm;
              }
              
              .page-header p {
                font-size: 12px;
                color: #666;
              }
              
              .qr-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(3, 1fr);
                gap: 3mm;
                height: calc(100vh - 25mm);
                max-height: 240mm;
              }
              
              .qr-card {
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 3mm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                text-align: center;
                page-break-inside: avoid;
              }
              
              .qr-card.empty {
                border: none;
                background: transparent;
              }
              
              .participant-info {
                margin-bottom: 2mm;
              }
              
              .participant-name {
                font-size: 12px;
                font-weight: bold;
                line-height: 1.2;
                margin-bottom: 1mm;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              
              .school-info {
                font-size: 8px;
                color: #555;
                line-height: 1.1;
              }
              
              .school-name, .event-name {
                font-weight: 600;
                margin-bottom: 0.5mm;
              }
              
              .turma {
                margin: 0.5mm 0;
              }
              
              .qr-section {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 2mm 0;
              }
              
              .qr-image {
                border: 1px solid #ccc;
                border-radius: 2px;
                margin-bottom: 1mm;
              }
              
              .qr-code-text {
                font-family: monospace;
                font-weight: bold;
                font-size: 9px;
                letter-spacing: 0.5px;
              }
              
              .footer-info {
                border-top: 1px solid #eee;
                padding-top: 1mm;
              }
              
              .event-date {
                font-size: 8px;
                font-weight: 600;
                color: #666;
              }
              
              @media print {
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
                
                .page {
                  padding: 0;
                  margin: 0;
                }
                
                .qr-card {
                  border: 1px solid #333 !important;
                }
              }
            </style>
          </head>
          <body>
            ${allPagesHTML}
          </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      // Aguardar as imagens carregarem antes de imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          toast.success(`${participantsWithQR.length} QR Codes enviados para impressão em ${pages.length} página(s)!`)
        }, 1000) // Tempo maior para carregar todas as imagens
      }

    } catch (error) {
      console.error('Erro ao imprimir QR Codes:', error)
      toast.error('Erro ao imprimir QR Codes')
    } finally {
      setIsPrinting(false)
    }
  }

  return {
    isPrinting,
    printAllQRCodes
  }
}
