# Backup Guide

GitHub is the **source of truth** for this project. The live website is a deploy artifact built from `main`.

## Initial setup

1. Create a **private** repository on GitHub (e.g. `web-cloud-game`).
2. From the project root:

```bash
git init
git add -A
git commit -m "Initial commit: cloud thoughts game"
git branch -M main
git remote add origin https://github.com/<username>/web-cloud-game.git
git push -u origin main
```

Replace `<username>` and repo name with yours.

## What to commit

| Include | Exclude (`.gitignore`) |
|---------|------------------------|
| `src/`, game code | `node_modules/` |
| `tools/asset-generator/` source | `dist/` |
| `public/assets/` approved PNGs | `.env`, API keys |
| `manifest.json` | `tools/asset-generator/staging/` |
| `docs/`, workflows | `tools/asset-generator/.env` |
| `package-lock.json` | |

## Backup rhythm

| When | Action |
|------|--------|
| After each dev session | `git add -A && git commit -m "describe change" && git push` |
| Weekly minimum | Push even small changes |
| After AI asset batch | Commit new PNGs + `manifest.json` in the same commit |
| Milestones | `git tag v0.1.0 && git push origin v0.1.0` |

## Automated local backup (Windows)

Use `scripts/backup.ps1` to commit and push if there are changes:

```powershell
.\scripts\backup.ps1
```

### Schedule with Task Scheduler

1. Open **Task Scheduler** → Create Basic Task.
2. Trigger: Daily (or weekly) at a time your PC is usually on.
3. Action: Start a program
   - Program: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\coding_projects\web_cloud_game\game\scripts\backup.ps1"`
4. Finish. GitHub stores every successful push.

## CI safety net

`.github/workflows/ci.yml` runs `npm ci && npm run build` on every push and pull request to `main`. A failing build blocks merging broken code.

## Recovery

```bash
git clone https://github.com/<username>/web-cloud-game.git
cd web-cloud-game
npm install
npm run dev
```

Restore a milestone:

```bash
git checkout v0.1.0
```

Redeploy any commit via your host (re-run deploy workflow or push to `main`).

## Branch model

- `main` — stable, deployable
- `dev` (optional) — experiments; merge to `main` when ready

Never commit secrets. If a key is accidentally pushed, revoke it in Google AI Studio immediately and rotate.
