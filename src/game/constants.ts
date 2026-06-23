export const SKY_TOP = '#6eb5e0';
export const SKY_BOTTOM = '#b8dff5';
export const GRASS_TOP = '#5a9a2e';
export const GRASS_BOTTOM = '#3d6b1f';

export const CLOUD_COUNT = 5;
export const CLOUD_MIN_SPEED = 25;
export const CLOUD_MAX_SPEED = 55;
export const CLOUD_TRANSFORM_DELAY = 0.3;
export const ANIMAL_SCALE_DURATION = 0.4;

export const BUBBLE_FADE_DURATION = 2;

// Normalized layout (0–1)
export const LAYOUT = {
  grassTop: 0.62,
  treeX: 0.72,
  treeBaseY: 0.62,
  treeScale: 0.28,
  personX: 0.38,
  personY: 0.68,
  personScale: 0.22,
  skyCloudMinY: 0.08,
  skyCloudMaxY: 0.42,
} as const;
