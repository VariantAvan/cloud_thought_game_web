import { buildPrompt } from '../style-guide.js';

export function treePrompt(): string {
  return buildPrompt(
    [
      'Single oak tree side view, brown trunk and lush green leafy canopy,',
      'game environment sprite, tall vertical composition with trunk base at the bottom of the image,',
      'tree only — no grass, no meadow, no person, no scenery;',
      'solid flat bright chroma blue screen background (#00B4FF), evenly lit with no shadows on the backdrop.',
    ].join(' '),
  );
}

/** Iterative edits on an existing tree draft (image-to-image via Nano Banana). */
export function treeRefinePrompt(notes: string): string {
  const base = [
    'Refine this game tree sprite for a children\'s meadow scene.',
    'Keep side view with trunk base at the bottom, soft watercolor style, gentle pastel greens and browns.',
    'Keep a solid flat chroma blue screen (#00B4FF) or plain white background — no scenery.',
    'Do not add grass, people, text, or watermarks.',
  ].join(' ');

  return notes.trim() ? `${base} ${notes.trim()}` : base;
}

export function cloudPrompt(index: number): string {
  return buildPrompt(
    [
      `Single isolated fluffy white cartoon cloud only, variant ${index + 1}, soft rounded edges,`,
      'centered in frame, game sky sprite — cloud shape only,',
      'no ground, no hills, no trees, no grass, no flowers, no meadow, no landscape, no scenery,',
      'solid flat bright chroma blue screen background (#00B4FF), evenly lit with no shadows on the backdrop.',
    ].join(' '),
  );
}

export function grassPrompt(): string {
  return buildPrompt(
    'Seamless green grass meadow texture tile, top-down slight angle, soft watercolor style.',
  );
}

export function thoughtBubblePrompt(): string {
  return buildPrompt(
    'Empty white cartoon thought bubble with rounded shape and small tail pointing down, no text inside, UI game element.',
  );
}
