import { BUBBLE_FADE_DURATION } from '../game/constants';
import type { Point } from '../types';
import { drawThoughtBubble } from '../rendering/drawPlaceholders';

export class ThoughtBubble {
  visible = false;
  letter = '';
  opacity = 0;
  private fadeTimer = 0;

  show(letter: string): void {
    this.letter = letter.toUpperCase();
    this.visible = true;
    this.opacity = 1;
    this.fadeTimer = BUBBLE_FADE_DURATION;
  }

  update(deltaTime: number): void {
    if (!this.visible) return;
    this.fadeTimer -= deltaTime;
    if (this.fadeTimer <= 0) {
      this.visible = false;
      this.opacity = 0;
    } else if (this.fadeTimer < 0.5) {
      this.opacity = this.fadeTimer / 0.5;
    }
  }

  render(ctx: CanvasRenderingContext2D, head: Point): void {
    if (!this.visible || this.opacity <= 0) return;
    drawThoughtBubble(ctx, head.x, head.y - 50, this.letter, this.opacity);
  }
}
