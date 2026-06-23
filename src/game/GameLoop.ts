export class GameLoop {
  private running = false;
  private lastTime = 0;
  private rafId = 0;

  constructor(
    private update: (deltaTime: number) => void,
    private render: () => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (time: number): void => {
    if (!this.running) return;
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.update(deltaTime);
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  };
}
