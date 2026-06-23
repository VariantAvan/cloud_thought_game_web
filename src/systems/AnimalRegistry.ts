import type { AnimalEntry } from '../types';

export const ANIMALS: Record<string, AnimalEntry> = {
  a: { name: 'Ant', image: '/assets/animals/ant.png', emoji: '🐜' },
  b: { name: 'Bear', image: '/assets/animals/bear.png', emoji: '🐻' },
  c: { name: 'Cat', image: '/assets/animals/cat.png', emoji: '🐱' },
  d: { name: 'Dog', image: '/assets/animals/dog.png', emoji: '🐕' },
  e: { name: 'Elephant', image: '/assets/animals/elephant.png', emoji: '🐘' },
  f: { name: 'Fox', image: '/assets/animals/fox.png', emoji: '🦊' },
  g: { name: 'Giraffe', image: '/assets/animals/giraffe.png', emoji: '🦒' },
  h: { name: 'Horse', image: '/assets/animals/horse.png', emoji: '🐴' },
  i: { name: 'Iguana', image: '/assets/animals/iguana.png', emoji: '🦎' },
  j: { name: 'Jellyfish', image: '/assets/animals/jellyfish.png', emoji: '🪼' },
  k: { name: 'Koala', image: '/assets/animals/koala.png', emoji: '🐨' },
  l: { name: 'Lion', image: '/assets/animals/lion.png', emoji: '🦁' },
  m: { name: 'Monkey', image: '/assets/animals/monkey.png', emoji: '🐵' },
  n: { name: 'Newt', image: '/assets/animals/newt.png', emoji: '🦎' },
  o: { name: 'Owl', image: '/assets/animals/owl.png', emoji: '🦉' },
  p: { name: 'Penguin', image: '/assets/animals/penguin.png', emoji: '🐧' },
  q: { name: 'Quail', image: '/assets/animals/quail.png', emoji: '🐦' },
  r: { name: 'Rabbit', image: '/assets/animals/rabbit.png', emoji: '🐰' },
  s: { name: 'Snake', image: '/assets/animals/snake.png', emoji: '🐍' },
  t: { name: 'Tiger', image: '/assets/animals/tiger.png', emoji: '🐯' },
  u: { name: 'Unicorn', image: '/assets/animals/unicorn.png', emoji: '🦄' },
  v: { name: 'Vulture', image: '/assets/animals/vulture.png', emoji: '🦅' },
  w: { name: 'Whale', image: '/assets/animals/whale.png', emoji: '🐋' },
  x: { name: 'X-ray fish', image: '/assets/animals/xray-fish.png', emoji: '🐟' },
  y: { name: 'Yak', image: '/assets/animals/yak.png', emoji: '🐂' },
  z: { name: 'Zebra', image: '/assets/animals/zebra.png', emoji: '🦓' },
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
