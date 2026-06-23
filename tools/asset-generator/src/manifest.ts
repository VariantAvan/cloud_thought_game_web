import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const MANIFEST_PATH = resolve(ROOT, 'public/assets/manifest.json');

export interface ManifestEntry {
  path: string;
  width: number;
  height: number;
  category: string;
  letter?: string;
}

interface Manifest {
  assets: ManifestEntry[];
}

export async function updateManifest(entry: ManifestEntry): Promise<void> {
  let manifest: Manifest = { assets: [] };
  try {
    const raw = await readFile(MANIFEST_PATH, 'utf-8');
    manifest = JSON.parse(raw) as Manifest;
  } catch {
    // fresh manifest
  }

  const webPath = entry.path.replace(/\\/g, '/');
  const normalized = webPath.startsWith('/') ? webPath : `/${webPath}`;
  const idx = manifest.assets.findIndex((a) => a.path === normalized);
  const record = { ...entry, path: normalized };
  if (idx >= 0) {
    manifest.assets[idx] = record;
  } else {
    manifest.assets.push(record);
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

export function toWebPath(absoluteOrRelative: string): string {
  const rel = absoluteOrRelative.replace(ROOT, '').replace(/\\/g, '/');
  return rel.startsWith('/public') ? rel.replace('/public', '') : rel;
}
