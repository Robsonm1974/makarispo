'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SchoolForm } from './school-form'
import { School } from '@/types/schools'
import { Plus, Edit } from 'lucide-react'

interface SchoolDialogProps {
  school?: School
  onSubmit: (data: any) => Promise<void>
  trigger?: React.ReactNode
}

export function SchoolDialog({ school, onSubmit, trigger }: SchoolDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      await onSubmit(data)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao salvar escola:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {school ? 'Editar Escola' : 'Nova Escola'}
          </DialogTitle>
          <DialogDescription>
            {school 
              ? 'Atualize as informações da escola.'
              : 'Preencha as informações para criar uma nova escola.'
            }
          </DialogDescription>
        </DialogHeader>
        <SchoolForm
          school={school}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}