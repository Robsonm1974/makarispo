'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Building2, Globe, Settings, ShoppingCart } from 'lucide-react'
interface TenantSettingsForm {
  slug: string | null
  whatsapp: string | null
  logo_url: string | null
}

export default function SettingsPage() {
  const { user, tenant, refreshTenant } = useAuth()
  const [form, setForm] = useState<TenantSettingsForm>({ slug: null, whatsapp: null, logo_url: null })
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    if (tenant) {
      setForm({
        slug: tenant.slug ?? null,
        whatsapp: tenant.whatsapp ?? null,
        logo_url: tenant.logo_url ?? null,
      })
    }
  }, [tenant])

  const handleChange = (key: keyof TenantSettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSavePublicPage = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ 
          slug: form.slug, 
          whatsapp: form.whatsapp, 
          logo_url: form.logo_url 
        })
        .eq('id', user.id)

      if (error) throw error
      
      // Atualizar cache do tenant
      await refreshTenant()
      
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
      <div className="page-content">
        <div className="page-header-section">
          <h1 className="page-header">Configurações</h1>
          <p className="page-description">Gerencie as configurações do Photo Manager.</p>
        </div>

        <div className="grid-content section-spacing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5 text-primary" />
                Página Pública do Fotógrafo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug público</Label>
                  <Input id="slug" placeholder="meu-estudio" value={form.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1">URL: {form.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/fotografo/${form.slug}` : 'defina um slug'}</p>
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp para solicitações de QR</Label>
                  <Input id="whatsapp" placeholder="(11) 90000-0000" value={form.whatsapp || ''} onChange={(e) => handleChange('whatsapp', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="logo_url">Logo (URL pública)</Label>
                  <Input id="logo_url" placeholder="https://..." value={form.logo_url || ''} onChange={(e) => handleChange('logo_url', e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSavePublicPage} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="h-5 w-5 text-primary" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Plano atual: <Badge variant="secondary">{tenant?.plan || 'gratuito'}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Versão do app: 0.1.0</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid-content section-spacing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5 text-primary" />
                E‑commerce (Pagamento)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              Integrações previstas: PagSeguro, Mercado Pago. Configure suas chaves na próxima etapa (em breve).
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building2 className="h-5 w-5 text-primary" />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              Cada tenant cria seus próprios produtos (nome, preço, descrição e imagem). Usaremos a tabela existente `products`.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}


