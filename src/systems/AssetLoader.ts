import { assetPath } from '../assets/assetPath';
import type { AssetManifest } from '../types';

const DEFAULT_ASSET_PATHS = [
  'assets/environment/tree.png',
  'assets/characters/person.png',
  'assets/clouds/cloud-0.png',
  'assets/clouds/cloud-1.png',
  'assets/clouds/cloud-2.png',
  'assets/clouds/cloud-3.png',
  'assets/clouds/cloud-4.png',
];

export class AssetLoader {
  private images = new Map<string, HTMLImageElement>();
  private loaded = false;

  async load(manifestPath = assetPath('assets/manifest.json')): Promise<void> {
    const paths = new Set<string>(DEFAULT_ASSET_PATHS.map(assetPath));

    try {
      const res = await fetch(manifestPath);
      if (res.ok) {
        const manifest = (await res.json()) as AssetManifest;
        for (const entry of manifest.assets) {
          paths.add(assetPath(entry.path.replace(/^\//, '')));
        }
      }
    } catch {
      // Manifest optional; placeholders used when images missing
    }

    await Promise.all(
      [...paths].map(async (path) => {
        try {
          const img = await this.loadImage(path);
          this.images.set(path, img);
        } catch {
          // Missing asset — renderer falls back to placeholders
        }
      }),
    );

    this.loaded = true;
  }

  private loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${path}`));
      img.src = path;
    });
  }

  getImage(path: string): HTMLImageElement | undefined {
    return this.images.get(path);
  }

  hasImage(path: string): boolean {
    return this.images.has(path);
  }

  isReady(): boolean {
    return this.loaded;
  }
}
