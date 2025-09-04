import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ParticipantInsert } from '@/types/participants'

interface CSVRow {
  nome: string
  turma: string
}

interface ImportResult {
  success: number
  errors: Array<{ row: number; name: string; error: string }>
  total: number
}

export function useParticipantImport() {
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const parseCSV = (csvContent: string): CSVRow[] => {
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    
    // Verificar se há colunas necessárias
    const nomeIndex = headers.findIndex(h => 
      h.includes('nome') || h.includes('name') || h.includes('participante')
    )
    const turmaIndex = headers.findIndex(h => 
      h.includes('turma') || h.includes('class') || h.includes('sala')
    )

    if (nomeIndex === -1) {
      throw new Error('Coluna "nome" não encontrada no CSV. Verifique se o arquivo possui as colunas corretas.')
    }

    const rows: CSVRow[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      
      if (values.length < headers.length || !values[nomeIndex]?.trim()) {
        continue // Pular linhas vazias ou inválidas
      }

      rows.push({
        nome: values[nomeIndex].trim(),
        turma: turmaIndex !== -1 ? values[turmaIndex]?.trim() || '' : ''
      })
    }

    return rows
  }

  const importParticipants = async (
    csvContent: string,
    eventId: string,
    tenantId: string,
    schoolId: string
  ): Promise<ImportResult> => {
    try {
      setImporting(true)
      setProgress(0)

      // Parse do CSV
      const csvRows = parseCSV(csvContent)
      const total = csvRows.length

      if (total === 0) {
        throw new Error('Nenhum participante válido encontrado no arquivo CSV.')
      }

      const result: ImportResult = {
        success: 0,
        errors: [],
        total
      }

      // Processar em lotes de 10 para não sobrecarregar
      const batchSize = 10
      const batches = []
      
      for (let i = 0; i < csvRows.length; i += batchSize) {
        batches.push(csvRows.slice(i, i + batchSize))
      }

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex]
        const batchPromises = batch.map(async (row, index) => {
          const rowNumber = batchIndex * batchSize + index + 2 // +2 porque linha 1 é header

          try {
            const participantData: ParticipantInsert = {
              tenant_id: tenantId,
              school_id: schoolId,
              event_id: eventId,
              name: row.nome,
              turma: row.turma || null,
              tipo: 'aluno', // Padrão para importação
              notes: 'Importado via CSV'
            }

            const { error } = await supabase
              .from('participants')
              .insert(participantData as Record<string, unknown>)

            if (error) {
              result.errors.push({
                row: rowNumber,
                name: row.nome,
                error: error.message
              })
            } else {
              result.success++
            }
          } catch (error) {
            result.errors.push({
              row: rowNumber,
              name: row.nome,
              error: error instanceof Error ? error.message : 'Erro desconhecido'
            })
          }
        })

        await Promise.all(batchPromises)
        
        // Atualizar progresso
        setProgress(Math.round(((batchIndex + 1) / batches.length) * 100))
      }

      return result
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erro desconhecido durante a importação'
      )
    } finally {
      setImporting(false)
      setProgress(0)
    }
  }

  return {
    importing,
    progress,
    importParticipants,
    parseCSV
  }
}
