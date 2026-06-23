import { GameLoop } from './GameLoop';
import { SceneRenderer } from '../rendering/SceneRenderer';
import { AssetLoader } from '../systems/AssetLoader';
import { CloudManager } from '../systems/CloudManager';
import { DogManager } from '../systems/DogManager';
import { InputManager } from '../systems/InputManager';
import { ThoughtBubble } from '../systems/ThoughtBubble';
import type { Size } from '../types';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private size: Size = { width: 0, height: 0 };
  private loop: GameLoop;
  private assets: AssetLoader;
  private scene: SceneRenderer;
  private clouds!: CloudManager;
  private dog!: DogManager;
  private input: InputManager;
  private bubble: ThoughtBubble;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;

    this.assets = new AssetLoader();
    this.scene = new SceneRenderer(this.assets);
    this.input = new InputManager();
    this.bubble = new ThoughtBubble();

    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render(),
    );

    window.addEventListener('resize', this.onResize);
    this.canvas.addEventListener('click', this.onCanvasClick);
  }

  async start(): Promise<void> {
    await this.assets.load();
    this.onResize();
    this.clouds = new CloudManager(this.assets, this.size.width, this.size.height);
    this.dog = new DogManager(this.size.width, this.size.height);

    this.input.onLetter((letter) => {
      this.bubble.show(letter);
      this.clouds.transformNearest(letter);
    });
    this.input.start();
    this.loop.start();
  }

  destroy(): void {
    this.loop.stop();
    this.input.stop();
    window.removeEventListener('resize', this.onResize);
    this.canvas.removeEventListener('click', this.onCanvasClick);
  }

  private onCanvasClick = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.dog?.setClickTarget(x, y);
  };

  private onResize = (): void => {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const prev = this.size;
    this.size = { width: w, height: h };
    if (this.clouds && prev.width > 0) {
      this.clouds.resize(w, h);
      this.dog.resize(w, h);
    }
  };

  private update(deltaTime: number): void {
    this.clouds?.update(deltaTime);
    this.dog?.update(deltaTime);
    this.bubble.update(deltaTime);
  }

  private render(): void {
    const { ctx, size } = this;
    ctx.clearRect(0, 0, size.width, size.height);

    this.scene.renderSky(ctx, size);
    this.clouds?.render(ctx);
    this.scene.renderForeground(ctx, size);
    this.dog?.render(ctx);

    const head = this.scene.getHeadPosition(size);
    this.bubble.render(ctx, head);
  }
}
