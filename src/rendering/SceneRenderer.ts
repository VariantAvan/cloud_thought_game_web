import { assetPath } from '../assets/assetPath';
import { GRASS_BOTTOM, GRASS_TOP, LAYOUT, SKY_BOTTOM, SKY_TOP, treeGroundY } from '../game/constants';
import type { Point, Size } from '../types';
import { drawPerson, drawTree } from './drawPlaceholders';
import { getContentBottomFraction } from './imageBounds';
import type { AssetLoader } from '../systems/AssetLoader';

export class SceneRenderer {
  constructor(private assets: AssetLoader) {}

  getHeadPosition(size: Size): Point {
    const scale = Math.min(size.width, size.height) * LAYOUT.personScale;
    const personX = size.width * LAYOUT.personX;
    const personY = size.height * LAYOUT.personY;
    return {
      x: personX + scale * 0.35,
      y: personY - scale * 0.15,
    };
  }

  render(ctx: CanvasRenderingContext2D, size: Size): void {
    this.renderSky(ctx, size);
    this.renderForeground(ctx, size);
  }

  renderSky(ctx: CanvasRenderingContext2D, size: Size): void {
    this.drawSky(ctx, size);
  }

  renderForeground(ctx: CanvasRenderingContext2D, size: Size): void {
    this.drawGrass(ctx, size);
    this.drawTree(ctx, size);
    this.drawPerson(ctx, size);
  }

  private drawSky(ctx: CanvasRenderingContext2D, size: Size): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, size.height * LAYOUT.grassTop);
    gradient.addColorStop(0, SKY_TOP);
    gradient.addColorStop(1, SKY_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height * LAYOUT.grassTop);
  }

  private drawGrass(ctx: CanvasRenderingContext2D, size: Size): void {
    const grassY = size.height * LAYOUT.grassTop;
    const gradient = ctx.createLinearGradient(0, grassY, 0, size.height);
    gradient.addColorStop(0, GRASS_TOP);
    gradient.addColorStop(1, GRASS_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, grassY, size.width, size.height - grassY);
  }

  private drawTree(ctx: CanvasRenderingContext2D, size: Size): void {
    const x = size.width * LAYOUT.treeX;
    const groundY = treeGroundY(size.height);
    const img = this.assets.getImage(assetPath('assets/environment/tree.png'));

    if (img) {
      const w = size.width * LAYOUT.treeScreenWidth;
      const h = w / (img.width / img.height);
      const bottomFraction = getContentBottomFraction(img);
      const drawY = groundY - h * bottomFraction;
      ctx.drawImage(img, x - w / 2, drawY, w, h);
    } else {
      const w = size.width * LAYOUT.treeScreenWidth;
      const h = w / 0.67;
      drawTree(ctx, x, groundY, h);
    }
  }

  private drawPerson(ctx: CanvasRenderingContext2D, size: Size): void {
    const scale = Math.min(size.width, size.height) * LAYOUT.personScale;
    const x = size.width * LAYOUT.personX;
    const y = size.height * LAYOUT.personY;
    const img = this.assets.getImage(assetPath('assets/characters/person.png'));

    if (img) {
      const aspect = img.width / img.height;
      const w = scale * 1.8;
      const h = w / aspect;
      ctx.drawImage(img, x - w / 2, y - h * 0.4, w, h);
    } else {
      drawPerson(ctx, x, y, scale);
    }
  }
}
