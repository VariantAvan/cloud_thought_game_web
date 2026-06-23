# Cloud Thoughts

A browser game: lie in a meadow, press letter keys, and watch clouds transform into animals.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal. Press **Start** on the menu to play. Press `a`–`z` to show a thought bubble and transform a cloud into an animal. Press **Ctrl+Q** during the game to return to the menu.

## Credits

Edit [`content/credits.md`](content/credits.md) to change what the Credits button displays. Save and refresh the browser to see updates.

Running [`scripts/backup.ps1`](scripts/backup.ps1) before each GitHub push auto-increments **Version No.** in the credits file (and `package.json`).

## Play offline (double-click)

Build a single HTML file you can open directly in the browser — no server required:

```bash
npm run build:standalone
```

Then double-click **`play.html`** in the project folder. Regenerate after code changes (`play.html` is not updated during `npm run dev`).

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
