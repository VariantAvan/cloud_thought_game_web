import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '../../..');
export const APPROVED = resolve(__dirname, '../approved');
export const ARCHIVE = resolve(__dirname, '../archive');
export const STAGING = resolve(__dirname, '../staging');

/** Copy a promoted game asset into approved/ (mirrors public/assets layout). */
export async function archiveApprovedAsset(destRelative: string): Promise<void> {
  if (!destRelative.startsWith('public/assets/')) {
    throw new Error(`Expected public/assets path, got: ${destRelative}`);
  }

  const src = resolve(ROOT, destRelative);
  const dest = resolve(APPROVED, destRelative.replace('public/assets/', ''));
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log(`  → archived: approved/${destRelative.replace('public/assets/', '')}`);
}
