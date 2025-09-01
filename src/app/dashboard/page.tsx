'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSchools } from '@/hooks/useSchools'
import { useEvents } from '@/hooks/useEvents'
import { useParticipants } from '@/hooks/useParticipants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, LogOut, Building2, Calendar, Users, Image } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, tenant, signOut } = useAuth()
  const { schools } = useSchools()
  const { events } = useEvents()
  const { participants } = useParticipants()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const menuItems = [
    {
      title: 'Escolas',
      description: 'Gerencie as escolas onde você trabalha',
      icon: Building2,
      href: '/dashboard/schools',
      color: 'bg-blue-500'
    },
    {
      title: 'Eventos',
      description: 'Crie e gerencie sessões fotográficas',
      icon: Calendar,
      href: '/dashboard/events',
      color: 'bg-green-500'
    },
    {
      title: 'Participantes',
      description: 'Gerencie alunos e participantes',
      icon: Users,
      href: '/dashboard/participants',
      color: 'bg-purple-500'
    },
    {
      title: 'Fotos',
      description: 'Upload e gerenciamento de fotos',
      icon: Image,
      href: '/dashboard/photos',
      color: 'bg-orange-500',
      disabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Camera className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">PHOTOMANAGER</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Olá, {tenant?.name || 'Usuário'}
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta, {tenant?.name || 'Usuário'}!
            </h2>
            <p className="text-gray-600">
              Gerencie suas sessões fotográficas escolares de forma simples e eficiente.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escolas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schools.length}</div>
                <p className="text-xs text-muted-foreground">
                  Escolas cadastradas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">
                  Eventos criados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{participants.length}</div>
                <p className="text-xs text-muted-foreground">
                  Participantes cadastrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fotos</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Fotos enviadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Menu Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.disabled ? '#' : item.href}>
                  <Card className={`hover:shadow-md transition-shadow ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="flex space-x-4">
              <Link href="/dashboard/schools">
                <Button>
                  <Building2 className="h-4 w-4 mr-2" />
                  Adicionar Escola
                </Button>
              </Link>
              <Link href="/dashboard/events">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Evento
                </Button>
              </Link>
              <Link href="/dashboard/participants">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Participante
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}