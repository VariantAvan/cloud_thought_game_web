import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface SaveOptions {
  width?: number;
  height?: number;
}

export async function savePng(
  buffer: Buffer,
  outputPath: string,
  options: SaveOptions = {},
): Promise<{ width: number; height: number }> {
  await mkdir(dirname(outputPath), { recursive: true });

  let pipeline = sharp(buffer).png();
  if (options.width || options.height) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  const out = await pipeline.toBuffer({ resolveWithObject: true });
  await writeFile(outputPath, out.data);
  return { width: out.info.width, height: out.info.height };
}

export async function promoteFile(
  sourcePath: string,
  destPath: string,
  options: SaveOptions = {},
): Promise<{ width: number; height: number }> {
  const buffer = await sharp(sourcePath).toBuffer();
  return savePng(buffer, destPath, options);
}
