import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { customPrompt } from '@/lib/db/schema';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

const promptSchema = z.object({
  name: z.string().min(1).max(255),
  content: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const prompts = await db.query.customPrompt.findMany({
      orderBy: [desc(customPrompt.createdAt)],
    });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = promptSchema.parse(body);
    
    const newPrompt = await db
      .insert(customPrompt)
      .values(validatedData)
      .returning();

    return NextResponse.json(newPrompt[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid prompt data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
} 