import { openai, MODEL_GPT4O } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: MODEL_GPT4O,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt || '请详细描述这张图片的内容' },
            {
              type: 'image_url',
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 1024,
    });

    return NextResponse.json({
      result: response.choices[0].message.content,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
