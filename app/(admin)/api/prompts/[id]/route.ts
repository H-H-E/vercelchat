import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { customPrompt } from '@/lib/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const promptSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await db.query.customPrompt.findFirst({
      where: eq(customPrompt.id, params.id),
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
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
    const validatedData = promptSchema.parse(body);

    const updatedPrompt = await db
      .update(customPrompt)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(customPrompt.id, params.id))
      .returning();

    if (!updatedPrompt[0]) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPrompt[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid prompt data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedPrompt = await db
      .delete(customPrompt)
      .where(eq(customPrompt.id, params.id))
      .returning();

    if (!deletedPrompt[0]) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 