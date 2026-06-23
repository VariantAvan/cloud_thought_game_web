import { buildPrompt } from '../style-guide.js';

export const ANIMALS: Record<string, string> = {
  a: 'ant',
  b: 'bear',
  c: 'cat',
  d: 'dog',
  e: 'elephant',
  f: 'fox',
  g: 'giraffe',
  h: 'horse',
  i: 'iguana',
  j: 'jellyfish',
  k: 'koala',
  l: 'lion',
  m: 'monkey',
  n: 'newt',
  o: 'owl',
  p: 'penguin',
  q: 'quail',
  r: 'rabbit',
  s: 'snake',
  t: 'tiger',
  u: 'unicorn',
  v: 'vulture',
  w: 'whale',
  x: 'x-ray fish',
  y: 'yak',
  z: 'zebra',
};

export function animalPrompt(name: string): string {
  return buildPrompt(
    `Single cute ${name} facing right, centered, game sprite, full body visible, isolated on transparent or white background.`,
  );
}

export function getAnimalFileName(letter: string): string {
  const key = letter.toLowerCase();
  const name = ANIMALS[key];
  if (!name) throw new Error(`Unknown letter: ${letter}`);
  return name === 'x-ray fish' ? 'xray-fish' : name;
}
