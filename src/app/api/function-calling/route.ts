import { openai, MODEL_GPT4O } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

const functions = [
  {
    name: 'get_weather',
    description: '获取指定城市的天气信息',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: '城市名称' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'], description: '温度单位' },
      },
      required: ['city'],
    },
  },
  {
    name: 'calculate',
    description: '执行数学计算',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: '数学表达式，如 2+2*3' },
      },
      required: ['expression'],
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: MODEL_GPT4O,
      messages: [{ role: 'user', content: message }],
      functions,
      function_call: 'auto',
    });

    const choice = response.choices[0];

    if (choice.message.function_call) {
      const funcName = choice.message.function_call.name;
      const args = JSON.parse(choice.message.function_call.arguments);

      let result;
      if (funcName === 'get_weather') {
        result = {
          city: args.city,
          temperature: Math.floor(Math.random() * 30) + 5,
          unit: args.unit || 'celsius',
          condition: ['晴天', '多云', '小雨', '阴天'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 60) + 30,
        };
      } else if (funcName === 'calculate') {
        try {
          // eslint-disable-next-line no-eval
          const evalResult = Function(`"use strict"; return (${args.expression})`)();
          result = { expression: args.expression, result: evalResult };
        } catch {
          result = { expression: args.expression, error: 'Invalid expression' };
        }
      }

      const finalResponse = await openai.chat.completions.create({
        model: MODEL_GPT4O,
        messages: [
          { role: 'user', content: message },
          choice.message,
          { role: 'function', name: funcName, content: JSON.stringify(result) },
        ],
      });

      return NextResponse.json({
        functionCalled: funcName,
        functionArgs: args,
        functionResult: result,
        response: finalResponse.choices[0].message.content,
      });
    }

    return NextResponse.json({
      functionCalled: null,
      response: choice.message.content,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
