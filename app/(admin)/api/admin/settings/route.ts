import { NextResponse } from 'next/server';
import { z } from 'zod';

// In a real app, you would store these settings in a database
// For simplicity, we're using an in-memory object
let appSettings = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  defaultChatModel: 'gpt-4o',
  aiName: 'Poiesis Pete',
  aiDescription: 'AI tutor for Poiesis Education',
  showArtifacts: true,
};

const settingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  defaultChatModel: z.string(),
  aiName: z.string(),
  aiDescription: z.string(),
  showArtifacts: z.boolean(),
});

export async function GET() {
  try {
    // Don't expose the API key
    const publicSettings = {
      ...appSettings,
      openaiApiKey: appSettings.openaiApiKey ? '********' : '',
    };
    
    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = settingsSchema.parse(body);
    
    // Update settings
    appSettings = {
      ...appSettings,
      ...validatedData,
      // Only update API key if it's not masked and not empty
      openaiApiKey: validatedData.openaiApiKey && validatedData.openaiApiKey !== '********' 
        ? validatedData.openaiApiKey 
        : appSettings.openaiApiKey,
    };
    
    // Don't expose the API key in the response
    const publicSettings = {
      ...appSettings,
      openaiApiKey: appSettings.openaiApiKey ? '********' : '',
    };

    return NextResponse.json(publicSettings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid settings data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 