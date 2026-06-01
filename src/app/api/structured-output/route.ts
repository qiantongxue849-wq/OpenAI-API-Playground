import { openai, MODEL_GPT4O } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, schema } = await req.json();

    const schemas: Record<string, unknown> = {
      person: {
        name: 'extract_person',
        description: '提取人物信息',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
            occupation: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
          },
          required: ['name'],
        },
      },
      product: {
        name: 'extract_product',
        description: '提取产品信息',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            category: { type: 'string' },
            features: { type: 'array', items: { type: 'string' } },
          },
          required: ['name', 'price'],
        },
      },
      sentiment: {
        name: 'analyze_sentiment',
        description: '分析情感',
        parameters: {
          type: 'object',
          properties: {
            sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
            score: { type: 'number' },
            keywords: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' },
          },
          required: ['sentiment', 'score'],
        },
      },
    };

    const selectedSchema = schemas[schema as keyof typeof schemas] || schemas.person;

    const response = await openai.chat.completions.create({
      model: MODEL_GPT4O,
      messages: [
        {
          role: 'system',
          content: '请从用户提供的文本中提取信息，并以JSON格式返回。',
        },
        { role: 'user', content: text },
      ],
      functions: [selectedSchema as { name: string; description: string; parameters: Record<string, unknown> }],
      function_call: { name: (selectedSchema as { name: string }).name },
    });

    const result = JSON.parse(response.choices[0].message.function_call?.arguments || '{}');

    return NextResponse.json({
      schema: (selectedSchema as { name: string }).name,
      result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
