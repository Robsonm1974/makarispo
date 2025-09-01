'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { user, tenant } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          router.push('/auth/login')
          return
        }

        if (session?.user) {
          // Verificar se o tenant existe
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (tenantData) {
            // Tenant existe, redirecionar para dashboard
            router.push('/dashboard')
          } else {
            // Tenant não existe, redirecionar para onboarding
            router.push('/onboarding')
          }
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erro no callback:', error)
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando...</p>
      </div>
    </div>
  )
}