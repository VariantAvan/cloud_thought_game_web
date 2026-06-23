export const SKY_TOP = '#6eb5e0';
export const SKY_BOTTOM = '#b8dff5';
export const GRASS_TOP = '#5a9a2e';
export const GRASS_BOTTOM = '#3d6b1f';

export const CLOUD_COUNT = 5;
export const CLOUD_MIN_SPEED = 25;
export const CLOUD_MAX_SPEED = 55;
export const CLOUD_TRANSFORM_DELAY = 0.3;
export const CLOUD_SLOW_FACTOR = 0.2;
export const CLOUD_SPEED_RAMP_DURATION = 1.5;
export const ANIMAL_SCALE_DURATION = 0.4;
export const ANIMAL_DISPLAY_DURATION = 4;

export const BUBBLE_FADE_DURATION = 2;

// Normalized layout (0–1)
export const LAYOUT = {
  grassTop: 0.75,
  treeX: 0.72,
  /** Fraction into the grass band (from its top edge) where the tree trunk meets ground. */
  treeGrassInset: 0.05,
  /** Tree width as a fraction of canvas width (~25% of the screen on landscape). */
  treeScreenWidth: 0.25,
  personX: 0.38,
  personY: 0.84,
  personScale: 0.22,
  skyCloudMinY: 0.08,
  skyCloudMaxY: 0.45,
  dogScale: 0.08,
} as const;

/** Canvas Y where grounded sprites (tree trunk base) should sit. */
export function treeGroundY(canvasHeight: number): number {
  const grassBand = 1 - LAYOUT.grassTop;
  return canvasHeight * (LAYOUT.grassTop + LAYOUT.treeGrassInset * grassBand);
}

// Dog behavior timings (seconds)
export const DOG_SIT_DURATION = 2.5;
export const DOG_PANT_DURATION = 2.5;
export const DOG_CIRCLE_DURATION = 5;
export const DOG_SIT_AGAIN_DURATION = 2;
export const DOG_SIT_AT_TARGET_DURATION = 2.5;
export const DOG_LIE_DURATION = 3;
export const DOG_RUN_SPEED = 0.16; // fraction of min(canvas) per second
export const DOG_CIRCLE_RADIUS_X = 0.34; // fraction of canvas width
export const DOG_CIRCLE_RADIUS_Y = 0.45; // fraction of grass band height
