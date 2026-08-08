# Web contributor guide

Read `../AGENTS.md` and `README.md` first.

This is Next.js 16, with breaking changes from earlier versions. Read the
relevant guide in `node_modules/next/dist/docs/` before writing framework code
and heed its deprecation notices.

- Keep the app compatible with `output: 'export'`; no runtime-only Next APIs.
- Put backend calls in `src/services`, construct URLs with `apiUrl()`, and send
  cookies with `credentials: 'include'`.
- Keep `/` as marketing and `/dashboard` as the authenticated app.
- Maintain fixed-header content offsets and check both narrow and wide layouts.
- Reuse Mantine and the existing CSS tokens/modules before adding new styling
  systems.
- Keep all logo/favicon variants consistent when changing brand geometry.
- Run web typecheck and build; the export itself is the compatibility test.
