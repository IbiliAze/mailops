# mailops-api

NestJS 11 API for IMAP ingestion, message storage, LLM classification,
summarisation, scheduling and cookie-based authentication.

```bash
yarn dev:api
yarn build:api
yarn test:api
yarn workspace mailops-api typecheck
```

## Data flow

```text
TasksService → ImapService → MessagesService → ClassificationService
                                             → AiService → SummariesService
```

`TasksService` starts an interval on module init and owns two midnight cron
jobs. Keep one API replica unless those jobs gain distributed locking.

## Modules

| Module | Responsibility |
| --- | --- |
| `auth` | JWT issue/verification and `session` httpOnly cookie |
| `users` | Admin lookup and DTO mapping |
| `accounts` | Mailbox connection records |
| `imap` | Inbox/Sent search, parse, upsert and flag refresh |
| `messages` | Queries, filters, counters and classification statistics |
| `ai` | OpenAI models, structured schemas, batching and summaries |
| `prompts` | Stored prompt plus manual classify/run endpoints |
| `summaries` | Single current summary row |
| `tasks` | IMAP interval and daily cron orchestration |

All application routes use the global `/api` prefix. Each sensitive controller
adds `JwtAuthGuard`; login and health are public. `GET /api/health` checks the
database and is used by Swarm.

## Schema and migrations

TypeORM entities describe runtime mappings, but migrations are authoritative;
`synchronize` must stay off.

```bash
yarn migration:show
yarn migration:run
yarn migration:generate
```

The source runner loads `src/data-source.ts`; the production entrypoint runs
the same datasource compiled as `dist/data-source.js`. The migration glob is
relative to `__dirname` so both modes resolve correctly.

The initial migration creates and seeds the admin and `MAIL_ACCOUNTS`. It is not
a reconciliation system: edit mailbox rows through a new migration or a future
management endpoint, not by changing `MAIL_ACCOUNTS` after deployment.

## Important invariants

- A message is unique by `(accountEmail, mailbox, uid)`.
- Existing messages still need IMAP flag refreshes.
- The poll searches only the last three days.
- Model classifications use array indexes, not UUIDs; every input index must be
  returned exactly once before results are saved.
- Failed classification groups are parked for the current run so one malformed
  model response does not stall the backlog.
- Exactly one summary row is retained by the summary service.
- IMAP client `error` events must remain handled; an unhandled event can crash
  the process.

See `../.claude/skills/` for migrations, sync debugging, mailboxes and AI changes.
