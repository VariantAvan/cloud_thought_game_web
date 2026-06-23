const bottomFractionCache = new WeakMap<HTMLImageElement, number>();

/** Normalized Y (0 = top) of the lowest opaque pixel in the image. */
export function getContentBottomFraction(img: HTMLImageElement, alphaThreshold = 12): number {
  const cached = bottomFractionCache.get(img);
  if (cached !== undefined) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return 1;

  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > alphaThreshold) {
        const fraction = (y + 1) / height;
        bottomFractionCache.set(img, fraction);
        return fraction;
      }
    }
  }

  bottomFractionCache.set(img, 1);
  return 1;
}
