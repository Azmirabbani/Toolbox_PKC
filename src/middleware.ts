import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Debug log untuk melihat request
  console.log('Middleware running for:', request.nextUrl.pathname)
  
  // Ambil token dari cookies
  const token = request.cookies.get('auth-token')?.value
  
  // Definisikan routes yang perlu auth
  const protectedRoutes = ['/dashboard', '/tasks', '/meetings', '/settings', '/team', '/attendance']
  
  const { pathname } = request.nextUrl
  
  // Jika user belum login dan mencoba akses protected routes
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔒 Redirecting to login - no token found')
    const loginUrl = new URL('/', request.url) // Redirect ke root (login page)
    return NextResponse.redirect(loginUrl)
  }
  
  // Jika user sudah login dan akses root, redirect ke dashboard
  if (token && pathname === '/') {
    console.log('✅ Redirecting to dashboard - user already logged in')
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  console.log('✨ Middleware allowing request to continue')
  return NextResponse.next()
}

// Konfigurasi matcher - tentukan path mana yang akan diproses middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}