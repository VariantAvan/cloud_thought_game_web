#!/usr/bin/env node
import { readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import GIFEncoder from 'gif-encoder-2';
import {
  buildMorphFrames,
  loadNormalizedSprites,
  rawFrameToPng,
} from './cloud-morph.js';
import { STAGING } from './paths.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  inputs: string[];
  out?: string;
  duration: number;
  fps: number;
  framesPerSegment?: number;
  ease: 'linear' | 'smooth';
  help?: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { inputs: [], duration: 10, fps: 24, ease: 'linear' };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' || a === '-o') args.out = argv[++i];
    else if (a === '--duration' || a === '-d') args.duration = parseFloat(argv[++i]);
    else if (a === '--fps') args.fps = parseInt(argv[++i], 10);
    else if (a === '--frames-per-segment' || a === '--steps') {
      args.framesPerSegment = parseInt(argv[++i], 10);
    } else if (a === '--ease') {
      const ease = argv[++i];
      if (ease !== 'linear' && ease !== 'smooth') {
        throw new Error('--ease must be "linear" or "smooth"');
      }
      args.ease = ease;
    } else if (a === '--help' || a === '-h') args.help = true;
    else if (!a.startsWith('-')) args.inputs.push(a);
  }

  return args;
}

function printHelp(): void {
  console.log(`
Crossfade cloud sprites into a looping transparent GIF.

Usage:
  npm run cloud-loop -- <cloud-0.png> <cloud-1.png> ... [options]

Options:
  --out, -o              Output path (default: staging/cloud-loop.gif)
  --duration, -d         Loop length in seconds (default: 10)
  --fps                  Playback frames per second (default: 24)
  --frames-per-segment   Intermediate frames between each cloud pair (overrides duration/fps)
  --steps                Alias for --frames-per-segment
  --ease                 linear (default) or smooth (ease-in-out cubic)

Smoothness tips:
  More intermediate frames = smoother morph. Try --frames-per-segment 96 --fps 48
  or --frames-per-segment 120 --fps 60 for a 10s loop with 5 clouds.

Example:
  npx tsx src/cloud-loop.ts --frames-per-segment 96 --fps 48 --duration 10
`);
}

async function defaultCloudInputs(): Promise<string[]> {
  const entries = await readdir(STAGING);
  return entries
    .filter((name) => /^cloud-[0-4]-.*-cutout\.png$/i.test(name))
    .sort((a, b) => {
      const ai = Number.parseInt(a.match(/^cloud-(\d+)/)?.[1] ?? '0', 10);
      const bi = Number.parseInt(b.match(/^cloud-(\d+)/)?.[1] ?? '0', 10);
      return ai - bi;
    })
    .map((name) => resolve(STAGING, name));
}

async function encodeGif(
  frames: Buffer[],
  width: number,
  height: number,
  fps: number,
): Promise<Buffer> {
  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  encoder.setDelay(Math.round(1000 / fps));
  encoder.setRepeat(0);
  encoder.start();

  for (const frame of frames) {
    encoder.addFrame(frame);
  }

  encoder.finish();
  return encoder.out.getData();
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const inputPaths =
    args.inputs.length > 0
      ? args.inputs.map((p) => resolve(process.cwd(), p))
      : await defaultCloudInputs();

  if (inputPaths.length < 2) {
    throw new Error('Need at least two cloud cutout PNGs');
  }

  const sprites = await loadNormalizedSprites(inputPaths);
  const { width, height } = sprites[0];
  const morphFrames = buildMorphFrames(sprites, {
    durationSec: args.duration,
    fps: args.fps,
    framesPerSegment: args.framesPerSegment,
    ease: args.ease,
  });

  const gif = await encodeGif(morphFrames, width, height, args.fps);
  const outPath = resolve(
    process.cwd(),
    args.out ?? resolve(STAGING, 'cloud-loop.gif'),
  );

  await writeFile(outPath, gif);

  const previewPath = resolve(dirname(outPath), `${basename(outPath, '.gif')}-preview.png`);
  await writeFile(previewPath, await rawFrameToPng(morphFrames[0], width, height));

  const framesPerSegment =
    args.framesPerSegment ?? Math.max(8, Math.round((args.duration * args.fps) / inputPaths.length));
  const actualDuration = morphFrames.length / args.fps;

  console.log(
    `Cloud loop: ${morphFrames.length} frames @ ${args.fps}fps (${framesPerSegment} per segment, ~${actualDuration.toFixed(1)}s)`,
  );
  console.log(`  → ${outPath}`);
  console.log(`  → preview: ${previewPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
