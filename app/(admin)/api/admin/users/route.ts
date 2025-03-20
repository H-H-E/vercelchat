import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { user } from '@/lib/db/schema';
import { z } from 'zod';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { desc } from 'drizzle-orm';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
});

export async function GET() {
  try {
    const users = await db
      .select({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = userSchema.parse(body);
    
    // Hash the password
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(validatedData.password, salt);
    
    const newUser = await db
      .insert(user)
      .values({
        email: validatedData.email,
        password: hashedPassword,
        isAdmin: validatedData.isAdmin || false,
      })
      .returning({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });

    return NextResponse.json(newUser[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 