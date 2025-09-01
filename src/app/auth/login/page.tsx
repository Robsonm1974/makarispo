'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera } from 'lucide-react'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Erro no login:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">PHOTOMANAGER</CardTitle>
          <CardDescription>
            Faça login para acessar sua conta de fotógrafo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <div className="mr-2">G</div>
            )}
            Continuar com Google
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Não tem uma conta?</p>
            <p>O cadastro é automático após o primeiro login</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}