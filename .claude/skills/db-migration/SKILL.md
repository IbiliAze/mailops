---
name: db-migration
description: Create, review, apply, and verify TypeORM migrations for MailOps. Use for entity changes, indexes, constraints, data backfills, mailbox seed changes on existing databases, or any task that changes the Postgres schema or stored data shape.
---

# Database Migration

Migrations under `api/src/migrations` are the schema authority.
`synchronize` must remain false.

## Workflow

1. Read the affected entities and every existing migration touching their
   tables. Check services for assumptions about nullability, uniqueness and
   defaults.
2. Change the entity mapping first.
3. Generate a starting migration when useful:

   ```bash
   yarn migration:generate
   ```

   A working local database and root `.env` are required. A hand-written
   migration is preferable for data backfills or ordering-sensitive changes.
4. Review every SQL statement. Avoid table recreation and accidental column
   drops. For a new required column, normally add nullable/defaulted, backfill,
   then enforce `NOT NULL`.
5. Give the migration a unique increasing timestamp and stable class `name`.
   Never edit a migration that may already have run.
6. Implement `down` only when reversal is safe and honest. Do not pretend a
   destructive data transformation is reversible.
7. Apply and verify:

   ```bash
   yarn migration:show
   yarn migration:run
   yarn migration:show
   yarn typecheck
   yarn test
   yarn build
   ```

## Source and production resolution

`api/src/data-source.ts` is used through ts-node locally and compiled to
`api/dist/data-source.js` in production. Its migration glob is relative to
`__dirname`; preserve that dual-mode behaviour. The production API entrypoint
runs `migration:run:prod` with retries before starting Nest.

The migration runner creates tables inside an existing database. It does not
create the production role or database behind `haproxy:5432`.
