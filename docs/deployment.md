# Deployment guide

BookNest builds to static files. Any static host can serve `dist/`.

## Local production check

```bash
npm ci
npm run build
npm run preview
```

Open <http://localhost:4173>.

`npm run build` also runs `scripts/check-build.mjs`, which verifies that:

- all five HTML pages exist in `dist/`;
- build-time partials were resolved;
- no external HTTP asset URLs are present;
- every protected page references a relative JavaScript bundle;
- a CSS bundle was emitted.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`.

1. Publish the repository to GitHub.
2. Open **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually).
5. The deploy job waits for the **CI** workflow to complete successfully.

Vite is configured with `base: './'`, so relative assets work at both:

- `https://<owner>.github.io/booknest-library/`
- a custom domain at the site root

Internal JavaScript redirects use `document.baseURI`, so the login guard also respects the project
subpath. Do not switch to root-absolute `/...` links without revisiting the base configuration.

## Headers and caching

GitHub Pages does not allow custom response headers. The app uses a meta Content-Security-Policy as
a partial mitigation, but `frame-ancestors` and several browser policies cannot be set with meta
tags.

If deploying to Netlify, Cloudflare Pages or another host that supports headers, add:

```text
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

The Vite-generated assets are content-hashed; cache them long-term. Serve HTML with
`Cache-Control: no-cache` so new deployments are picked up.

## Rollback

The GitHub Pages workflow deploys the latest successful `main` build. To roll back:

1. Revert the offending commit on `main`.
2. Let CI pass and the Pages workflow deploy.
3. Or re-run the Pages workflow from an earlier successful commit.

## Verification after deployment

- `/` loads the login screen.
- `/dashboard.html` redirects to `/index.html` when signed out.
- Demo login reaches the dashboard.
- `/books.html?q=cosmos&status=Reserved` restores one record.
- `/404.html` renders with the branded fallback.
- Browser console has no CSP or failed-asset errors.
