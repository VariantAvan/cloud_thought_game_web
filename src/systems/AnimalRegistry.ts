import { assetPath } from '../assets/assetPath';
import type { AnimalEntry } from '../types';

export const ANIMALS: Record<string, AnimalEntry> = {
  a: { name: 'Ant', image: assetPath('assets/animals/ant.png'), emoji: '🐜' },
  b: { name: 'Bear', image: assetPath('assets/animals/bear.png'), emoji: '🐻' },
  c: { name: 'Cat', image: assetPath('assets/animals/cat.png'), emoji: '🐱' },
  d: { name: 'Dog', image: assetPath('assets/animals/dog.png'), emoji: '🐕' },
  e: { name: 'Elephant', image: assetPath('assets/animals/elephant.png'), emoji: '🐘' },
  f: { name: 'Fox', image: assetPath('assets/animals/fox.png'), emoji: '🦊' },
  g: { name: 'Giraffe', image: assetPath('assets/animals/giraffe.png'), emoji: '🦒' },
  h: { name: 'Horse', image: assetPath('assets/animals/horse.png'), emoji: '🐴' },
  i: { name: 'Iguana', image: assetPath('assets/animals/iguana.png'), emoji: '🦎' },
  j: { name: 'Jellyfish', image: assetPath('assets/animals/jellyfish.png'), emoji: '🪼' },
  k: { name: 'Koala', image: assetPath('assets/animals/koala.png'), emoji: '🐨' },
  l: { name: 'Lion', image: assetPath('assets/animals/lion.png'), emoji: '🦁' },
  m: { name: 'Monkey', image: assetPath('assets/animals/monkey.png'), emoji: '🐵' },
  n: { name: 'Newt', image: assetPath('assets/animals/newt.png'), emoji: '🦎' },
  o: { name: 'Owl', image: assetPath('assets/animals/owl.png'), emoji: '🦉' },
  p: { name: 'Penguin', image: assetPath('assets/animals/penguin.png'), emoji: '🐧' },
  q: { name: 'Quail', image: assetPath('assets/animals/quail.png'), emoji: '🐦' },
  r: { name: 'Rabbit', image: assetPath('assets/animals/rabbit.png'), emoji: '🐰' },
  s: { name: 'Snake', image: assetPath('assets/animals/snake.png'), emoji: '🐍' },
  t: { name: 'Tiger', image: assetPath('assets/animals/tiger.png'), emoji: '🐯' },
  u: { name: 'Unicorn', image: assetPath('assets/animals/unicorn.png'), emoji: '🦄' },
  v: { name: 'Vulture', image: assetPath('assets/animals/vulture.png'), emoji: '🦅' },
  w: { name: 'Whale', image: assetPath('assets/animals/whale.png'), emoji: '🐋' },
  x: { name: 'X-ray fish', image: assetPath('assets/animals/xray-fish.png'), emoji: '🐟' },
  y: { name: 'Yak', image: assetPath('assets/animals/yak.png'), emoji: '🐂' },
  z: { name: 'Zebra', image: assetPath('assets/animals/zebra.png'), emoji: '🦓' },
};

export function getAnimal(letter: string): AnimalEntry {
  const key = letter.toLowerCase();
  return (
    ANIMALS[key] ?? {
      name: 'Unknown',
      image: '',
      emoji: '❓',
    }
  );
}

export function getAllAnimalLetters(): string[] {
  return Object.keys(ANIMALS);
}
