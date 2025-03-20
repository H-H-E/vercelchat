import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { StreamingTextResponse } from 'ai/streaming';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { db } from '@/lib/db/index';
import { message } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const maxDuration = 60;

export async function POST(request: Request) {
  const json = await request.json();
  const { messages, previewToken, selectedChatModel } = json;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const systemPromptText = await systemPrompt();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${previewToken || process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: selectedChatModel,
      messages: [
        { role: 'system', content: systemPromptText },
        ...messages,
      ],
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    return new Response('Error', { status: response.status });
  }

  const stream = response.body;
  if (!stream) {
    return new Response('No stream', { status: 500 });
  }

  const chatId = nanoid();
  const messageId = nanoid();

  const saveMessage = async (content: string) => {
    await db.insert(message).values({
      id: messageId,
      chatId,
      role: 'assistant',
      parts: [{ type: 'text', text: content }],
      attachments: [],
      createdAt: new Date(),
    });
  };

  return new StreamingTextResponse(stream, {
    onCompletion: async (completion: string) => {
      await saveMessage(completion);
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  await db.delete(message).where(eq(message.id, id));

  return new Response('OK');
}
