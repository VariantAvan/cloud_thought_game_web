import sharp from 'sharp';

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export type KeyMode = 'blue' | 'white';

/** Bright chroma blue — distinct from the character's casual shirt blues. */
export const BLUE_SCREEN: Rgb = { r: 0, g: 180, b: 255 };

export const WHITE_SCREEN: Rgb = { r: 255, g: 255, b: 255 };

export interface ChromaKeyOptions {
  key: KeyMode;
  tolerance?: number;
  softness?: number;
}

function rgbDistance(r: number, g: number, b: number, key: Rgb): number {
  const dr = r - key.r;
  const dg = g - key.g;
  const db = b - key.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function sampleBackgroundColor(data: Uint8Array, width: number, height: number): Rgb {
  const points: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];

  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of points) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  const n = points.length;
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

/** Fixed chroma key (#00B4FF) with guards so shirt blues are not removed. */
function isBlueScreenPixel(r: number, g: number, b: number, key: Rgb, tolerance: number): boolean {
  if (rgbDistance(r, g, b, key) > tolerance) return false;
  return b >= 120 && b > r + 20 && b >= g;
}

/** Sampled sky/backdrop — distance only (corners define the actual backdrop color). */
function isSampledBackdropPixel(r: number, g: number, b: number, key: Rgb, tolerance: number): boolean {
  return rgbDistance(r, g, b, key) <= tolerance;
}

/** Near-white, low-saturation pixels (background), not light shirt highlights. */
function isWhiteScreenPixel(r: number, g: number, b: number, tolerance: number): boolean {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (min < 235 - tolerance * 0.4) return false;
  return max - min < 28 + tolerance * 0.2;
}

function keyAlpha(
  r: number,
  g: number,
  b: number,
  key: KeyMode,
  keyRgb: Rgb,
  tolerance: number,
  softness: number,
  useSampledBackdrop: boolean,
): number {
  const matches =
    key === 'blue'
      ? useSampledBackdrop
        ? isSampledBackdropPixel(r, g, b, keyRgb, tolerance)
        : isBlueScreenPixel(r, g, b, keyRgb, tolerance)
      : isWhiteScreenPixel(r, g, b, tolerance);

  if (!matches) return 255;

  const dist =
    key === 'blue'
      ? rgbDistance(r, g, b, keyRgb)
      : 255 - Math.min(r, g, b);

  if (dist <= tolerance) return 0;

  const t = (dist - tolerance) / Math.max(softness, 1);
  return Math.round(Math.min(1, Math.max(0, t)) * 255);
}

export async function removeChromaKey(
  input: Buffer | string,
  options: ChromaKeyOptions,
): Promise<Buffer> {
  const tolerance = options.tolerance ?? (options.key === 'blue' ? 72 : 48);
  const softness = options.softness ?? 36;

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const keyRgb =
    options.key === 'blue'
      ? sampleBackgroundColor(pixels, info.width, info.height)
      : WHITE_SCREEN;
  const useSampledBackdrop = options.key === 'blue';

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    pixels[i + 3] = keyAlpha(
      r,
      g,
      b,
      options.key,
      keyRgb,
      tolerance,
      softness,
      useSampledBackdrop,
    );
  }

  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}
