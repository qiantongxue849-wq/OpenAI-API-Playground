import { openai } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard' } = await req.json();

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: size as '1024x1024' | '1024x1792' | '1792x1024',
      quality: quality as 'standard' | 'hd',
      n: 1,
    });

    return NextResponse.json({
      image: response.data?.[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
