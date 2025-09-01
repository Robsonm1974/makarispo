'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const { user, tenant, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PHOTOMANAGER</h1>
              <p className="text-gray-600">Dashboard</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {tenant?.name}!</CardTitle>
            <CardDescription>
              Seu painel de controle está sendo preparado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Plano:</strong> {tenant?.plan}
              </div>
              <div>
                <strong>Slug:</strong> {tenant?.slug}
              </div>
              <div>
                <strong>Cidade:</strong> {tenant?.city}, {tenant?.state}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}