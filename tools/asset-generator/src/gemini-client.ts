import { readFile } from 'node:fs/promises';
import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';
import { resolve, dirname, extname } from 'node:path';
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

function mimeTypeForPath(path: string): string {
  switch (extname(path).toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

function extractImageBuffer(response: Awaited<
  ReturnType<InstanceType<typeof GoogleGenAI>['models']['generateContent']>
>): Buffer {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  throw new Error('No image returned from model. Response may be text-only.');
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

  return extractImageBuffer(response);
}

/** Image-to-image refinement — source image must be sent as inline base64 (not Files API). */
export async function refineImage(
  sourcePath: string,
  prompt: string,
  model = DEFAULT_MODEL,
): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const imageBytes = await readFile(sourcePath);
  const mimeType = mimeTypeForPath(sourcePath);

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBytes.toString('base64'),
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  return extractImageBuffer(response);
}
