import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../../../.env') });

export const DEFAULT_MODEL = 'gemini-2.5-flash-image';
export const BATCH_MODEL = 'gemini-2.5-flash-image';

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY not set. Copy tools/asset-generator/.env.example to .env and add your key.',
    );
  }
  return key;
}

export async function generateImage(prompt: string, model = DEFAULT_MODEL): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }

  throw new Error(`No image returned from model ${model}. Response may be text-only.`);
}
