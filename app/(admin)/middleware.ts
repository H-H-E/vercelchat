import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUser } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function isAdmin(email: string) {
  const admin = await db.query.adminUser.findFirst({
    where: eq(adminUser.email, email),
  });
  return !!admin;
}

export async function middleware(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    const signInUrl = new URL('/login', request.url);
    signInUrl.searchParams.append('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  const isUserAdmin = await isAdmin(session.user.email);
  if (!isUserAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 