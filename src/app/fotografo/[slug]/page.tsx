'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { Search, MessageCircle, Camera, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'

interface PhotographerData {
  id: string
  name: string
  bio?: string
  city?: string
  state?: string
  email?: string
  slug?: string
  whatsapp?: string
  logo_url?: string
  plan?: string
}

interface QRSearchForm {
  qrCode: string
}

interface WhatsAppForm {
  requesterName: string
  relationship: string
  participantName: string
  schoolClass: string
  schoolName: string
}

export default function PhotographerPage() {
  const { slug } = useParams()
  const [photographer, setPhotographer] = useState<PhotographerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrForm, setQrForm] = useState<QRSearchForm>({ qrCode: '' })
  const [whatsappForm, setWhatsappForm] = useState<WhatsAppForm>({
    requesterName: '',
    relationship: '',
    participantName: '',
    schoolClass: '',
    schoolName: ''
  })
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      loadPhotographer()
    }
  }, [slug])

  const loadPhotographer = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setPhotographer(data)
    } catch (error) {
      console.error('Erro ao carregar fotógrafo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQRSearch = () => {
    if (!qrForm.qrCode.trim()) return
    
    // Redirecionar para página do participante
    window.location.href = `/fotografo/${slug}/participante/${qrForm.qrCode}`
  }

  const handleWhatsAppRequest = () => {
    if (!photographer?.whatsapp) return

    const message = `Olá, sou ${whatsappForm.requesterName}, ${whatsappForm.relationship} do participante: ${whatsappForm.participantName}, ${whatsappForm.schoolClass}, da escola ${whatsappForm.schoolName}. Gostaria de solicitar o QR code para localizar e ver as fotos, por favor.`
    
    const whatsappUrl = `https://wa.me/${photographer.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setWhatsappDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h1 className="text-xl font-semibold mb-2">Fotógrafo não encontrado</h1>
            <p className="text-muted-foreground">O link que você acessou não existe ou foi removido.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {photographer.logo_url && (
              <div className="relative w-16 h-16">
                <Image
                  src={photographer.logo_url}
                  alt={`Logo ${photographer.name}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{photographer.name}</h1>
              {photographer.bio && (
                <p className="text-gray-600 mt-1">{photographer.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {photographer.city && photographer.state && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {photographer.city}, {photographer.state}
                  </span>
                )}
                {photographer.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {photographer.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Localizar Participante */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Localizar Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Insira o código QR que você recebeu para ver as fotos do participante.
              </p>
              <div className="space-y-2">
                <Label htmlFor="qrCode">Código QR</Label>
                <Input
                  id="qrCode"
                  placeholder="Ex: QR1234567"
                  value={qrForm.qrCode}
                  onChange={(e) => setQrForm({ qrCode: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleQRSearch()}
                />
              </div>
              <Button 
                onClick={handleQRSearch} 
                className="w-full"
                disabled={!qrForm.qrCode.trim()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Ver Fotos
              </Button>
            </CardContent>
          </Card>

          {/* Solicitar QR Code */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Solicitar QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Não tem o código QR? Solicite pelo WhatsApp informando os dados do participante.
              </p>
              <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Solicitar por WhatsApp
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Solicitar QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="requesterName">Seu nome</Label>
                      <Input
                        id="requesterName"
                        value={whatsappForm.requesterName}
                        onChange={(e) => setWhatsappForm(prev => ({ ...prev, requesterName: e.target.value }))}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Parentesco</Label>
                      <Input
                        id="relationship"
                        value={whatsappForm.relationship}
                        onChange={(e) => setWhatsappForm(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="Ex: pai, mãe, avó"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participantName">Nome do participante</Label>
                      <Input
                        id="participantName"
                        value={whatsappForm.participantName}
                        onChange={(e) => setWhatsappForm(prev => ({ ...prev, participantName: e.target.value }))}
                        placeholder="Nome do aluno/participante"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolClass">Turma</Label>
                      <Input
                        id="schoolClass"
                        value={whatsappForm.schoolClass}
                        onChange={(e) => setWhatsappForm(prev => ({ ...prev, schoolClass: e.target.value }))}
                        placeholder="Ex: 5º ano A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">Nome da escola</Label>
                      <Input
                        id="schoolName"
                        value={whatsappForm.schoolName}
                        onChange={(e) => setWhatsappForm(prev => ({ ...prev, schoolName: e.target.value }))}
                        placeholder="Nome completo da escola"
                      />
                    </div>
                    <Button 
                      onClick={handleWhatsAppRequest} 
                      className="w-full"
                      disabled={!whatsappForm.requesterName || !whatsappForm.participantName}
                    >
                      Enviar Solicitação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by <span className="font-semibold">Photo Manager</span></p>
        </footer>
      </main>
    </div>
  )
}
