# Next Steps — Cloud Thoughts

Pick up here when you return to the project. Current version is in [`content/credits.md`](../content/credits.md).

## Where things stand

**Done and working**

- Browser game: meadow scene, drifting clouds, letter keys → thought bubble + cloud → animal
- Clouds slow down (not stop), morph to animals, revert after ~4s, speed back up
- Animated dog: sit, pant, circle run, optional grass click destination, tree run, lie by feet
- Start menu, credits screen, **Ctrl+Q** back to menu
- Offline Gemini asset generator (`tools/asset-generator/`)
- Person + tree PNGs in `public/assets/` (AI-generated)
- Standalone **`play.html`** — double-click to play (`npm run build:standalone`)
- GitHub backup via `scripts/backup.ps1` (auto-bumps version)
- CI + deploy workflows in `.github/workflows/`

**Resume dev**

```bash
cd C:\coding_projects\web_cloud_game\game
git pull origin main
npm install
npm run dev
```

---

## Art and assets (high impact)

1. **Generate remaining sprites** — clouds (5 variants), all A–Z animals, optional dog sprite
   - `npm run generate -- --category clouds --count 5`
   - `npm run generate -- --category animals --all`
   - Use `remove-bg` + `--promote` workflow in [`tools/asset-generator/README.md`](../tools/asset-generator/README.md)

2. **Wire cloud morph animation** — WIP tooling exists (`cloud-morph.ts`, `cloud-loop.ts`, staging GIF). Use generated frames or sprite sheet for cloud → animal transition instead of instant swap.

3. **Embed PNGs in `play.html`** — standalone build uses placeholders unless images are imported/bundled; either inline base64 at build time or ship a small folder next to `play.html`.

4. **Tune layout for real art** — [`src/rendering/imageBounds.ts`](../src/rendering/imageBounds.ts) and scene constants may need adjustment once final person/tree/cloud sizes are set.

5. **Dog sprite** — replace canvas placeholder dog with a generated sprite sheet (sit / pant / run / lie frames).

---

## Gameplay and polish

6. **Sound** — soft ambient meadow loop; optional chime per letter or animal morph.

7. **Mobile / touch** — on-screen letter keyboard; tap grass for dog destination (click already works on desktop).

8. **Visual polish** — bubble fade tweaks, animal scale-in, cloud wobble; optional parallax on sky/grass.

9. **Dog behavior** — interrupt circle/tree run when player clicks grass mid-routine; queue multiple click targets.

10. **More animals or words** — extend beyond A–Z or spell short words across multiple cloud transforms.

---

## Menu and UX

11. **Instructions on start screen** — brief “press letters / click grass / Ctrl+Q to quit” hint.

12. **Settings** — volume, slower cloud speed, toggle dog auto-behavior.

13. **Credits** — add asset attributions as you generate art; link to your site or GitHub.

---

## Deploy and share

14. **Publish live** — follow [`docs/HOSTING_GUIDE.md`](HOSTING_GUIDE.md): enable GitHub Pages or connect Netlify/Vercel; set `base` in `vite.config.ts` if using project Pages URL.

15. **Smoke test deployed build** — menu, game, credits, assets load over HTTPS.

16. **Share `play.html`** — rebuild after changes; zip `play.html` for friends who want offline play without Node.

---

## Tooling and repo

17. **Batch asset pipeline** — script that generates → remove-bg → promote all animals in one command.

18. **Commit approved art** — keep `staging/` gitignored; promote good PNGs to `public/assets/` and backup.

19. **Tag releases** — `git tag v0.2.0` on milestones after major features.

20. **Task Scheduler** — schedule `scripts/backup.ps1` daily (see [`docs/BACKUP_GUIDE.md`](BACKUP_GUIDE.md)).

---

## Bigger ideas (later)

- Multiplayer thought bubbles via WebSocket
- Day/night cycle or weather
- Phaser migration if you add levels or platformer movement
- Conversational multi-turn Nano Banana edits per sprite in the asset CLI

---

## Quick commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Offline play file | `npm run build:standalone` → open `play.html` |
| Production build | `npm run build` |
| Backup + push | `.\scripts\backup.ps1` |
| Generate one animal | `npm run generate -- --category animals --letter c` |
