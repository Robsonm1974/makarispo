import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/callback', '/onboarding']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Se não está autenticado e não é rota pública, redirecionar para login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Se está autenticado mas não tem tenant e não está no onboarding
  if (session && !isPublicRoute && req.nextUrl.pathname !== '/onboarding') {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!tenant) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // Se está autenticado e tem tenant, mas está tentando acessar login/onboarding
  if (session && (req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/onboarding')) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (tenant) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}