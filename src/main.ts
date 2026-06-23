import { Game } from './game/Game';

const canvas = document.getElementById('game');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas element #game not found');
}

const game = new Game(canvas);
game.start().catch((err) => {
  console.error('Failed to start game:', err);
});
