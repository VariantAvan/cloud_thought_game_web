# Cloud Thoughts

A browser game: lie in a meadow, press letter keys, and watch clouds transform into animals.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal. Press `a`–`z` to show a thought bubble and transform a cloud into an animal.

## Build

```bash
npm run build
npm run preview
```

## Project layout

- `src/` — game (TypeScript + Canvas)
- `public/assets/` — sprites (placeholders until you generate art)
- `tools/asset-generator/` — offline Gemini/Nano Banana asset CLI
- `docs/` — hosting and backup guides

## Generate AI assets (offline)

See [tools/asset-generator/README.md](tools/asset-generator/README.md).

## Deploy & backup

- [docs/HOSTING_GUIDE.md](docs/HOSTING_GUIDE.md)
- [docs/BACKUP_GUIDE.md](docs/BACKUP_GUIDE.md)
