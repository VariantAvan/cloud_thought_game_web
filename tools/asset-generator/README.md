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

# Promote a staged file manually
npm run generate -- --promote tools/asset-generator/staging/cat.png --dest public/assets/animals/cat.png
```

Generated files land in `staging/` first, then are resized and copied to `public/assets/`. The game `manifest.json` is updated automatically.

## Security

- Never commit `.env` or `staging/`.
- Never add `GEMINI_API_KEY` to hosting provider environment variables.
