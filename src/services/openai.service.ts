import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function* OpenAIStream(messages: any[]): AsyncGenerator<string> {
    const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        stream: true,
    });
    for await (const part of stream) {
        const content = part.choices[0]?.delta?.content;
        if (content) yield content;
    }
}
