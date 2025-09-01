'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { useEvents } from '@/hooks/useEvents'
import { useParticipants } from '@/hooks/useParticipants'
import { useSchools } from '@/hooks/useSchools'
import { 
  Calendar, 
  Users, 
  Building2, 
  Image, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalEvents: number
  totalParticipants: number
  totalSchools: number
  totalPhotos: number
  recentEvents: Array<{
    id: string
    name: string
    event_date: string | null
    participant_count: number
    school: {
      name: string
      type: string
    }
  }>
  recentParticipants: Array<{
    id: string
    name: string
    class: string | null
    event: {
      name: string
      school: {
        name: string
        type: string
      }
    }
  }>
}

export default function DashboardPage() {
  const { user, tenant } = useAuth()
  const { events, loading: eventsLoading } = useEvents()
  const { participants, loading: participantsLoading } = useParticipants()
  const { schools, loading: schoolsLoading } = useSchools()
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalParticipants: 0,
    totalSchools: 0,
    totalPhotos: 0,
    recentEvents: [],
    recentParticipants: []
  })

  useEffect(() => {
    if (events && participants && schools) {
      // Calcular estatísticas
      const totalEvents = events.length
      const totalParticipants = participants.length
      const totalSchools = schools.length
      
      // Fotos mockadas por enquanto (será implementado depois)
      const totalPhotos = participants.length * 3 // Estimativa

      // Eventos recentes com contagem de participantes
      const recentEvents = events
        .slice(0, 5)
        .map(event => {
          const participantCount = participants.filter(p => p.event_id === event.id).length
          const school = schools.find(s => s.id === event.school_id)
          return {
            id: event.id,
            name: event.name,
            event_date: event.event_date,
            participant_count: participantCount,
            school: {
              name: school?.name || 'Escola não encontrada',
              type: school?.type || 'tipo_desconhecido'
            }
          }
        })
        .sort((a, b) => {
          if (!a.event_date || !b.event_date) return 0
          return new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        })

      // Participantes recentes com informações do evento e escola
      const recentParticipants = participants
        .slice(0, 5)
        .map(participant => {
          const event = events.find(e => e.id === participant.event_id)
          const school = event ? schools.find(s => s.id === event.school_id) : null
          return {
            id: participant.id,
            name: participant.name,
            class: participant.class,
            event: {
              name: event?.name || 'Evento não encontrado',
              school: {
                name: school?.name || 'Escola não encontrada',
                type: school?.type || 'tipo_desconhecido'
              }
            }
          }
        })
        .sort((a, b) => {
          // Ordenar por data de criação (mais recentes primeiro)
          return 0 // Por enquanto, manter ordem original
        })

      setStats({
        totalEvents,
        totalParticipants,
        totalSchools,
        totalPhotos,
        recentEvents,
        recentParticipants
      })
    }
  }, [events, participants, schools])

  if (!user || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
        </div>
      </div>
    )
  }

  const loading = eventsLoading || participantsLoading || schoolsLoading

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {tenant.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus eventos, participantes e fotos em um só lugar.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Eventos criados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                Participantes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalSchools}</div>
              <p className="text-xs text-muted-foreground">
                Escolas parceiras
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Fotos</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.totalPhotos}</div>
              <p className="text-xs text-muted-foreground">
                Fotos capturadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/events">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Gerenciar Eventos
                </CardTitle>
                <CardDescription>
                  Crie e gerencie seus eventos fotográficos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Eventos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/participants">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciar Participantes
                </CardTitle>
                <CardDescription>
                  Cadastre e organize os participantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Participantes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/photos">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gerenciar Fotos
                </CardTitle>
                <CardDescription>
                  Upload e organização de fotos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Ver Fotos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Eventos Recentes
              </CardTitle>
              <CardDescription>
                Últimos eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : stats.recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{event.school.name}</span>
                          <Badge variant="secondary">{event.school.type}</Badge>
                        </div>
                        {event.event_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.event_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {event.participant_count}
                        </div>
                        <p className="text-xs text-gray-500">participantes</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Crie seu primeiro evento para começar a capturar fotos
                  </p>
                  <Link href="/dashboard/events">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Evento
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes Recentes
              </CardTitle>
              <CardDescription>
                Últimos participantes cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : stats.recentParticipants.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{participant.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{participant.event.name}</span>
                          <Badge variant="secondary">{participant.event.school.type}</Badge>
                        </div>
                        {participant.class && (
                          <p className="text-xs text-gray-500 mt-1">
                            Turma: {participant.class}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          ✓
                        </div>
                        <p className="text-xs text-gray-500">cadastrado</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum participante ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Cadastre participantes para seus eventos
                  </p>
                  <Link href="/dashboard/participants">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Participante
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visão Geral de Receita
            </CardTitle>
            <CardDescription>
              Resumo financeiro dos eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  R$ {loading ? '0,00' : '0,00'}
                </div>
                <p className="text-sm text-gray-600">Receita Total</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {loading ? '0' : '0'}
                </div>
                <p className="text-sm text-gray-600">Fotos Vendidas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  R$ {loading ? '0,00' : '0,00'}
                </div>
                <p className="text-sm text-gray-600">Comissão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}