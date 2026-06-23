export type LetterKey = string;

export type CloudState = 'drifting' | 'slowing' | 'animal' | 'accelerating';

export interface Cloud {
  id: string;
  x: number;
  y: number;
  speed: number;
  currentSpeed: number;
  variant: number;
  state: CloudState;
  animalLetter?: string;
  stopTimer: number;
  animalScale: number;
  wobblePhase: number;
}

export interface AnimalEntry {
  name: string;
  image: string;
  emoji: string;
}

export interface AssetManifestEntry {
  path: string;
  width: number;
  height: number;
  category: string;
  letter?: string;
}

export interface AssetManifest {
  assets: AssetManifestEntry[];
}

export interface Size {
  width: number;
  height: number;
}

export type DogPose = 'sitting' | 'standingPanting' | 'running' | 'lying';

export interface Point {
  x: number;
  y: number;
}
