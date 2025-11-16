import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Use Next.js API route (relative URL) - middleware runs in Next.js runtime
// This will be proxied to backend via /api/backend/account route
async function fetchUser(req: NextRequest) {
  try {
    // Build absolute URL for the Next.js API route
    const url = new URL('/api/backend/account', req.url);
    const res = await fetch(url, {
      headers: { cookie: req.headers.get('cookie') || '' },
      cache: 'no-store',
    });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!['/login', '/dashboard', '/onboarding', '/pos'].some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const user: any = await fetchUser(req);

  // /login redirects if authenticated
  if (pathname.startsWith('/login')) {
    if (user) {
      return NextResponse.redirect(new URL(user.needsOnboarding ? '/onboarding' : '/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protected routes: /dashboard, /onboarding, /pos
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/pos')) && user.needsOnboarding) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  if (pathname.startsWith('/onboarding') && user.needsOnboarding === false) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/onboarding/:path*', '/pos/:path*'],
};
