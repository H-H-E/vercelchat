import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export async function middleware(request: NextRequest) {
  // Run the auth middleware for all routes
  const authMiddleware = await auth();
  
  // Check if the user is accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    // If not authenticated, redirect to login
    if (!authMiddleware?.user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Optional: Check if the user has admin privileges
    // For now, we're allowing any authenticated user
    // In production you would want to check a role or permission
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register', '/admin/:path*', '/api/admin/:path*'],
};
