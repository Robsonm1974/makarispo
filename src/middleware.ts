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
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/callback',
    '/onboarding',
    '/lgpd',
    '/politica-de-privacidade',
    '/termos-de-servico'
  ]
  
  // Verificação mais robusta para rotas públicas
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname) || 
                       req.nextUrl.pathname.startsWith('/fotografo/') ||
                       req.nextUrl.pathname === '/'

  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    return res
  }

  // Se não está autenticado e não é rota pública, redirecionar para login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Se está autenticado, verificar se tem tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('id', session.user.id)
    .single()

  // Se não tem tenant, redirecionar para onboarding
  if (!tenant && req.nextUrl.pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // Se tem tenant e está tentando acessar login/onboarding, redirecionar para dashboard
  if (tenant && (req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
