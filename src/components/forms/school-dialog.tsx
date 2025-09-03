'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit } from 'lucide-react'
import { SchoolForm } from './school-form'
import type { School, SchoolFormData } from '@/types/schools'

interface SchoolDialogProps {
  school?: School
  onSubmit: (data: SchoolFormData) => Promise<void>
  trigger?: React.ReactNode
  hideTrigger?: boolean
}

export function SchoolDialog({ school, onSubmit, trigger, hideTrigger = false }: SchoolDialogProps) {
  const [open, setOpen] = useState(false)
  // const [loading, setLoading] = useState(false) // Removido - não utilizado

  const handleSubmit = async (data: SchoolFormData) => {
    try {
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao salvar escola:', error)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  // Abrir automaticamente quando receber uma escola para edição
  useEffect(() => {
    if (school) {
      setOpen(true)
    }
  }, [school])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm">
              {school ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Escola
                </>
              )}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-[1100px] lg:max-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {school ? 'Editar Escola' : 'Nova Escola'}
          </DialogTitle>
        </DialogHeader>
        <SchoolForm
          school={school}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}