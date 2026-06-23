# Hosting Guide

This guide covers publishing **only the game** to the web. The offline asset generator (`tools/asset-generator/`) and API keys are never deployed.

## What gets published

After `npm run build`, the `dist/` folder contains everything players need:

- `index.html` and bundled JavaScript
- `assets/` (from `public/assets/`)

## Pre-deploy checklist

1. `npm install`
2. `npm run build` — must complete without errors
3. `npm run preview` — open locally and verify:
   - Sky, grass, person, and tree render
   - Clouds drift across the sky
   - Pressing `a`–`z` shows a thought bubble and transforms a cloud
4. Deploy the `dist/` folder (or connect Git for auto-deploy)

**No environment variables** are required on any host. Do not add `GEMINI_API_KEY` to hosting dashboards.

---

## Option 1: GitHub Pages (recommended)

Best if your code is already on GitHub.

### One-time setup

1. Push this repo to GitHub (see [BACKUP_GUIDE.md](BACKUP_GUIDE.md)).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. If your repo is not at the root URL (e.g. `username.github.io/web-cloud-game/`), set the Vite base path in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/web-cloud-game/', // your repo name
});
```

4. The included workflow `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

### Your site URL

`https://<username>.github.io/<repo-name>/`

### Manual deploy (alternative)

```bash
npm run build
# Upload contents of dist/ to gh-pages branch or Pages artifact
```

---

## Option 2: Netlify

1. Sign in at [netlify.com](https://www.netlify.com) and **Add new site → Import an existing project**.
2. Connect your GitHub repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Netlify rebuilds on every push to `main`.
5. Optional: **Domain settings** → add a custom domain; Netlify provisions HTTPS automatically.

---

## Option 3: Vercel

1. Sign in at [vercel.com](https://vercel.com) and **Add New Project**.
2. Import the GitHub repo.
3. Framework preset: **Vite** (or Other with build `npm run build`, output `dist`).
4. Deploy. Auto-redeploys on push.

---

## Option 4: Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select the repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Save and deploy.

---

## Custom domain (any host)

1. Purchase a domain from a registrar.
2. In your host’s DNS settings, add a **CNAME** record pointing to the host (e.g. `your-site.netlify.app`).
3. Enable HTTPS in the host dashboard (usually automatic).

---

## Post-deploy smoke test

- [ ] Page loads without console errors
- [ ] Scene shows sky, grass, person, tree, drifting clouds
- [ ] Press several letter keys; bubble and animals appear
- [ ] Hard refresh (Ctrl+F5) loads assets correctly
- [ ] Test on a phone (keyboard input may need a future on-screen keyboard)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page on GitHub Pages | Set `base: '/<repo-name>/'` in `vite.config.ts` |
| 404 on assets | Rebuild after changing `base`; clear CDN cache |
| Old art after update | Hard refresh or purge host cache |
| Build fails in CI | Run `npm run build` locally; fix TypeScript errors |
