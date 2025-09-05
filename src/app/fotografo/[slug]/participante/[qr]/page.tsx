'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ShoppingCart, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Participant {
  id: string
  name: string
  turma: string | null
  tipo: string | null
  qr_code: string
  school: {
    name: string
  }
  photos: Array<{
    id: string
    filename: string
    photo_url: string
  }>
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  mockup_url: string | null
  category: string
}

interface PhotographerData {
  id: string
  name: string
  slug?: string
}

export default function ParticipantPage() {
  const { slug, qr } = useParams()
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [photographer, setPhotographer] = useState<PhotographerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Array<{
    type: 'photo' | 'product'
    id: string
    name: string
    price: number
    quantity: number
    photo_id?: string
  }>>([])

  useEffect(() => {
    if (slug && qr) {
      loadData()
    }
  }, [slug, qr]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar fotografo primeiro para obter tenant_id
      const { data: photographerData, error: photographerError } = await supabase
        .from('tenants')
        .select('id, name, slug')
        .eq('slug', slug)
        .single()

      if (photographerError) throw photographerError
      setPhotographer(photographerData)

      // Debug: Verificar dados antes da busca
      console.log('🔍 Debug busca participante:', {
        qr_code: qr,
        tenant_id: photographerData.id,
        photographer_slug: slug
      })

      // Debug: Buscar todos os participantes deste tenant para ver se existe algum
      const { data: allParticipants } = await supabase
        .from('participants')
        .select('qr_code, name, tenant_id')
        .eq('tenant_id', photographerData.id)
        .limit(5)
      
      console.log('🔍 Debug: Participantes do tenant:', allParticipants)

      // Debug: Buscar por QR sem filtrar tenant
      const { data: qrResults } = await supabase
        .from('participants')
        .select('qr_code, name, tenant_id')
        .eq('qr_code', qr)
        .limit(5)
      
      console.log('🔍 Debug: Busca por QR code:', qrResults)

      // Carregar participante com escola
      const { data: participantData, error: participantError } = await supabase
        .from('participants')
        .select(`
          id,
          name,
          turma,
          tipo,
          qr_code,
          school:schools(name)
        `)
        .eq('qr_code', qr)
        .eq('tenant_id', photographerData.id)
        .maybeSingle()

      console.log('🔍 Debug participante encontrado:', { participantData, participantError })

      if (participantError) {
        console.error('❌ Erro na busca do participante:', participantError)
        throw participantError
      }

      if (!participantData) {
        console.log('❌ Nenhum participante encontrado com este QR code')
        throw new Error('Participante não encontrado')
      }

      // Carregar fotos separadamente
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('id, filename, photo_url')
        .eq('participant_id', participantData.id)

      console.log('🔍 Debug fotos encontradas:', { photosData, photosError })

      // Combinar dados
      const participantWithPhotos = {
        ...participantData,
        photos: photosData || []
      }

      setParticipant(participantWithPhotos as Participant)

      // Carregar produtos do tenant
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', photographerData.id)
        .eq('active', true)
        .order('name')

      if (productsError) throw productsError
      setProducts(productsData || [])

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: {
    type: 'photo' | 'product'
    id: string
    name: string
    price: number
    photo_id?: string
  }) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.type === item.type && i.id === item.id && i.photo_id === item.photo_id
      )
      
      if (existing) {
        return prev.map(i => 
          i.type === item.type && i.id === item.id && i.photo_id === item.photo_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!participant || !photographer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="text-center py-8">
            <h1 className="text-xl font-semibold mb-2 text-foreground">Participante não encontrado</h1>
            <p className="text-muted-foreground">O código QR informado não foi encontrado ou não pertence a este fotógrafo.</p>
            <Link href={`/fotografo/${slug}`} className="inline-block mt-4">
              <Button variant="outline" className="hover:bg-muted/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/fotografo/${slug}`}>
                <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="border-l border-border pl-4">
                <h1 className="text-2xl font-bold text-foreground">{participant.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {participant.turma && `${participant.turma} • `}
                  {participant.school.name}
                </p>
              </div>
            </div>
            {getCartItemCount() > 0 && (
              <Button className="relative bg-primary hover:bg-primary/90">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho ({getCartItemCount()})
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
                  {getCartItemCount()}
                </Badge>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          
          {/* Hero Section */}
          <section className="pt-12 pb-16 bg-gradient-to-br from-background to-muted/20 rounded-lg">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Fotografia Escolar
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                A melhor recordação que seu filho pode ter...
              </p>
              <p className="text-lg text-primary font-semibold">
                Só depende de você!
              </p>
            </div>
          </section>

          {/* Fotos */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ImageIcon className="h-5 w-5 text-primary" />
                Fotos ({participant.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participant.photos.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma foto encontrada para este participante.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {participant.photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/30 hover:bg-card/50 transition-all duration-200">
                      <div className="relative aspect-square group">
                        <Image
                          src={photo.photo_url}
                          alt={`Foto de ${participant.name}`}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">Foto Digital</span>
                          <span className="text-sm font-bold text-primary">R$ 10,00</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => addToCart({
                            type: 'photo',
                            id: photo.id,
                            name: `Foto de ${participant.name}`,
                            price: 10.00,
                            photo_id: photo.id
                          })}
                        >
                          Adicionar ao Carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Produtos */}
          {products.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Produtos Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-card/30 backdrop-blur-sm border-border/30 hover:bg-card/50 transition-all duration-200">
                      {product.mockup_url && (
                        <div className="relative aspect-square group">
                          <Image
                            src={product.mockup_url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1 text-foreground">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => addToCart({
                              type: 'product',
                              id: product.id,
                              name: product.name,
                              price: product.price
                            })}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Carrinho */}
          {cart.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Carrinho de Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border/30 pb-3">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-lg font-bold pt-4 border-t border-border/30">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">R$ {getCartTotal().toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                    Finalizar Compra
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-border/30 pt-8">
          <p>Powered by <span className="font-semibold text-foreground">Photo Manager</span></p>
        </footer>
      </main>
    </div>
  )
}

