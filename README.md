# MailOps

Email operations dashboard for shared sales inboxes. A NestJS API syncs IMAP mail into Postgres, classifies each message by topic and priority with an LLM, and generates structured summaries with key findings and recommended actions. The Next.js + Mantine UI shows threads, read/reply state, classification badges and stats.

## How it works

1. **Sync** — a background poll connects to every configured IMAP account and stores new messages from the inbox and sent mailboxes, along with their `\Seen` and `\Answered` flags and threading headers.
2. **Classify** — an LLM assigns a `topic` (`sales` | `marketing`) and a `priority` (`urgent` | `high` | `medium` | `low`) to every message that doesn't have one yet, in batches, with structured output validated against a Zod schema.
3. **Summarise** — the classified inbox is fed to a second model as statistics plus per-message context, which returns an overview, key findings and recommended actions. Exactly one summary row is kept, upserted on each run.

## Stack

| | |
|---|---|
| API | NestJS 11, TypeORM, Postgres, LangChain (`@langchain/openai`) |
| Web | Next.js 16 (App Router), React 19, Mantine 9 |
| Auth | JWT in an httpOnly cookie |
| Repo | Yarn workspaces (`api`, `web`) |

## Getting started

### Prerequisites

- Node 20+ and Yarn
- A Postgres database
- An OpenAI API key
- IMAP credentials for at least one mailbox

### Setup

```bash
git clone <repo-url> mailops
cd mailops
yarn install

cp api/.env.example api/.env
cp web/.env.example web/.env
```

Fill in `api/.env`:

| Variable | Notes |
|---|---|
| `PORT` | API port, defaults to `5020` |
| `WEB_URL` | Frontend origin, added to the CORS allowlist |
| `DB_*` | Postgres host, port, username, password, database |
| `AUTH_SECRET` | Required — the API refuses to start without it. `openssl rand -base64 48` |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Seeds the initial login during the first migration |
| `OPENAI_API_KEY` | Used by both the classifier and the summariser |
| `MAIL_ACCOUNTS` | JSON array of mailboxes to seed. `port`/`secure`/`user`/`inbox`/`sent` are optional |
| `IMAP_POLL_SECONDS` | Poll interval, defaults to `60` |

Set `NEXT_PUBLIC_API_URL` in `web/.env` to the API's base URL (e.g. `http://localhost:5020`).

### Run

```bash
yarn migration:run   # create the schema and seed the admin user + mail accounts
yarn dev             # API and web together
```

`yarn dev:api` and `yarn dev:web` run them individually. The dashboard is at `http://localhost:3000`; log in with the admin credentials from `api/.env`.

## Scheduled work

| Job | Schedule |
|---|---|
| IMAP poll | Every `IMAP_POLL_SECONDS` (default 60s), re-entrancy guarded |
| Classification | Daily at midnight (Europe/London), drains the backlog in batches |
| Summary | Daily at midnight (Europe/London), over the previous day |

Both daily jobs can be triggered on demand from the AI Prompt panel in the UI.

## API

All routes are prefixed with `/api` and require the auth cookie unless noted.

| Method | Route | |
|---|---|---|
| `POST` | `/api/auth/login` | Public. Sets the session cookie |
| `POST` | `/api/auth/logout` | |
| `GET` | `/api/auth/me` | Current session |
| `GET` | `/api/stats` | Dashboard counters |
| `GET` | `/api/messages` | Paginated, filter by `accountEmail`, `subject`, `dateFrom`, `sortBy` |
| `GET` | `/api/messages/subjects` | Distinct subjects, for the filter dropdown |
| `GET` | `/api/messages/:id` | |
| `GET` | `/api/accounts` | Configured mailboxes |
| `GET` | `/api/prompt` | The stored prompt |
| `PUT` | `/api/prompt` | Upsert the prompt |
| `POST` | `/api/prompt/run` | Generate a summary now |
| `POST` | `/api/prompt/classify` | Classify pending messages now |
| `GET` | `/api/summary/latest` | The current summary, or `null` |

## Migrations

The schema is managed entirely by migrations — `synchronize` is off in every environment.

```bash
yarn migration:show                       # what's pending
yarn migration:run                        # apply
yarn workspace mailops-api migration:generate   # after changing an entity
```

## Repository layout

```
api/
  src/ai/           classification + summarisation services, prompts, Zod schemas
  src/imap/         mailbox polling and message ingestion
  src/messages/     message entity, queries, classification statistics
  src/summaries/    the single-row summary
  src/tasks/        cron jobs
  src/migrations/   schema history
web/
  src/app/          App Router pages
  src/components/   dashboard cards, modals, filters
  src/services/     API clients
```

## Notes

- The IMAP poll searches the **last 3 days** only. Requesting a longer summary window returns less data than expected until that search is widened.
- Classification sends the model array indices rather than database ids — a model mistyping one character of a UUID used to invalidate a whole batch.
- A classification batch that fails is skipped for the remainder of that run and retried on the next one; failures are logged and returned in the response.
