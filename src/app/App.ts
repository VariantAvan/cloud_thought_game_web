import { Game } from '../game/Game';
import { CreditsScreen } from './CreditsScreen';

type Screen = 'menu' | 'game' | 'credits';

export class App {
  private canvas: HTMLCanvasElement;
  private menuScreen: HTMLElement;
  private creditsScreen: HTMLElement;
  private currentScreen: Screen = 'menu';
  private game: Game | null = null;
  private credits: CreditsScreen;

  constructor() {
    const canvas = document.getElementById('game');
    const menuScreen = document.getElementById('menu-screen');
    const creditsScreen = document.getElementById('credits-screen');
    const btnStart = document.getElementById('btn-start');
    const btnCredits = document.getElementById('btn-credits');
    const btnBack = document.getElementById('btn-back');

    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Canvas #game not found');
    if (!menuScreen || !creditsScreen) throw new Error('Menu screens not found');
    if (!btnStart || !btnCredits || !btnBack) throw new Error('Menu buttons not found');

    this.canvas = canvas;
    this.menuScreen = menuScreen;
    this.creditsScreen = creditsScreen;
    this.credits = new CreditsScreen('credits-content');

    btnStart.addEventListener('click', () => this.showGame());
    btnCredits.addEventListener('click', () => this.showCredits());
    btnBack.addEventListener('click', () => this.showMenu());

    window.addEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.currentScreen !== 'game') return;
    if (event.ctrlKey && event.key.toLowerCase() === 'q') {
      event.preventDefault();
      this.showMenu();
    }
  };

  private hideAll(): void {
    this.menuScreen.hidden = true;
    this.creditsScreen.hidden = true;
    this.canvas.hidden = true;
  }

  showMenu(): void {
    this.game?.destroy();
    this.game = null;
    this.hideAll();
    this.menuScreen.hidden = false;
    this.currentScreen = 'menu';
  }

  private async showGame(): Promise<void> {
    this.hideAll();
    this.canvas.hidden = false;
    this.currentScreen = 'game';

    this.game = new Game(this.canvas);
    try {
      await this.game.start();
    } catch (err) {
      console.error('Failed to start game:', err);
      this.showMenu();
    }
  }

  private showCredits(): void {
    this.hideAll();
    this.credits.refresh();
    this.creditsScreen.hidden = false;
    this.currentScreen = 'credits';
  }
}
