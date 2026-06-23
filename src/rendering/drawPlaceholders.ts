import type { DogPose } from '../types';

export function drawCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  const r = size * 0.18;
  const bumps = [
    { dx: 0, dy: 0, rad: r * 1.2 },
    { dx: -r * 1.4, dy: r * 0.3, rad: r },
    { dx: r * 1.3, dy: r * 0.2, rad: r * 1.1 },
    { dx: -r * 0.5, dy: -r * 0.4, rad: r * 0.85 },
    { dx: r * 0.6, dy: -r * 0.3, rad: r * 0.9 },
  ];
  for (const b of bumps) {
    ctx.beginPath();
    ctx.arc(x + b.dx, y + b.dy, b.rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawTree(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  height: number,
): void {
  const trunkW = height * 0.12;
  const trunkH = height * 0.45;
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(baseX - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  ctx.fillStyle = '#2d6a2d';
  ctx.beginPath();
  ctx.arc(baseX, baseY - trunkH - height * 0.2, height * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(baseX - height * 0.18, baseY - trunkH - height * 0.1, height * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(baseX + height * 0.18, baseY - trunkH - height * 0.1, height * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPerson(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
): void {
  ctx.save();
  ctx.translate(x, y);

  // Body lying down
  ctx.fillStyle = '#4a90c4';
  roundRect(ctx, -scale * 0.9, -scale * 0.15, scale * 1.6, scale * 0.35, scale * 0.12);
  ctx.fill();

  // Legs
  ctx.fillStyle = '#3a3530';
  ctx.fillRect(scale * 0.5, scale * 0.05, scale * 0.5, scale * 0.12);
  ctx.fillRect(scale * 0.55, scale * 0.18, scale * 0.45, scale * 0.1);

  // Head
  ctx.fillStyle = '#f5c9a8';
  ctx.beginPath();
  ctx.arc(-scale * 0.55, -scale * 0.1, scale * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#4a3728';
  ctx.beginPath();
  ctx.arc(-scale * 0.55, -scale * 0.18, scale * 0.18, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawAnimalPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  letter: string,
  emoji: string,
  scale: number,
): void {
  const size = 80 * scale;
  ctx.save();
  ctx.globalAlpha = scale;

  const hue = (letter.charCodeAt(0) - 97) * 14;
  ctx.fillStyle = `hsl(${hue}, 55%, 65%)`;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${size * 0.45}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);

  ctx.restore();
}

export function drawThoughtBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  letter: string,
  opacity: number,
): void {
  ctx.save();
  ctx.globalAlpha = opacity;

  const w = 56;
  const h = 44;
  const bx = x - w / 2;
  const by = y - h;

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, w, h, 12);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 4);
  ctx.lineTo(x, y + 8);
  ctx.lineTo(x + 6, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#333333';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, x, by + h / 2);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawDog(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  pose: DogPose,
  facingRight: boolean,
  animPhase: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  if (!facingRight) ctx.scale(-1, 1);

  const body = '#c68642';
  const dark = '#8b5a2b';
  const legSwing = Math.sin(animPhase * 12) * size * 0.08;

  if (pose === 'lying') {
    ctx.fillStyle = body;
    roundRect(ctx, -size * 0.55, -size * 0.12, size * 1.1, size * 0.22, size * 0.1);
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(size * 0.45, -size * 0.02, size * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(size * 0.52, size * 0.02);
    ctx.lineTo(size * 0.62, size * 0.08);
    ctx.lineTo(size * 0.5, size * 0.06);
    ctx.fill();
    ctx.fillStyle = '#e8a0a0';
    ctx.beginPath();
    ctx.arc(-size * 0.5, -size * 0.08, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (pose === 'sitting') {
    ctx.fillStyle = body;
    roundRect(ctx, -size * 0.2, -size * 0.35, size * 0.4, size * 0.35, size * 0.08);
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(size * 0.12, -size * 0.42, size * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-size * 0.08, -size * 0.05, size * 0.1, size * 0.18);
    ctx.fillRect(size * 0.02, -size * 0.05, size * 0.1, size * 0.18);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(-size * 0.18, -size * 0.12, size * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (pose === 'standingPanting') {
    ctx.fillStyle = body;
    roundRect(ctx, -size * 0.18, -size * 0.42, size * 0.36, size * 0.38, size * 0.08);
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(size * 0.14, -size * 0.52, size * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-size * 0.1, -size * 0.08, size * 0.09, size * 0.22);
    ctx.fillRect(size * 0.04, -size * 0.08, size * 0.09, size * 0.22);
    const tongueOut = size * 0.06 + Math.sin(animPhase * 8) * size * 0.02;
    ctx.fillStyle = '#e8a0a0';
    ctx.beginPath();
    ctx.ellipse(size * 0.2, -size * 0.38 + tongueOut, size * 0.05, size * 0.08, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // running
  ctx.fillStyle = body;
  roundRect(ctx, -size * 0.22, -size * 0.28, size * 0.44, size * 0.26, size * 0.07);
  ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(size * 0.16, -size * 0.34, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.fillRect(-size * 0.12, -size * 0.02 + legSwing, size * 0.08, size * 0.16);
  ctx.fillRect(size * 0.06, -size * 0.02 - legSwing, size * 0.08, size * 0.16);
  ctx.beginPath();
  ctx.moveTo(-size * 0.28, -size * 0.18);
  ctx.quadraticCurveTo(-size * 0.42, -size * 0.28 + legSwing * 0.5, -size * 0.38, -size * 0.08);
  ctx.lineWidth = size * 0.05;
  ctx.strokeStyle = body;
  ctx.stroke();
  ctx.restore();
}
