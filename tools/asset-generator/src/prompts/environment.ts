import { buildPrompt } from '../style-guide.js';

export function treePrompt(): string {
  return buildPrompt(
    'Single oak tree side view with brown trunk and green leafy canopy, game environment sprite, centered.',
  );
}

export function personPrompt(): string {
  return buildPrompt(
    'A relaxed person lying on grass under a tree, side view, head visible and facing slightly upward, casual clothes, game character sprite.',
  );
}

export function cloudPrompt(index: number): string {
  return buildPrompt(
    `Fluffy white cartoon cloud variant ${index + 1}, soft edges, isolated on transparent background, game sprite.`,
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
