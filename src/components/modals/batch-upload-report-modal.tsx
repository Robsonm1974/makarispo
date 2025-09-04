'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react'
import type { BatchUploadResult } from '@/hooks/useBatchPhotoUpload'

interface BatchUploadReportModalProps {
  open: boolean
  onClose: () => void
  result: BatchUploadResult | null
}

export function BatchUploadReportModal({
  open,
  onClose,
  result
}: BatchUploadReportModalProps) {
  if (!result) return null

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: result.totalFiles,
        success: result.success,
        errors: result.errors,
        orphanFiles: result.orphanFiles.length
      },
      successFiles: result.successFiles,
      errorFiles: result.errorFiles,
      orphanFiles: result.orphanFiles
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `upload-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = () => {
    if (result.success > 0 && result.errors === 0) {
      return <CheckCircle className="h-6 w-6 text-green-600" />
    } else if (result.success > 0 && result.errors > 0) {
      return <AlertCircle className="h-6 w-6 text-amber-600" />
    } else {
      return <XCircle className="h-6 w-6 text-red-600" />
    }
  }

  const getStatusMessage = () => {
    if (result.success > 0 && result.errors === 0) {
      return 'Upload concluído com sucesso!'
    } else if (result.success > 0 && result.errors > 0) {
      return 'Upload concluído com alguns erros'
    } else {
      return 'Upload falhou'
    }
  }

  const getStatusColor = () => {
    if (result.success > 0 && result.errors === 0) {
      return 'text-green-600'
    } else if (result.success > 0 && result.errors > 0) {
      return 'text-amber-600'
    } else {
      return 'text-red-600'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Relatório de Upload em Lote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.totalFiles}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total de Arquivos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.success}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sucessos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {result.errors}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Erros
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {result.orphanFiles.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sem QR Code
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className={`flex items-center gap-2 text-lg font-medium ${getStatusColor()}`}>
                  {getStatusIcon()}
                  {getStatusMessage()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arquivos com sucesso */}
            {result.successFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Arquivos Importados ({result.successFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {result.successFiles.map((filename, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="truncate">{filename}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Arquivos com erro */}
            {result.errorFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Arquivos com Erro ({result.errorFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {result.errorFiles.map((errorFile, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
                            <span className="truncate font-medium">{errorFile.filename}</span>
                          </div>
                          <div className="text-xs text-red-600 ml-5">
                            {errorFile.error}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Arquivos órfãos */}
            {result.orphanFiles.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Arquivos sem QR Code Válido ({result.orphanFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {result.orphanFiles.map((filename, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-amber-600 flex-shrink-0" />
                          <span className="truncate">{filename}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Estes arquivos não contêm QR codes válidos no formato QR1234567
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={downloadReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
            
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
