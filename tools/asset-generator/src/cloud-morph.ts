import sharp from 'sharp';

export interface NormalizedSprite {
  width: number;
  height: number;
  data: Buffer;
}

export async function loadNormalizedSprites(paths: string[]): Promise<NormalizedSprite[]> {
  const sizes = await Promise.all(
    paths.map(async (path) => {
      const meta = await sharp(path).metadata();
      return { width: meta.width ?? 0, height: meta.height ?? 0 };
    }),
  );

  const width = Math.max(...sizes.map((s) => s.width));
  const height = Math.max(...sizes.map((s) => s.height));

  return Promise.all(
    paths.map(async (path) => {
      const data = await sharp(path)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .ensureAlpha()
        .raw()
        .toBuffer();

      return { width, height, data };
    }),
  );
}

/** Premultiplied-alpha crossfade between two RGBA buffers. */
export function blendSprites(a: Buffer, b: Buffer, t: number): Buffer {
  const out = Buffer.alloc(a.length);
  const mix = Math.min(1, Math.max(0, t));

  for (let i = 0; i < a.length; i += 4) {
    const aAlpha = a[i + 3] / 255;
    const bAlpha = b[i + 3] / 255;
    const wa = aAlpha * (1 - mix);
    const wb = bAlpha * mix;
    const alpha = wa + wb;

    if (alpha < 1 / 255) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      continue;
    }

    out[i] = Math.round((a[i] * wa + b[i] * wb) / alpha);
    out[i + 1] = Math.round((a[i + 1] * wa + b[i + 1] * wb) / alpha);
    out[i + 2] = Math.round((a[i + 2] * wa + b[i + 2] * wb) / alpha);
    out[i + 3] = Math.round(alpha * 255);
  }

  return out;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export type MorphEase = 'linear' | 'smooth';

export interface MorphOptions {
  durationSec: number;
  fps: number;
  framesPerSegment?: number;
  ease?: MorphEase;
}

function applyEase(t: number, ease: MorphEase): number {
  if (ease === 'linear') return t;
  return easeInOutCubic(t);
}

export function buildMorphFrames(
  sprites: NormalizedSprite[],
  options: MorphOptions,
): Buffer[] {
  if (sprites.length < 2) {
    throw new Error('Need at least two sprites to morph');
  }

  const ease = options.ease ?? 'linear';
  const framesPerSegment =
    options.framesPerSegment ??
    Math.max(8, Math.round((options.durationSec * options.fps) / sprites.length));

  const frames: Buffer[] = [];

  for (let i = 0; i < sprites.length; i++) {
    const from = sprites[i].data;
    const to = sprites[(i + 1) % sprites.length].data;

    // Sample t from 0 → 1 inclusive so each segment fully reaches the next cloud.
    const steps = Math.max(2, framesPerSegment);
    for (let f = 0; f < steps; f++) {
      const t = applyEase(f / (steps - 1), ease);
      frames.push(blendSprites(from, to, t));
    }
  }

  return frames;
}

export async function rawFrameToPng(
  data: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}
