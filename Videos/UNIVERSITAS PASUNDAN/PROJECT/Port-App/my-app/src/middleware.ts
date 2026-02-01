import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookie (kita beri nama 'admin_token')
  const token = request.cookies.get('admin_token');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Jika mencoba akses /admin tapi tidak punya token
  if (isAdminPage && !token) {
    // Redirect ke halaman login buatan kita nanti
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang ingin diproteksi
export const config = {
  matcher: ['/admin/:path*'],
};