'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { useParticipantImport } from '@/hooks/useParticipantImport'
import { toast } from 'sonner'

interface ParticipantImportDialogProps {
  trigger?: React.ReactNode
  eventId: string
  tenantId: string
  schoolId: string
  onImportComplete?: () => void
}

export function ParticipantImportDialog({ 
  trigger, 
  eventId, 
  tenantId, 
  schoolId,
  onImportComplete 
}: ParticipantImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvContent, setCsvContent] = useState<string>('')
  const [importResult, setImportResult] = useState<{
    success: number
    errors: Array<{ row: number; name: string; error: string }>
    total: number
  } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { importing, progress, importParticipants } = useParticipantImport()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV válido.')
      return
    }

    setFile(selectedFile)
    setImportResult(null)

    // Ler conteúdo do arquivo
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvContent(content)
    }
    reader.readAsText(selectedFile, 'UTF-8')
  }

  const handleImport = async () => {
    if (!csvContent) {
      toast.error('Nenhum arquivo selecionado.')
      return
    }

    try {
      const result = await importParticipants(csvContent, eventId, tenantId, schoolId)
      setImportResult(result)
      
      if (result.success > 0) {
        toast.success(`${result.success} participantes importados com sucesso!`)
        onImportComplete?.()
      }
      
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} participantes não puderam ser importados.`)
      }
    } catch (error) {
      console.error('Erro na importação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro na importação')
    }
  }

  const handleReset = () => {
    setFile(null)
    setCsvContent('')
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadSampleCSV = () => {
    const sampleContent = `nome,turma
João Silva,1A
Maria Santos,2B
Pedro Oliveira,3C`
    
    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'exemplo-participantes.csv'
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Lista
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Lista de Participantes</DialogTitle>
          <DialogDescription>
            Importe uma lista de participantes a partir de um arquivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Formato do Arquivo CSV</CardTitle>
              <CardDescription>
                O arquivo deve conter as seguintes colunas:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Badge variant="secondary">nome</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nome completo do participante (obrigatório)
                  </p>
                </div>
                <div>
                  <Badge variant="outline">turma</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Turma do participante (opcional)
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Não tem um arquivo? Baixe nosso modelo:
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadSampleCSV}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Exemplo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selecionar Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 mx-auto text-primary" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="font-medium">Clique para selecionar arquivo CSV</p>
                    <p className="text-sm text-muted-foreground">
                      Ou arraste e solte aqui
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progresso */}
          {importing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Importando participantes...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultado */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Resultado da Importação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {importResult.success}
                    </div>
                    <div className="text-sm text-muted-foreground">Sucesso</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {importResult.errors.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Erros</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {importResult.total}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Erros encontrados:
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                          <strong>Linha {error.row}:</strong> {error.name} - {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={importing}
            >
              Limpar
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={importing}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleImport}
                disabled={!file || importing}
              >
                {importing ? 'Importando...' : 'Importar Participantes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
