export const STYLE_GUIDE =
  'Soft watercolor children\'s book illustration, peaceful sunny meadow, gentle pastel colors, simple clean shapes, solid flat chroma blue screen (#00B4FF) or plain white background, no text, no watermark, friendly and calm mood.';

export function buildPrompt(categorySuffix: string): string {
  return `${STYLE_GUIDE} ${categorySuffix}`;
}
