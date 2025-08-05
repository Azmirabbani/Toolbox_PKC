import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Debug log untuk melihat request
  console.log('Middleware running for:', request.nextUrl.pathname)
  
  // Ambil token dari cookies
  const token = request.cookies.get('auth-token')?.value
  
  // Definisikan routes yang perlu auth (hapus /dashboard karena tidak ada)
  const protectedRoutes = ['/tasks', '/meetings', '/settings', '/team']
  const authRoutes = ['/auth/signin', '/auth/signup']
  
  const { pathname } = request.nextUrl
  
  // Jika user belum login dan mencoba akses protected routes
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔒 Redirecting to signin - no token found')
    const signinUrl = new URL('/auth/signin', request.url)
    return NextResponse.redirect(signinUrl)
  }
  
  // Jika user sudah login dan mencoba akses auth pages
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    console.log('✅ Redirecting to home - user already logged in')
    const homeUrl = new URL('/', request.url)
    return NextResponse.redirect(homeUrl)
  }
  
  // Redirect root ke signin jika belum login
  if (pathname === '/' && !token) {
    console.log('🏠 Redirecting root to signin')
    const signinUrl = new URL('/auth/signin', request.url)
    return NextResponse.redirect(signinUrl)
  }
  
  // Jika sudah login dan akses root, biarkan lewat (tidak redirect)
  // Karena root (/) sudah ada konten dashboard
  
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