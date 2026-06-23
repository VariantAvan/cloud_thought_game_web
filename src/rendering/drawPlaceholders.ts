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
