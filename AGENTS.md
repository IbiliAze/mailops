# MailOps repository guide

Use this file as the first source of repository-specific context. Then read the
README in the workspace you are changing and any matching `.claude/skills/*`.

## Product and architecture

MailOps syncs shared IMAP inboxes into Postgres, tracks message/reply state,
classifies messages with OpenAI and produces an actionable summary.

```text
api/   NestJS + TypeORM + IMAP + OpenAI + scheduled work
web/   Next.js static export + React + Mantine
```

The web browser uses cookie auth and calls `/api` through the web container in
production. The shared proxy must never expose `mailops-api` directly.

## Start and verify

```bash
cp .env.example .env
yarn setup
yarn dev

yarn typecheck
yarn test
yarn build
```

Use the narrowest relevant checks while iterating, then run all three final
checks above for cross-workspace or deployment changes. Do not run API lint
just to inspect problems: its configured command uses `--fix`.

## Non-obvious rules

### Configuration

The canonical file is the repo-root `.env`. The API also accepts legacy
`api/.env(.local)` overrides. Never commit any env file. Production gets the
entire root `.env` from the protected GitLab `PROD_ENV` variable.

`MAIL_ACCOUNTS`, `ADMIN_USERNAME` and `ADMIN_PASSWORD` are consumed by the
initial migration. They do not continuously reconcile existing records.

### Database

`synchronize` is off by design. Every entity change needs an explicit migration
under `api/src/migrations`. Review generated SQL, especially destructive or
non-null changes, and write a down migration where reversal is honest.

Production runs compiled migrations before every API start. They must be safe
to execute when no migration is pending.

### Mail ingestion

Keep `(accountEmail, mailbox, uid)` unique. Existing records are not no-ops:
their `Seen` and `Answered` flags are refreshed. Always handle IMAP client's
`error` event and always release mailbox locks/logout in `finally` blocks.

One API replica is intentional. The timers, cron jobs and IMAP polling are
process-local and have no distributed lock.

### AI processing

Structured output is validated with Zod. The classifier maps model-visible
array indexes back to private database ids and requires a complete, unique set
of indexes. Preserve batch isolation, concurrency limits, time budgets and
failed-id parking when changing it.

Prompt/schema/UI changes often cross `api/src/ai`, `api/src/prompts`, API DTOs,
and `web/src/types` or components. Trace the full contract before editing.

### Web

This is a static Next export. Browser data loads after hydration through
`web/src/services`; request-time Next features are unavailable. API URLs must
go through `apiUrl()` and requests must include credentials.

Read `web/AGENTS.md` and the relevant installed Next 16 guide before changing
framework behaviour. Keep the marketing page and dashboard as separate routes.

### Brand

MailOps owns its logo; Eight Mile is the maker attribution. Keep the header
byline, footer logo attribution and Eight Mile SaaS link aligned. Logo changes
must cover all component, SVG and favicon/apple-icon representations.

## Deployment

Mirror JobOps unless there is a documented reason to diverge:

- main-only GitLab deploy on runner `app-primary`;
- image tag is `$CI_PIPELINE_ID`;
- one image, `mailops-api` and `mailops-web` services;
- both listen on 5000 in separate containers;
- shared external `monitoring-network` and `db-network`;
- database at `haproxy:5432`, not in the production stack;
- public domain `mailops.eightmile.co.uk` reaches `mailops-web:5000`;
- migrations retry before the API starts;
- shared `proxy_nginx` config is validated before reload.

The web service is Nginx because Next is exported statically. It serves
`web/out` and proxies `/api` to the private API. Do not add a direct `/api`
location to the shared proxy.

## Skills

- `.claude/skills/add-mail-account` for mailbox onboarding/change.
- `.claude/skills/db-migration` for entity/schema changes.
- `.claude/skills/debug-mail-sync` for missing or stale mail.
- `.claude/skills/change-ai-pipeline` for model, schema, prompt and batching work.

Update the relevant README, AGENTS guidance and skill when an architectural
change makes their instructions inaccurate.
