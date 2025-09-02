'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Camera, 
  Search, 
  Cloud, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  QrCode, 
  Globe, 
  User, 
  Settings,
  Star,
  Check,
  ArrowRight,
  Play,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X
} from 'lucide-react'
import { toast } from 'sonner'

// Componente de navegação
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Photo Manager</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('funcionalidades')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Funcionalidades
            </button>
            <button 
              onClick={() => scrollToSection('precos')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Preços
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contato
            </button>
            <LoginModal />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Começar Grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('funcionalidades')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('precos')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Preços
              </button>
              <button 
                onClick={() => scrollToSection('contato')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
              >
                Contato
              </button>
              <div className="pt-4 pb-3 border-t border-border">
                <LoginModal />
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                  Começar Grátis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Componente de Login Modal
function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de login
    toast.success('Login realizado com sucesso!')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Entrar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Entrar no Photo Manager</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              <Star className="inline h-4 w-4 mr-1" />
              Confiado por mais de 500 Fotógrafos Escolares
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Simplifique Seus{' '} <br />
              <span className="text-primary">Eventos de Fotografia Escolar</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A plataforma completa para gerenciar eventos de fotografia escolar, galerias de clientes e entrega de fotos. 
              Economize tempo, aumente as vendas e ofereça experiências excepcionais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Iniciar Teste Grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Ver Demonstração
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Fotos Gerenciadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação dos Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section id="funcionalidades" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Plataforma Completa
            </h2>
            <p className="text-xl text-muted-foreground">
              Tudo que Você Precisa para Gerenciar Seu Negócio de Fotografia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gerenciamento Inteligente de Fotos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Camera className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">IA Integrada</Badge>
                </div>
                <CardTitle>Gerenciamento Inteligente de Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Organização e marcação com inteligência artificial. Classifique automaticamente fotos por aluno, turma e evento.
                </p>
              </CardContent>
            </Card>

            {/* Busca de Fotos pelas Famílias */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Search className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Fácil Acesso</Badge>
                </div>
                <CardTitle>Busca de Fotos pelas Famílias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Famílias podem facilmente encontrar e visualizar fotos de seus filhos usando códigos de acesso ou busca por nome.
                </p>
              </CardContent>
            </Card>

            {/* Armazenamento em Nuvem */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Cloud className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Ilimitado</Badge>
                </div>
                <CardTitle>Armazenamento em Nuvem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Armazenamento ilimitado com backup automático. Acesse suas fotos de qualquer lugar, a qualquer hora.
                </p>
              </CardContent>
            </Card>

            {/* Vendas de Fotos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Pagamento Seguro</Badge>
                </div>
                <CardTitle>Vendas de Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema completo de vendas com pagamentos integrados. Processamento automático de pedidos e entrega digital.
                </p>
              </CardContent>
            </Card>

            {/* Agendamento de Eventos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Calendar className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Automatizado</Badge>
                </div>
                <CardTitle>Agendamento de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gerencie múltiplos eventos de fotografia escolar com lembretes automáticos e sistema de reservas.
                </p>
              </CardContent>
            </Card>

            {/* Analytics e Relatórios */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Insights</Badge>
                </div>
                <CardTitle>Analytics e Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acompanhe vendas, fotos populares e engajamento dos clientes com análises detalhadas e relatórios.
                </p>
              </CardContent>
            </Card>

            {/* Sistema de Identificação */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <QrCode className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">QR Code</Badge>
                </div>
                <CardTitle>Sistema de Identificação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  QR Codes para identificação rápida de alunos e organização automática das fotos por turma e evento.
                </p>
              </CardContent>
            </Card>

            {/* Site Gratuito para Escolas */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Globe className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Personalizado</Badge>
                </div>
                <CardTitle>Site Gratuito para Escolas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Site personalizado para cada escola visualizar e gerenciar seus eventos fotográficos e galerias.
                </p>
              </CardContent>
            </Card>

            {/* Site Gratuito para Fotógrafos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <User className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Portfolio</Badge>
                </div>
                <CardTitle>Site Gratuito para Fotógrafos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Portfolio profissional com domínio próprio para showcasing do seu trabalho e captação de novos clientes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* PhotoLab Card */}
          <div className="mt-12">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Settings className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">IA Local</Badge>
                </div>
                <CardTitle className="text-2xl">PhotoLab - App Local com IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Aplicativo desktop com IA que cria estrutura de arquivos, processa e identifica QR codes, preparando fotos para upload.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preços Section */}
      <section id="precos" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha o Plano Ideal para Seu Negócio de Fotografia
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece grátis e escale conforme você cresce. Sem taxas ocultas, sem contratos de longo prazo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Iniciante */}
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Iniciante</CardTitle>
                <div className="text-4xl font-bold text-foreground">Grátis</div>
                <p className="text-muted-foreground">Perfeito para fotógrafos iniciantes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
                
                <div>
                  <h4 className="font-semibold mb-3">O que está incluído:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Até 500 fotos por mês
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      2 eventos escolares
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Galerias básicas de fotos
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Suporte por email
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Acesso ao app móvel
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Analytics básico
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Downloads com marca d&apos;água
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-muted-foreground">Limitações:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Marca do Photo Manager</li>
                    <li>• Apenas templates padrão</li>
                    <li>• Armazenamento limitado (5GB)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Plano Profissional */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">★ Mais Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">☆ Profissional</CardTitle>
                <div className="text-4xl font-bold text-foreground">R$ 249</div>
                <p className="text-muted-foreground">por mês</p>
                <p className="text-sm text-muted-foreground">Para negócios de fotografia em crescimento</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Iniciar Teste Grátis
                </Button>
                
                <div>
                  <h4 className="font-semibold mb-3">O que está incluído:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Fotos ilimitadas
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Eventos escolares ilimitados
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Galerias com marca personalizada
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Suporte prioritário por email
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      App móvel + plataforma web
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Analytics e relatórios avançados
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Downloads HD sem marca d&apos;água
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Processamento de pagamentos integrado
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Campanhas de email marketing
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Suporte a domínio personalizado
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Ferramentas de gestão de clientes
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Plano Enterprise */}
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">⚡ Enterprise</CardTitle>
                <div className="text-4xl font-bold text-foreground">R$ 749</div>
                <p className="text-muted-foreground">por mês</p>
                <p className="text-sm text-muted-foreground">Para grandes estúdios e agências de fotografia</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Falar com Vendas
                </Button>
                
                <div>
                  <h4 className="font-semibold mb-3">O que está incluído:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Tudo do Profissional
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Contas multi-fotógrafo
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Solução white-label
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Suporte 24/7 por telefone e chat
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Integrações personalizadas
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Automação avançada de workflow
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Processamento em lote de fotos
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Acesso à API
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Contratos e formulários personalizados
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Recursos de segurança avançados
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Gerente de conta dedicado
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Onboarding personalizado
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer dos preços */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos os planos incluem 14 dias de teste grátis. Não é necessário cartão de crédito.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Cancele a qualquer momento
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Sem taxas de configuração
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Suporte 24/7
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                99,9% de disponibilidade
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-muted-foreground">
              Tem dúvidas? Precisa de uma demonstração? Nossa equipe está aqui para ajudar você a ter sucesso com seu negócio de fotografia escolar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulário de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Envie uma Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nome</label>
                    <Input placeholder="João" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Sobrenome</label>
                    <Input placeholder="Silva" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="fotografo@exemplo.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone (Opcional)</label>
                  <Input placeholder="+55 (11) 99999-9999" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tipo de Consulta</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de consulta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Solicitar Demonstração</SelectItem>
                      <SelectItem value="support">Suporte Técnico</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="partnership">Parceria</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Mensagem</label>
                  <Textarea 
                    placeholder="Conte-nos sobre seu negócio de fotografia e como podemos ajudar..."
                    rows={4}
                  />
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Enviar Mensagem
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Retornaremos em até 24 horas nos dias úteis.
                </p>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Como nos Encontrar</h3>
              
              {/* Suporte por Email */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Suporte por Email</h4>
                      <p className="text-muted-foreground mb-2">Obtenha ajuda da nossa equipe de suporte</p>
                      <a href="mailto:suporte@photomanager.com.br" className="text-primary hover:underline">
                        suporte@photomanager.com.br
                      </a>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="mr-2">🕐</span>
                        Resposta 24/7 em até 2 horas
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suporte por Telefone */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Suporte por Telefone</h4>
                      <p className="text-muted-foreground mb-2">Fale diretamente com nossos especialistas</p>
                      <a href="tel:+5511999999999" className="text-primary hover:underline">
                        +55 (11) 99999-9999
                      </a>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="mr-2">🕐</span>
                        Seg-Sex, 9h às 18h BRT
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat ao Vivo */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <MessageCircle className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Chat ao Vivo</h4>
                      <p className="text-muted-foreground mb-2">Converse conosco em tempo real</p>
                      <span className="text-primary">Disponível no site</span>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="mr-2">🕐</span>
                        Seg-Sex, 9h às 21h BRT
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Localização */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Localização do Escritório</h4>
                      <div className="text-muted-foreground mt-2">
                        <p>Rua da Fotografia, 123</p>
                        <p>Distrito Criativo</p>
                        <p>Curitiba, PR 80230-000</p>
                        <p>Brasil</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ajuda Imediata */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Precisa de Ajuda Imediata?</h4>
                  <p className="text-muted-foreground mb-4">
                    Confira nossa central de ajuda abrangente com tutoriais, perguntas frequentes e documentação.
                  </p>
                  <Button variant="outline" className="w-full">
                    Visitar Central de Ajuda
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-foreground-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Photo Manager</span>
              </div>
              <p className="text-muted-foreground mb-4">
                A plataforma completa para eventos de fotografia escolar. Simplifique seu fluxo de trabalho, 
                aumente as vendas e ofereça experiências excepcionais para escolas e pais.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 hover:text-primary cursor-pointer" />
                <Twitter className="h-5 w-5 hover:text-primary cursor-pointer" />
                <Instagram className="h-5 w-5 hover:text-primary cursor-pointer" />
                <Linkedin className="h-5 w-5 hover:text-primary cursor-pointer" />
                <Youtube className="h-5 w-5 hover:text-primary cursor-pointer" />
              </div>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">App Móvel</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Casos de Sucesso</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Imprensa</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Parceiros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">LGPD</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Segurança</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Política de Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Photo Manager. Todos os direitos reservados. Desenvolvido pela MaKarispo Tecnologia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}