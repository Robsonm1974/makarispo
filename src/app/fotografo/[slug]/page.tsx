'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Search, MessageCircle, Camera, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import './photographer-styles.css'

interface PhotographerData {
  id: string
  email: string
  name: string
  whatsapp?: string | null
  city?: string | null
  state?: string | null
  bio?: string | null
  plan?: string
  logo_url?: string | null
  slug?: string | null
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
  const { slug } = useParams<{ slug: string }>()
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

  // Itens informativos (somente UI)
  const infoItems: { title: string; description: string; tag: string }[] = [
    {
      title: 'Gerenciamento Inteligente de Fotos',
      description: 'Organização e marcação com inteligência artificial. Classifique automaticamente fotos por aluno, turma e evento.',
      tag: 'Fácil Acesso'
    },
    {
      title: 'Busca de Fotos pelas Famílias',
      description: 'Famílias podem facilmente encontrar e visualizar fotos de seus filhos usando códigos de acesso',
      tag: 'Ilimitado'
    },
    {
      title: 'Armazenamento em Nuvem',
      description: 'Acesse suas fotos de qualquer lugar, a qualquer hora.',
      tag: 'Pagamento Seguro'
    },
    {
      title: 'Sistema de compras sem login',
      description: 'Localize, visualize e compre as fotos dos participantes em um só lugar',
      tag: 'Automatizado'
    },
    {
      title: 'Sistema de Identificação',
      description: 'Alunos e organização automática das fotos por turma e evento.',
      tag: 'Personalizado'
    },
    {
      title: 'Site Gratuito para Escolas',
      description: 'Site personalizado para cada escola participante',
      tag: 'Portfolio'
    },
    {
      title: 'Segurança e Profissionalismo',
      description: 'Fotos criptografadas, sem exposição nas redes sociais',
      tag: 'Tecnologia e ética'
    }
  ]

  useEffect(() => {
    if (slug) loadPhotographer()
  }, [slug])

  const loadPhotographer = async () => {
    if (!slug) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setPhotographer({ ...data, bio: data.bio ?? undefined, city: data.city ?? undefined, state: data.state ?? undefined, logo_url: data.logo_url ?? undefined, slug: data.slug ?? undefined, whatsapp: data.whatsapp ?? undefined })
    } catch (error) {
      console.error('Erro ao carregar fotógrafo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQRSearch = () => {
    if (!qrForm.qrCode.trim()) return
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 photographer-page">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Localizar Participante */}
          <Card className="card-hover bg-zinc-900 text-zinc-50 border-zinc-800 photographer-card">
            <CardHeader className="photographer-card-header">
              <CardTitle className="flex items-center gap-2 photographer-card-title">
                <Search className="h-5 w-5 text-primary" />
                Localizar Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 photographer-card-content">
              <p className="text-sm text-zinc-300">
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
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 photographer-input"
                />
              </div>
              <Button 
                onClick={handleQRSearch} 
                className="w-full photographer-button"
                disabled={!qrForm.qrCode.trim()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Ver Fotos
              </Button>
            </CardContent>
          </Card>

          {/* Solicitar QR Code */}
          <Card className="card-hover bg-zinc-900 text-zinc-50 border-zinc-800 photographer-card">
            <CardHeader className="photographer-card-header">
              <CardTitle className="flex items-center gap-2 photographer-card-title">
                <MessageCircle className="h-5 w-5 text-primary" />
                Solicitar QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 photographer-card-content">
              <p className="text-sm text-zinc-300">
                Não tem o código QR? Solicite pelo WhatsApp informando os dados do participante.
              </p>
              <Dialog open={whatsappDialogOpen} onOpenChange={setWhatsappDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-zinc-600 text-zinc-100 hover:bg-zinc-800 photographer-button-outline">
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
                      className="w-full photographer-button"
                      disabled={!whatsappForm.requesterName || !whatsappForm.participantName}
                    >
                      Enviar Solicitação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="text-xs text-white/80 text-right mt-4">
                Powered by <span className="font-semibold">Photo Manager</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informational Cards */}
        <section className="max-w-6xl mx-auto px-4 pb-12 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoItems.map((item, idx) => (
              <Card key={idx} className="bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold text-zinc-900">
                      {item.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border border-orange-200">
                      {item.tag}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer Bar */}
        <footer className="photographer-footer-bar mt-8">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span />
              <p className="text-sm">Telefone para suporte: {photographer?.whatsapp ? photographer.whatsapp : 'não informado'}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {photographer.city && photographer.state ? `${photographer.city}, ${photographer.state}` : 'Localização não informada'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{photographer.email || 'E-mail não informado'}</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}