#!/usr/bin/env node
import { readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { removeChromaKey, type KeyMode } from './chroma-key.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CliArgs {
  inputs: string[];
  out?: string;
  dir?: string;
  key: KeyMode;
  tolerance?: number;
  softness?: number;
  inPlace?: boolean;
  suffix: string;
  help?: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { inputs: [], key: 'blue', suffix: '-cutout' };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' || a === '-o') args.out = argv[++i];
    else if (a === '--dir') args.dir = argv[++i];
    else if (a === '--key' || a === '-k') {
      const mode = argv[++i]?.toLowerCase();
      if (mode !== 'blue' && mode !== 'white') {
        throw new Error('--key must be "blue" or "white"');
      }
      args.key = mode;
    } else if (a === '--tolerance' || a === '-t') args.tolerance = parseInt(argv[++i], 10);
    else if (a === '--softness' || a === '-s') args.softness = parseInt(argv[++i], 10);
    else if (a === '--in-place') args.inPlace = true;
    else if (a === '--suffix') args.suffix = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
    else if (!a.startsWith('-')) args.inputs.push(a);
  }

  return args;
}

function printHelp(): void {
  console.log(`
Remove chroma key / white background from generated sprites (offline post-process)

Usage:
  npm run remove-bg -- <image.png> [image2.png ...]
  npm run remove-bg -- --dir staging
  npm run remove-bg -- <image.png> --out <output.png>

Options:
  --key, -k        Key color: blue (default) or white
  --tolerance, -t  Color match tolerance (default: 72 blue, 48 white)
  --softness, -s   Edge feather pixels (default: 36)
  --out, -o        Output path (single input only)
  --dir            Process all PNGs in a folder
  --in-place       Overwrite source files
  --suffix         Suffix for output filename (default: -cutout)

Examples:
  npm run remove-bg -- staging/person-1-....png
  npm run remove-bg -- --dir staging --key blue
  npm run remove-bg -- staging/person.png --key white --out staging/person-transparent.png
`);
}

function outputPath(inputPath: string, args: CliArgs): string {
  if (args.out && args.inputs.length === 1) return resolve(process.cwd(), args.out);
  if (args.inPlace) return resolve(process.cwd(), inputPath);

  const abs = resolve(process.cwd(), inputPath);
  const dir = dirname(abs);
  const base = basename(abs, extname(abs));
  return join(dir, `${base}${args.suffix}.png`);
}

async function collectInputs(args: CliArgs): Promise<string[]> {
  if (args.dir) {
    const dir = resolve(process.cwd(), args.dir);
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter(
        (e) =>
          e.isFile() &&
          e.name.toLowerCase().endsWith('.png') &&
          !e.name.includes('-cutout'),
      )
      .map((e) => join(dir, e.name));
  }
  return args.inputs.map((p) => resolve(process.cwd(), p));
}

async function processFile(inputPath: string, args: CliArgs): Promise<string> {
  const out = outputPath(inputPath, args);
  const buffer = await removeChromaKey(inputPath, {
    key: args.key,
    tolerance: args.tolerance,
    softness: args.softness,
  });
  await writeFile(out, buffer);
  return out;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const inputs = await collectInputs(args);
  if (inputs.length === 0) {
    printHelp();
    process.exit(1);
  }

  if (args.out && inputs.length > 1) {
    throw new Error('--out can only be used with a single input file');
  }

  for (const input of inputs) {
    const out = await processFile(input, args);
    console.log(`${basename(input)} → ${out}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
