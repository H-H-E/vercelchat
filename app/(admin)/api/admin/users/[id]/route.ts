import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { user } from '@/lib/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await db
      .select({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, params.id))
      .limit(1);

    if (!userData[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = userUpdateSchema.parse(body);
    
    // Prepare update data
    const updateData: any = {};
    
    if (validatedData.email) {
      updateData.email = validatedData.email;
    }
    
    if (validatedData.password) {
      const salt = genSaltSync(10);
      updateData.password = hashSync(validatedData.password, salt);
    }
    
    if (validatedData.isAdmin !== undefined) {
      updateData.isAdmin = validatedData.isAdmin;
    }
    
    const updatedUser = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, params.id))
      .returning({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });

    if (!updatedUser[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedUser = await db
      .delete(user)
      .where(eq(user.id, params.id))
      .returning({
        id: user.id,
      });

    if (!deletedUser[0]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 