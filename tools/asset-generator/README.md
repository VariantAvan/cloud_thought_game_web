# Offline Asset Generator

Local CLI tool that generates game sprites using **Gemini Nano Banana** image models. This tool never runs in the browser and is not deployed with the game.

## Setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env` in this folder.
3. From the repo root: `npm install`
4. From this folder or root: `npm run generate --workspace=asset-generator -- <args>`

## Models

| Alias | Model ID | Use |
|-------|----------|-----|
| Nano Banana | `gemini-2.5-flash-image` | Fast drafts (default) |
| Nano Banana 2 | `gemini-3.1-flash-image` | Higher quality batches |
| Nano Banana Pro | `gemini-3-pro-image` | Hero assets (person, tree) |

Pass `--model gemini-3.1-flash-image` to override.

## Commands

```bash
# Single animal
npm run generate -- --category animals --letter c

# All animals A–Z
npm run generate -- --category animals --all

# Five cloud variants
npm run generate -- --category clouds --count 5

# Person and tree
npm run generate -- --category person
npm run generate -- --category tree

# Person workflow (hero asset — uses Nano Banana Pro by default)
npm run generate -- --category person --variants 3 --stage-only
npm run generate -- --category person --refine tools/asset-generator/staging/person-....png --notes "lighter shirt, clearer face"
npm run remove-bg -- tools/asset-generator/staging/person-....png
npm run remove-bg -- --dir tools/asset-generator/staging --key blue
npm run generate -- --promote tools/asset-generator/staging/person-....-cutout.png --dest public/assets/characters/person.png

# Promote a staged file manually
npm run generate -- --promote tools/asset-generator/staging/cat.png --dest public/assets/animals/cat.png
```

Generated files land in `staging/` for review. Promoted assets are copied to `public/assets/` (game) and `approved/` (archive). Old drafts go in `archive/`.

## Remove background (chroma key)

Generated sprites use a **chroma blue** (`#00B4FF`) or **white** backdrop instead of transparency (models handle solid colors more reliably). Run the offline post-processor before promoting:

```bash
# From repo root — blue screen (default)
npm run remove-bg -- tools/asset-generator/staging/person-....png

# White background
npm run remove-bg -- tools/asset-generator/staging/person-....png --key white

# Batch all staging PNGs
npm run remove-bg -- --dir tools/asset-generator/staging

# Tune edge softness if needed
npm run remove-bg -- staging/person.png --tolerance 80 --softness 48
```

Outputs are saved alongside the source with a `-cutout` suffix (e.g. `person-1-....-cutout.png`). Use `--in-place` to overwrite the original, or `--out path.png` for a single file.

Run from `tools/asset-generator/` with `npx tsx src/remove-bg.ts ...` if npm workspace flag passing is awkward on Windows.

## Security

- Never commit `.env`, `staging/`, `approved/`, or `archive/`.
- Never add `GEMINI_API_KEY` to hosting provider environment variables.
