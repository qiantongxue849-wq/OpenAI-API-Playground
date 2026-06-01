import OpenAI from 'openai';

let _openai: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

export const openai = {
  get chat() { return getOpenAIClient().chat; },
  get images() { return getOpenAIClient().images; },
  get audio() { return getOpenAIClient().audio; },
};

export const MODEL_GPT4O = 'gpt-4o';
export const MODEL_GPT4O_MINI = 'gpt-4o-mini';
