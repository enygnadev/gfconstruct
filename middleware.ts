
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ['/sistema/dashboard', '/sistema/projetos', '/sistema/orcamentos', '/sistema/clientes', '/sistema/relatorios']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // If it's a protected path, the authentication will be handled client-side
  // This middleware is mainly for future server-side auth checks
  if (isProtectedPath) {
    // For now, we'll let the client-side auth handle redirection
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sistema/:path*']
}
