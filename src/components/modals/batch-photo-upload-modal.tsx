'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, FileImage, AlertCircle, CheckCircle } from 'lucide-react'
import { useBatchPhotoUpload } from '@/hooks/useBatchPhotoUpload'
import type { ParticipantWithRelations } from '@/types/participants'
import type { BatchUploadResult } from '@/hooks/useBatchPhotoUpload'

interface BatchPhotoUploadModalProps {
  open: boolean
  onClose: () => void
  participants: ParticipantWithRelations[]
  onUploadComplete: (result: BatchUploadResult) => void
}

export function BatchPhotoUploadModal({
  open,
  onClose,
  participants,
  onUploadComplete
}: BatchPhotoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { isUploading, progress, uploadBatchPhotos } = useBatchPhotoUpload()

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(files)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles) return

    const result = await uploadBatchPhotos(selectedFiles, participants)
    onUploadComplete(result)
    onClose()
  }

  const getFilePreview = () => {
    if (!selectedFiles) return null

    const files = Array.from(selectedFiles)
    const qrCodes = files.map(file => {
      const qrMatch = file.name.match(/QR\d{7}/i)
      return qrMatch ? qrMatch[0].toUpperCase() : null
    })

    const validQRCodes = qrCodes.filter(Boolean)
    const invalidFiles = files.filter((_, index) => !qrCodes[index])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileImage className="h-4 w-4" />
          <span className="text-sm font-medium">
            {files.length} arquivo(s) selecionado(s)
          </span>
        </div>

        {validQRCodes.length > 0 && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">
              {validQRCodes.length} arquivo(s) com QR code válido
            </span>
          </div>
        )}

        {invalidFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-600">
              {invalidFiles.length} arquivo(s) sem QR code válido
            </span>
          </div>
        )}

        <div className="max-h-32 overflow-y-auto space-y-1">
          {files.slice(0, 10).map((file, index) => {
            const qrCode = qrCodes[index]
            return (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="truncate flex-1">{file.name}</span>
                {qrCode ? (
                  <Badge variant="secondary" className="ml-2">
                    {qrCode}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="ml-2">
                    Sem QR
                  </Badge>
                )}
              </div>
            )
          })}
          {files.length > 10 && (
            <div className="text-xs text-muted-foreground">
              ... e mais {files.length - 10} arquivo(s)
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Fotos em Lote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Como funciona</CardTitle>
              <CardDescription>
                Selecione múltiplas fotos que contenham QR codes no nome do arquivo.
                O sistema irá automaticamente associar cada foto ao participante correspondente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Formato do arquivo: <code>IMG_222_QR1234567.jpg</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>QR code deve existir na base de participantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Arquivos sem QR code válido serão ignorados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Área de upload */}
          {!selectedFiles && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Arraste e solte suas fotos aqui
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ou clique para selecionar arquivos
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Selecionar Fotos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          )}

          {/* Preview dos arquivos */}
          {selectedFiles && !isUploading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Arquivos Selecionados</CardTitle>
              </CardHeader>
              <CardContent>
                {getFilePreview()}
              </CardContent>
            </Card>
          )}

          {/* Progresso do upload */}
          {isUploading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fazendo Upload...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress}% concluído
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            {selectedFiles && !isUploading && (
              <Button
                onClick={() => setSelectedFiles(null)}
                variant="outline"
              >
                Limpar Seleção
              </Button>
            )}
            {selectedFiles && !isUploading && (
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
              >
                Iniciar Upload
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
