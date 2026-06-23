import { buildPrompt } from '../style-guide.js';

/** Lying meadow character — head on the left, body extends right (matches SceneRenderer layout). */
export function personPrompt(): string {
  return buildPrompt(
    [
      'Single game character sprite of a relaxed person lying on their back in a meadow,',
      'side view from the left, head on the left side of the image and feet toward the right,',
      'face visible in profile looking slightly upward at the sky,',
      'casual blue shirt and dark pants, peaceful resting pose with arms relaxed,',
      'full body visible, wide horizontal composition roughly 2:1 aspect ratio,',
      'character only — no grass, no tree, no scenery;',
      'solid flat bright chroma blue screen background (#00B4FF), evenly lit with no shadows on the backdrop.',
    ].join(' '),
  );
}

/** Iterative edits on an existing person draft (image-to-image via Nano Banana). */
export function personRefinePrompt(notes: string): string {
  const base = [
    'Refine this game character sprite for a children\'s meadow scene.',
    'Keep the same pose: lying on back, head on the left, feet on the right, side view.',
    'Preserve soft watercolor style and gentle pastel colors.',
    'Keep a solid flat chroma blue screen (#00B4FF) or plain white background — no scenery.',
    'Do not add grass, trees, text, or watermarks.',
  ].join(' ');

  return notes.trim() ? `${base} ${notes.trim()}` : base;
}
