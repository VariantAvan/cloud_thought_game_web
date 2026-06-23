export type LetterHandler = (letter: string) => void;

export class InputManager {
  private handlers: LetterHandler[] = [];

  start(): void {
    window.addEventListener('keydown', this.onKeyDown);
  }

  stop(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onLetter(handler: LetterHandler): void {
    this.handlers.push(handler);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    const key = event.key;
    if (key.length !== 1) return;
    const letter = key.toLowerCase();
    if (letter < 'a' || letter > 'z') return;
    event.preventDefault();
    for (const handler of this.handlers) {
      handler(letter);
    }
  };
}
