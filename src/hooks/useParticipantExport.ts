import { useState } from 'react'
import type { ParticipantWithRelations } from '@/types/participants'

interface ExportData {
  eventName: string
  schoolName: string
  eventDate: string | null
  participants: Array<{
    nome: string
    turma: string
    qrCode: string
  }>
}

export function useParticipantExport() {
  const [exporting, setExporting] = useState(false)

  const generateCSVContent = (data: ExportData): string => {
    const { participants } = data
    
    // Apenas cabeçalho das colunas e dados dos participantes
    const header = 'Nome,Turma,QR Code'

    // Dados dos participantes
    const participantRows = participants.map(participant => {
      // Escapar aspas duplas e envolver campos com vírgulas em aspas
      const escapeCsvField = (field: string): string => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      return [
        escapeCsvField(participant.nome),
        escapeCsvField(participant.turma),
        escapeCsvField(participant.qrCode)
      ].join(',')
    })

    return [header, ...participantRows].join('\n')
  }

  const exportParticipants = async (participants: ParticipantWithRelations[]): Promise<void> => {
    try {
      setExporting(true)

      if (participants.length === 0) {
        throw new Error('Nenhum participante encontrado para exportar.')
      }

      // Obter informações do evento e escola do primeiro participante
      const firstParticipant = participants[0]
      if (!firstParticipant.event) {
        throw new Error('Dados do evento não encontrados.')
      }

      const exportData: ExportData = {
        eventName: firstParticipant.event.name,
        schoolName: firstParticipant.event.school?.name || 'Escola não informada',
        eventDate: firstParticipant.event.event_date,
        participants: participants.map(participant => ({
          nome: participant.name,
          turma: participant.turma || '',
          qrCode: participant.qr_code || ''
        }))
      }

      // Gerar conteúdo CSV
      const csvContent = generateCSVContent(exportData)

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        
        // Nome do arquivo baseado no nome do evento
        const fileName = `${exportData.eventName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.csv`
        link.setAttribute('download', fileName)
        
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Limpar URL do blob
        URL.revokeObjectURL(url)
      } else {
        throw new Error('Download não suportado neste navegador.')
      }

    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erro desconhecido durante a exportação'
      )
    } finally {
      setExporting(false)
    }
  }

  const getExportPreview = (participants: ParticipantWithRelations[]): string => {
    if (participants.length === 0) return 'Nenhum participante para exportar'

    const firstParticipant = participants[0]
    if (!firstParticipant.event) return 'Dados do evento não encontrados'

    return `${participants.length} participantes do evento "${firstParticipant.event.name}" da escola "${firstParticipant.event.school?.name || 'N/A'}"`
  }

  return {
    exporting,
    exportParticipants,
    getExportPreview,
    generateCSVContent
  }
}