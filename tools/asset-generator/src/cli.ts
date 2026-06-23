#!/usr/bin/env node
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateImage, DEFAULT_MODEL, BATCH_MODEL } from './gemini-client.js';
import { savePng, promoteFile } from './postprocess.js';
import { updateManifest, toWebPath } from './manifest.js';
import {
  treePrompt,
  personPrompt,
  cloudPrompt,
  grassPrompt,
  thoughtBubblePrompt,
} from './prompts/environment.js';
import { ANIMALS, animalPrompt, getAnimalFileName } from './prompts/animals.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const STAGING = resolve(__dirname, '../staging');
const ASSETS = resolve(ROOT, 'public/assets');

interface CliArgs {
  category?: string;
  letter?: string;
  all?: boolean;
  count?: number;
  model?: string;
  promote?: string;
  dest?: string;
  help?: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--category' || a === '-c') args.category = argv[++i];
    else if (a === '--letter' || a === '-l') args.letter = argv[++i];
    else if (a === '--all') args.all = true;
    else if (a === '--count' || a === '-n') args.count = parseInt(argv[++i], 10);
    else if (a === '--model' || a === '-m') args.model = argv[++i];
    else if (a === '--promote') args.promote = argv[++i];
    else if (a === '--dest') args.dest = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function printHelp(): void {
  console.log(`
Offline asset generator (Gemini Nano Banana)

Usage:
  npm run generate -- --category <name> [options]
  npm run generate -- --promote <staging-file> --dest <public-path>

Categories:
  tree, person, clouds, grass, ui, animals, environment

Options:
  --letter, -l     Single animal letter (a-z)
  --all            Generate all animals (A-Z)
  --count, -n      Cloud count (default 5)
  --model, -m      Model id (default: ${DEFAULT_MODEL})
  --promote        Copy staged PNG into public/assets
  --dest           Destination path for --promote

Examples:
  npm run generate -- --category animals --letter c
  npm run generate -- --category animals --all --model ${BATCH_MODEL}
  npm run generate -- --category clouds --count 5
  npm run generate -- --promote staging/cat.png --dest public/assets/animals/cat.png
`);
}

async function generateToStaging(
  name: string,
  prompt: string,
  model: string,
): Promise<string> {
  console.log(`Generating ${name}...`);
  const buffer = await generateImage(prompt, model);
  await mkdir(STAGING, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = resolve(STAGING, `${name}-${stamp}.png`);
  await savePng(buffer, out);
  console.log(`  → staged: ${out}`);
  return out;
}

async function finalizeAsset(
  stagedPath: string,
  destRelative: string,
  category: string,
  resize: { width?: number; height?: number },
  letter?: string,
): Promise<void> {
  const dest = resolve(ROOT, destRelative);
  const dims = await promoteFile(stagedPath, dest, resize);
  const webPath = toWebPath(dest);
  await updateManifest({
    path: webPath,
    width: dims.width,
    height: dims.height,
    category,
    letter,
  });
  console.log(`  → published: ${destRelative}`);
}

async function runCategory(args: CliArgs): Promise<void> {
  const model = args.model ?? DEFAULT_MODEL;
  const category = args.category!;

  switch (category) {
    case 'tree':
    case 'environment': {
      const staged = await generateToStaging('tree', treePrompt(), model);
      await finalizeAsset(
        staged,
        'public/assets/environment/tree.png',
        'environment',
        { width: 400, height: 500 },
      );
      if (category === 'environment') {
        const grass = await generateToStaging('grass', grassPrompt(), model);
        await finalizeAsset(
          grass,
          'public/assets/background/grass.png',
          'background',
          { width: 512, height: 256 },
        );
      }
      break;
    }
    case 'person':
    case 'characters': {
      const staged = await generateToStaging('person', personPrompt(), model);
      await finalizeAsset(
        staged,
        'public/assets/characters/person.png',
        'characters',
        { width: 400, height: 200 },
      );
      break;
    }
    case 'clouds': {
      const count = args.count ?? 5;
      for (let i = 0; i < count; i++) {
        const staged = await generateToStaging(`cloud-${i}`, cloudPrompt(i), model);
        await finalizeAsset(
          staged,
          `public/assets/clouds/cloud-${i}.png`,
          'clouds',
          { width: 320, height: 180 },
        );
      }
      break;
    }
    case 'grass': {
      const staged = await generateToStaging('grass', grassPrompt(), model);
      await finalizeAsset(
        staged,
        'public/assets/background/grass.png',
        'background',
        { width: 512, height: 256 },
      );
      break;
    }
    case 'ui': {
      const staged = await generateToStaging('thought-bubble', thoughtBubblePrompt(), model);
      await finalizeAsset(
        staged,
        'public/assets/ui/thought-bubble.png',
        'ui',
        { width: 128, height: 96 },
      );
      break;
    }
    case 'animals': {
      const letters = args.all
        ? Object.keys(ANIMALS)
        : args.letter
          ? [args.letter.toLowerCase()]
          : [];
      if (letters.length === 0) {
        throw new Error('Use --letter <a-z> or --all for animals category');
      }
      const batchModel = args.model ?? BATCH_MODEL;
      for (const letter of letters) {
        const animalName = ANIMALS[letter];
        if (!animalName) continue;
        const fileName = getAnimalFileName(letter);
        const staged = await generateToStaging(
          fileName,
          animalPrompt(animalName),
          batchModel,
        );
        await finalizeAsset(
          staged,
          `public/assets/animals/${fileName}.png`,
          'animals',
          { width: 256, height: 256 },
          letter,
        );
      }
      break;
    }
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

async function runPromote(args: CliArgs): Promise<void> {
  if (!args.promote || !args.dest) {
    throw new Error('--promote and --dest are required together');
  }
  const src = resolve(process.cwd(), args.promote);
  const dest = resolve(ROOT, args.dest);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  const dims = await promoteFile(dest, dest);
  await updateManifest({
    path: toWebPath(dest),
    width: dims.width,
    height: dims.height,
    category: basename(dirname(args.dest)),
  });
  console.log(`Promoted ${args.promote} → ${args.dest}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.promote) {
    await runPromote(args);
    return;
  }
  if (!args.category) {
    printHelp();
    process.exit(1);
  }
  await runCategory(args);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
