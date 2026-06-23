import {
  ANIMAL_SCALE_DURATION,
  CLOUD_COUNT,
  CLOUD_MAX_SPEED,
  CLOUD_MIN_SPEED,
  CLOUD_TRANSFORM_DELAY,
  LAYOUT,
} from '../game/constants';
import { drawAnimalPlaceholder, drawCloud } from '../rendering/drawPlaceholders';
import type { Cloud } from '../types';
import { getAnimal } from './AnimalRegistry';
import type { AssetLoader } from './AssetLoader';

let cloudIdCounter = 0;

function createCloud(width: number, height: number, startX?: number): Cloud {
  const yRange = LAYOUT.skyCloudMaxY - LAYOUT.skyCloudMinY;
  const y = height * (LAYOUT.skyCloudMinY + Math.random() * yRange);
  return {
    id: `cloud-${cloudIdCounter++}`,
    x: startX ?? -80 - Math.random() * 200,
    y,
    speed: CLOUD_MIN_SPEED + Math.random() * (CLOUD_MAX_SPEED - CLOUD_MIN_SPEED),
    variant: Math.floor(Math.random() * CLOUD_COUNT),
    state: 'drifting',
    stopTimer: 0,
    animalScale: 0,
    wobblePhase: Math.random() * Math.PI * 2,
  };
}

export class CloudManager {
  private clouds: Cloud[] = [];

  constructor(
    private assets: AssetLoader,
    private width: number,
    private height: number,
  ) {
    this.spawnInitial();
  }

  resize(width: number, height: number): void {
    const scaleX = width / this.width;
    const scaleY = height / this.height;
    for (const cloud of this.clouds) {
      cloud.x *= scaleX;
      cloud.y *= scaleY;
    }
    this.width = width;
    this.height = height;
  }

  private spawnInitial(): void {
    this.clouds = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const x = (this.width / CLOUD_COUNT) * i + Math.random() * 100;
      this.clouds.push(createCloud(this.width, this.height, x));
    }
  }

  transformNearest(letter: string): void {
    const drifting = this.clouds.filter((c) => c.state === 'drifting');
    if (drifting.length === 0) return;

    const centerX = this.width * 0.5;
    let nearest = drifting[0];
    let nearestDist = Math.abs(nearest.x - centerX);

    for (const cloud of drifting) {
      const dist = Math.abs(cloud.x - centerX);
      if (dist < nearestDist) {
        nearest = cloud;
        nearestDist = dist;
      }
    }

    nearest.state = 'stopped';
    nearest.animalLetter = letter;
    nearest.stopTimer = CLOUD_TRANSFORM_DELAY;
    nearest.animalScale = 0;
  }

  update(deltaTime: number): void {
    for (const cloud of this.clouds) {
      cloud.wobblePhase += deltaTime * 1.5;

      if (cloud.state === 'drifting') {
        cloud.x += cloud.speed * deltaTime;
        if (cloud.x > this.width + 120) {
          cloud.x = -120;
          cloud.y =
            this.height *
            (LAYOUT.skyCloudMinY +
              Math.random() * (LAYOUT.skyCloudMaxY - LAYOUT.skyCloudMinY));
          cloud.speed =
            CLOUD_MIN_SPEED + Math.random() * (CLOUD_MAX_SPEED - CLOUD_MIN_SPEED);
        }
      } else if (cloud.state === 'stopped') {
        cloud.stopTimer -= deltaTime;
        if (cloud.stopTimer <= 0) {
          cloud.state = 'animal';
        }
      } else if (cloud.state === 'animal') {
        cloud.animalScale = Math.min(
          1,
          cloud.animalScale + deltaTime / ANIMAL_SCALE_DURATION,
        );
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const cloud of this.clouds) {
      if (cloud.state === 'animal') {
        this.renderAnimal(ctx, cloud);
      } else {
        this.renderCloud(ctx, cloud);
      }
    }
  }

  private renderCloud(ctx: CanvasRenderingContext2D, cloud: Cloud): void {
    const wobble =
      cloud.state === 'drifting' ? Math.sin(cloud.wobblePhase) * 3 : 0;
    const path = `/assets/clouds/cloud-${cloud.variant}.png`;
    const img = this.assets.getImage(path);
    const scale = Math.min(this.width, this.height) * 0.12;

    if (img) {
      ctx.drawImage(img, cloud.x - scale / 2, cloud.y - scale / 2 + wobble, scale, scale * 0.6);
    } else {
      drawCloud(ctx, cloud.x, cloud.y + wobble, scale);
    }
  }

  private renderAnimal(ctx: CanvasRenderingContext2D, cloud: Cloud): void {
    const letter = cloud.animalLetter ?? '?';
    const animal = getAnimal(letter);
    const size = Math.min(this.width, this.height) * 0.14 * cloud.animalScale;
    if (size <= 0) return;

    const img = animal.image ? this.assets.getImage(animal.image) : undefined;
    const x = cloud.x - size / 2;
    const y = cloud.y - size / 2;

    if (img) {
      ctx.save();
      ctx.globalAlpha = cloud.animalScale;
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    } else {
      drawAnimalPlaceholder(ctx, cloud.x, cloud.y, letter, animal.emoji, cloud.animalScale);
    }
  }
}
