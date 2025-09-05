import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rotas públicas que não precisam de autenticação
const PUBLIC_PATHS = [
  '/',                           // landing page
  '/auth/login',                 // página de login
  '/auth/callback',              // callback do OAuth (NÃO bloquear)
  '/onboarding',                 // onboarding
  '/fotografo',                  // páginas públicas do fotógrafo
  '/lgpd',                       // página LGPD
  '/politica-de-privacidade',    // política de privacidade
  '/termos-de-servico',          // termos de serviço
]

// Prefixos de assets que devem passar direto
const ASSET_PREFIXES = [
  '/_next', 
  '/favicon.ico', 
  '/images', 
  '/assets', 
  '/fonts', 
  '/public',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg'
]

// Somente estas áreas exigem sessão
const PROTECTED_PREFIXES = [
  '/dashboard'
]

function startsWithAny(pathname: string, list: string[]) {
  return list.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // 1) Deixe passar se for público ou asset
  const isPublic = startsWithAny(pathname, PUBLIC_PATHS)
  const isAsset = startsWithAny(pathname, ASSET_PREFIXES)
  
  if (isPublic || isAsset) {
    return NextResponse.next()
  }

  // 2) Só checa sessão nas rotas protegidas
  const needsAuth = startsWithAny(pathname, PROTECTED_PREFIXES)
  if (!needsAuth) {
    return NextResponse.next()
  }

  // 3) Valida sessão via cookies (SSR)
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    // preserva o caminho alvo para pós-login
    const qs = searchParams.toString()
    url.searchParams.set('next', pathname + (qs ? `?${qs}` : ''))
    return NextResponse.redirect(url)
  }

  // 4) Verificar se o usuário tem tenant configurado
  if (session && pathname !== '/onboarding') {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!tenant) {
      const url = req.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  // 5) Redirecionar usuários autenticados com tenant para dashboard
  if (session && (pathname === '/auth/login' || pathname === '/onboarding')) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (tenant) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return res
}

// Intercepta tudo exceto arquivos estáticos do Next
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}