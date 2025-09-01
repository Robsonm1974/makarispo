'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Camera, CheckCircle } from 'lucide-react'

const onboardingSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().optional(),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  bio: z.string().optional(),
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
})

type OnboardingForm = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const { user, refreshTenant } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema)
  })

  const watchedName = watch('name')

  // Gerar slug automaticamente baseado no nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (data: OnboardingForm) => {
    if (!user) return

    setLoading(true)
    try {
      // Verificar se o slug já existe
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', data.slug)
        .single()

      if (existingTenant) {
        alert('Este slug já está em uso. Escolha outro.')
        return
      }

      // Criar tenant
      const { error } = await supabase
        .from('tenants')
        .insert({
          id: user.id,
          email: user.email!,
          name: data.name,
          whatsapp: data.whatsapp,
          city: data.city,
          state: data.state,
          bio: data.bio,
          slug: data.slug,
          plan: 'gratuito'
        })

      if (error) {
        console.error('Erro ao criar tenant:', error)
        alert('Erro ao criar conta. Tente novamente.')
        return
      }

      // Atualizar contexto
      await refreshTenant()
      
      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no onboarding:', error)
      alert('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo ao PHOTOMANAGER!</CardTitle>
          <CardDescription>
            Vamos configurar sua conta de fotógrafo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Fotógrafo/Empresa *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: João Silva Fotografia"
                  onChange={(e) => {
                    const slug = generateSlug(e.target.value)
                    setValue('slug', slug)
                  }}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">URL Personalizada *</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">photomanager.com/</span>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="joao-silva-fotografia"
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="São Paulo"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="SP"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp')}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="bio">Sobre você</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Conte um pouco sobre sua experiência como fotógrafo..."
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Criar Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}