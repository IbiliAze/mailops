<img src="web/public/brand/mailops-mark.svg" alt="" width="64" height="64" />

# MailOps

MailOps turns shared sales inboxes into a prioritised workspace. It syncs IMAP
mail into Postgres, classifies topic and urgency with an LLM, and produces a
daily summary of findings and next actions.

```text
IMAP accounts → sync + thread → classify → aggregate → action summary
                     │             │            │
                flags/replies   topic/priority  one current report
```

## Quick start

You need Node 22.12+, Yarn 1.x, Docker, an OpenAI API key, and IMAP credentials.

```bash
cp .env.example .env
# Add OPENAI_API_KEY, ADMIN_PASSWORD and optionally MAIL_ACCOUNTS.
yarn setup
yarn dev
```

Open <http://localhost:3000>. The marketing site is `/`; the authenticated app
is `/dashboard`. The API listens on <http://localhost:5020>.

`yarn setup` installs dependencies, starts Postgres on host port 5436, and
applies all TypeORM migrations. The first migration seeds the admin and the
mailboxes from `.env`; changing those seed values later does not update rows.

## What it does

- Polls every configured Inbox and Sent mailbox and stores messages by
  `(accountEmail, mailbox, uid)`.
- Refreshes IMAP `Seen` and `Answered` flags for messages already stored.
- Preserves message ids, references and a thread-root key for conversation
  grouping.
- Classifies unprocessed mail as `sales` or `marketing` and as `urgent`,
  `high`, `medium` or `low`.
- Generates one current structured summary with an overview, findings and
  recommended actions.
- Keeps credentials in an httpOnly, same-site session cookie.

The IMAP poll currently searches the last three days. Classification and
summary jobs run daily at midnight in `Europe/London`; polling defaults to every
60 seconds. Both AI tasks can also be run from the dashboard.

## Architecture

```text
mailops/
├── api/                    NestJS 11, TypeORM, IMAP, AI and scheduling
│   └── src/
│       ├── accounts/       encrypted-at-rest is not implemented; see security note
│       ├── imap/           mailbox sync
│       ├── messages/       storage, filters and statistics
│       ├── ai/             classification and summary model calls
│       ├── prompts/        stored prompt and manual AI triggers
│       ├── summaries/      single current summary
│       ├── tasks/          timers and cron jobs
│       └── migrations/     authoritative schema history
├── web/                    Next.js 16 static export, React 19, Mantine 9
├── deploy/docker/          production Swarm stack and API entrypoint
├── deploy/nginx/           internal web and shared proxy configs
└── .claude/skills/         repeatable maintenance workflows
```

The API and web package READMEs contain their local module and UI details:
[api/README.md](api/README.md) and [web/README.md](web/README.md).

## Commands

```bash
yarn dev              # API and web in watch mode
yarn build            # production API + static web export
yarn typecheck        # both workspaces
yarn lint             # both workspaces; API lint currently fixes files
yarn test             # API unit tests

yarn db:up            # local Postgres
yarn db:down
yarn db:logs
yarn migration:show
yarn migration:run
yarn migration:generate
```

## Configuration

Configuration lives in one root `.env`; see [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `PORT` | Local API port; production compose forces 5000 |
| `WEB_URL` | Browser origin allowed by CORS |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | Postgres connection |
| `AUTH_SECRET` | JWT signing secret, minimum 32 characters |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Admin created by the initial migration |
| `OPENAI_API_KEY` | Classification and summary models |
| `MAIL_ACCOUNTS` | One-line JSON array seeded by the initial migration |
| `IMAP_POLL_SECONDS` | Poll interval; default 60 |
| `NEXT_PUBLIC_API_URL` | Local API origin; empty in production for same-origin requests |

`accounts.pass` currently stores IMAP passwords as plaintext in Postgres. Treat
database access and backups as secret-bearing, and add application-level
encryption before widening access to the system.

## Deployment

Production mirrors JobOps on the shared Docker Swarm host. Pushes to `main`
build `mailops:$CI_PIPELINE_ID` and deploy two services from one image:

```text
Internet
  → shared proxy (TLS)
  → mailops-web:5000 (static UI; /api proxy)
  → mailops-api:5000
  → haproxy:5432
  → shared Postgres
```

Files involved:

| File | Responsibility |
| --- | --- |
| `.gitlab-ci.yml` | build, Swarm deploy, proxy config install/reload |
| `Dockerfile` | one image containing both built workspaces |
| `deploy/docker/docker-compose.prod.yml` | API/web services and shared networks |
| `deploy/docker/api-entrypoint.sh` | retry migrations, then start Nest |
| `deploy/nginx/web.conf` | serve static export and proxy `/api` privately |
| `deploy/nginx/mailops.conf` | `mailops.eightmile.co.uk → mailops-web:5000` |

Postgres is not deployed by this repository. In production the API joins the
external `db-network` and connects to `haproxy:5432`; both app services use the
external `monitoring-network`. Create the production role and `mailops` database
once before the first deploy.

Create one protected GitLab variable named `PROD_ENV` containing the whole
production `.env`. Start from `.env.example`, set `WEB_URL` to
`https://mailops.eightmile.co.uk`, set `DB_HOST=haproxy` / `DB_PORT=5432`, and
replace every credential. Multi-line GitLab variables cannot be masked, so mark
it Protected. `PORT` is set to 5000 in production compose.

## Extending MailOps

Read [AGENTS.md](AGENTS.md) before changing the system. Repeatable workflows are
available under `.claude/skills/`:

- `add-mail-account` — add a mailbox without mistaking seed config for updates.
- `db-migration` — change entities and produce a safe TypeORM migration.
- `debug-mail-sync` — trace IMAP connection, search, parsing and persistence.
- `change-ai-pipeline` — change models, schemas, prompts or batch behaviour.
