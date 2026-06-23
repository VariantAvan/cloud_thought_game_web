import {
  DOG_CIRCLE_DURATION,
  DOG_CIRCLE_RADIUS_X,
  DOG_CIRCLE_RADIUS_Y,
  DOG_LIE_DURATION,
  DOG_PANT_DURATION,
  DOG_RUN_SPEED,
  DOG_SIT_AGAIN_DURATION,
  DOG_SIT_AT_TARGET_DURATION,
  DOG_SIT_DURATION,
  LAYOUT,
} from '../game/constants';
import { drawDog } from '../rendering/drawPlaceholders';
import type { DogPose, Point } from '../types';

type DogPhase =
  | 'sitting'
  | 'standingPanting'
  | 'runningCircle'
  | 'sittingAgain'
  | 'runningToClick'
  | 'sittingAtClick'
  | 'runningToTree'
  | 'runningBack'
  | 'lyingByFeet';

interface SceneAnchors {
  feet: Point;
  tree: Point;
  circleCenter: Point;
  dogSize: number;
  runSpeed: number;
  circleRadiusX: number;
  circleRadiusY: number;
}

export class DogManager {
  private phase: DogPhase = 'sitting';
  private timer = DOG_SIT_DURATION;
  private x = 0;
  private y = 0;
  private circleAngle = 0;
  private animTime = 0;
  private facingRight = true;
  private clickTargetNorm: Point | null = null;

  constructor(
    private width: number,
    private height: number,
  ) {
    const anchors = this.getAnchors();
    this.x = anchors.feet.x;
    this.y = anchors.feet.y;
  }

  /** Returns true if the point is on the grass and was accepted. */
  setClickTarget(x: number, y: number): boolean {
    if (!this.isInGrass(x, y)) return false;
    this.clickTargetNorm = { x: x / this.width, y: y / this.height };
    return true;
  }

  private isInGrass(x: number, y: number): boolean {
    const grassY = this.height * LAYOUT.grassTop;
    return x >= 0 && x <= this.width && y >= grassY && y <= this.height;
  }

  private getClickTarget(): Point | null {
    if (!this.clickTargetNorm) return null;
    return {
      x: this.clickTargetNorm.x * this.width,
      y: this.clickTargetNorm.y * this.height,
    };
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (
      this.phase === 'sitting' ||
      this.phase === 'sittingAgain' ||
      this.phase === 'lyingByFeet'
    ) {
      const { feet } = this.getAnchors();
      this.x = feet.x;
      this.y = feet.y;
    } else if (this.phase === 'sittingAtClick') {
      const target = this.getClickTarget();
      if (target) {
        this.x = target.x;
        this.y = target.y;
      }
    }
  }

  private getAnchors(): SceneAnchors {
    const min = Math.min(this.width, this.height);
    const personScale = min * LAYOUT.personScale;
    const personX = this.width * LAYOUT.personX;
    const personY = this.height * LAYOUT.personY;
    const grassHeight = this.height * (1 - LAYOUT.grassTop);
    const meadowCenterY = this.height * LAYOUT.grassTop + grassHeight * 0.55;
    return {
      feet: {
        x: personX + personScale * 0.55,
        y: personY + personScale * 0.08,
      },
      tree: {
        x: this.width * LAYOUT.treeX - min * 0.06,
        y: this.height * LAYOUT.treeBaseY + min * 0.012,
      },
      circleCenter: {
        x: this.width * 0.5,
        y: meadowCenterY,
      },
      dogSize: min * LAYOUT.dogScale,
      runSpeed: min * DOG_RUN_SPEED,
      circleRadiusX: this.width * DOG_CIRCLE_RADIUS_X,
      circleRadiusY: grassHeight * DOG_CIRCLE_RADIUS_Y,
    };
  }

  private setAtFeet(): void {
    const { feet } = this.getAnchors();
    this.x = feet.x;
    this.y = feet.y;
  }

  private advance(phase: DogPhase, timer: number): void {
    this.phase = phase;
    this.timer = timer;
  }

  private moveToward(target: Point, deltaTime: number, speed: number): boolean {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < speed * deltaTime * 0.5) {
      this.x = target.x;
      this.y = target.y;
      return true;
    }
    this.facingRight = dx >= 0;
    this.x += (dx / dist) * speed * deltaTime;
    this.y += (dy / dist) * speed * deltaTime;
    return false;
  }

  update(deltaTime: number): void {
    this.animTime += deltaTime;
    const anchors = this.getAnchors();

    switch (this.phase) {
      case 'sitting':
        this.setAtFeet();
        this.timer -= deltaTime;
        if (this.timer <= 0) this.advance('standingPanting', DOG_PANT_DURATION);
        break;

      case 'standingPanting':
        this.setAtFeet();
        this.timer -= deltaTime;
        if (this.timer <= 0) {
          this.circleAngle = 0;
          this.advance('runningCircle', DOG_CIRCLE_DURATION);
        }
        break;

      case 'runningCircle': {
        this.timer -= deltaTime;
        const progress = 1 - this.timer / DOG_CIRCLE_DURATION;
        this.circleAngle = progress * Math.PI * 2;
        this.x =
          anchors.circleCenter.x + Math.cos(this.circleAngle) * anchors.circleRadiusX;
        this.y =
          anchors.circleCenter.y + Math.sin(this.circleAngle) * anchors.circleRadiusY;
        this.facingRight = Math.cos(this.circleAngle + Math.PI / 2) >= 0;
        if (this.timer <= 0) this.advance('sittingAgain', DOG_SIT_AGAIN_DURATION);
        break;
      }

      case 'sittingAgain':
        this.setAtFeet();
        this.timer -= deltaTime;
        if (this.timer <= 0) {
          if (this.getClickTarget()) {
            this.advance('runningToClick', 0);
          } else {
            this.advance('runningToTree', 0);
          }
        }
        break;

      case 'runningToClick': {
        const target = this.getClickTarget();
        if (!target) {
          this.advance('runningBack', 0);
          break;
        }
        if (this.moveToward(target, deltaTime, anchors.runSpeed)) {
          this.advance('sittingAtClick', DOG_SIT_AT_TARGET_DURATION);
        }
        break;
      }

      case 'sittingAtClick':
        this.timer -= deltaTime;
        if (this.timer <= 0) {
          this.clickTargetNorm = null;
          this.advance('runningBack', 0);
        }
        break;

      case 'runningToTree':
        if (this.moveToward(anchors.tree, deltaTime, anchors.runSpeed)) {
          this.advance('runningBack', 0);
        }
        break;

      case 'runningBack':
        if (this.moveToward(anchors.feet, deltaTime, anchors.runSpeed)) {
          this.advance('lyingByFeet', DOG_LIE_DURATION);
        }
        break;

      case 'lyingByFeet':
        this.setAtFeet();
        this.facingRight = false;
        this.timer -= deltaTime;
        if (this.timer <= 0) this.advance('sitting', DOG_SIT_DURATION);
        break;
    }
  }

  private getPose(): DogPose {
    switch (this.phase) {
      case 'sitting':
      case 'sittingAgain':
      case 'sittingAtClick':
        return 'sitting';
      case 'standingPanting':
        return 'standingPanting';
      case 'runningCircle':
      case 'runningToClick':
      case 'runningToTree':
      case 'runningBack':
        return 'running';
      case 'lyingByFeet':
        return 'lying';
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { dogSize } = this.getAnchors();
    drawDog(ctx, this.x, this.y, dogSize, this.getPose(), this.facingRight, this.animTime);
  }
}
