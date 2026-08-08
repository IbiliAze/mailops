# mailops-web

Next.js 16 App Router UI using React 19 and Mantine 9. `/` is the marketing
site; `/dashboard` contains login, mailbox filters, statistics, messages,
summary and AI prompt controls.

```bash
yarn dev:web            # http://localhost:3000
yarn build:web          # writes web/out
yarn workspace mailops-web typecheck
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5020` locally. Production builds it
as an empty string: requests become same-origin `/api/...` calls, and the web
container proxies them to the private API service.

## Layout

```text
src/app/                 routes, metadata and Mantine provider
src/components/          dashboard, marketing and shared controls
src/services/            typed fetch functions and API URL helper
src/styles/              global tokens plus CSS modules
src/types/               API/UI shapes
public/brand/            reusable SVG brand assets
```

`next.config.ts` uses `output: 'export'`. Do not add server components that
require request-time data, route handlers, middleware or server actions without
changing the production architecture. The deploy image serves `web/out` using
Nginx and resolves route paths with `.html` fallbacks.

## UI rules

- Keep `/` available as a marketing page; the web healthcheck depends on it.
- Keep API calls behind `services/api-url.ts` so local cross-origin and
  production same-origin modes both work.
- Fetch with `credentials: 'include'`; auth is an httpOnly `session` cookie.
- `DashboardHeader` is fixed, so dashboard content must retain enough top
  offset at desktop and mobile sizes.
- `BrandMark` owns the header lockup and Eight Mile byline. The footer uses the
  standalone `MailOpsMark` next to its attribution.
- When the logo geometry changes, update the component mark, public SVGs,
  `app/icon.svg`, `favicon.ico` and `apple-icon.png` together.
- Read the versioned Next.js docs in `node_modules/next/dist/docs/` before using
  framework APIs; this repository runs Next 16.
