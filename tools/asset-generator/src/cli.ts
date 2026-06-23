#!/usr/bin/env node
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateImage, refineImage, DEFAULT_MODEL, BATCH_MODEL } from './gemini-client.js';
import { savePng, promoteFile } from './postprocess.js';
import { updateManifest, toWebPath } from './manifest.js';
import { archiveApprovedAsset, STAGING } from './paths.js';
import {
  treePrompt,
  treeRefinePrompt,
  cloudPrompt,
  grassPrompt,
  thoughtBubblePrompt,
} from './prompts/environment.js';
import { personPrompt, personRefinePrompt } from './prompts/characters.js';
import { ANIMALS, animalPrompt, getAnimalFileName } from './prompts/animals.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const ASSETS = resolve(ROOT, 'public/assets');

interface CliArgs {
  category?: string;
  letter?: string;
  all?: boolean;
  count?: number;
  model?: string;
  promote?: string;
  dest?: string;
  refine?: string;
  notes?: string;
  stageOnly?: boolean;
  variants?: number;
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
    else if (a === '--refine') args.refine = argv[++i];
    else if (a === '--notes') args.notes = argv[++i];
    else if (a === '--stage-only') args.stageOnly = true;
    else if (a === '--variants') args.variants = parseInt(argv[++i], 10);
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
  --refine         Refine an existing PNG (image-to-image edit)
  --notes          Extra refinement instructions (with --refine)
  --stage-only     Save to staging/ only; do not publish to public/assets
  --variants       Generate N drafts to staging (person, tree categories)
  --promote        Copy staged PNG into public/assets
  --dest           Destination path for --promote

Examples:
  npm run generate -- --category person --model gemini-3-pro-image
  npm run generate -- --category person --variants 3 --stage-only
  npm run generate -- --category tree --variants 3 --stage-only
  npm run generate -- --category person --refine staging/person-....png --notes "softer colors"
  npm run generate -- --category animals --letter c
  npm run generate -- --category animals --all --model ${BATCH_MODEL}
  npm run generate -- --category clouds --count 6 --stage-only
  npm run generate -- --promote staging/cat.png --dest public/assets/animals/cat.png
`);
}

async function generateToStaging(
  name: string,
  prompt: string,
  model: string,
  sourcePath?: string,
): Promise<string> {
  console.log(`Generating ${name}...`);
  const buffer = sourcePath
    ? await refineImage(sourcePath, prompt, model)
    : await generateImage(prompt, model);
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
    case 'tree': {
      const heroModel = args.model ?? 'gemini-3-pro-image';
      const variantCount = args.variants ?? 1;
      const refineSource = args.refine ? resolve(process.cwd(), args.refine) : undefined;
      const prompt = refineSource ? treeRefinePrompt(args.notes ?? '') : treePrompt();

      for (let i = 0; i < variantCount; i++) {
        const suffix = variantCount > 1 ? `-${i + 1}` : '';
        const staged = await generateToStaging(`tree${suffix}`, prompt, heroModel, refineSource);
        if (!args.stageOnly && variantCount === 1) {
          await finalizeAsset(
            staged,
            'public/assets/environment/tree.png',
            'environment',
            { width: 400, height: 500 },
          );
        } else {
          console.log('  → review in staging/; promote when ready');
        }
      }
      break;
    }
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
      const heroModel = args.model ?? 'gemini-3-pro-image';
      const variantCount = args.variants ?? 1;
      const refineSource = args.refine ? resolve(process.cwd(), args.refine) : undefined;
      const prompt = refineSource
        ? personRefinePrompt(args.notes ?? '')
        : personPrompt();

      for (let i = 0; i < variantCount; i++) {
        const suffix = variantCount > 1 ? `-${i + 1}` : '';
        const staged = await generateToStaging(
          `person${suffix}`,
          prompt,
          heroModel,
          refineSource,
        );
        if (!args.stageOnly && variantCount === 1) {
          await finalizeAsset(
            staged,
            'public/assets/characters/person.png',
            'characters',
            { width: 400, height: 200 },
          );
        } else {
          console.log('  → review in staging/; promote when ready');
        }
      }
      break;
    }
    case 'clouds': {
      const count = args.count ?? 5;
      const batchModel = args.model ?? BATCH_MODEL;
      for (let i = 0; i < count; i++) {
        const staged = await generateToStaging(`cloud-${i}`, cloudPrompt(i), batchModel);
        if (!args.stageOnly) {
          await finalizeAsset(
            staged,
            `public/assets/clouds/cloud-${i}.png`,
            'clouds',
            { width: 320, height: 180 },
          );
        } else {
          console.log('  → review in staging/; promote when ready');
        }
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
  await archiveApprovedAsset(args.dest);
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
