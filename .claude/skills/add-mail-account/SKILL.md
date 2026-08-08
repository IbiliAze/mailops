---
name: add-mail-account
description: Add or change a monitored IMAP mailbox in MailOps. Use when onboarding an inbox, changing connection folders or credentials, deciding between seed config and a migration, or verifying that a mailbox is visible and synchronising.
---

# Add Mail Account

Follow the data path from configuration to Postgres to IMAP. Do not assume that
editing `MAIL_ACCOUNTS` updates an already-initialised database.

## Choose the change path

1. For a brand-new empty database, add the account object to the one-line
   `MAIL_ACCOUNTS` JSON before the initial migration runs.
2. For any existing environment, add/update the row with an explicit TypeORM
   migration, or build an authenticated management endpoint if that is the
   requested product feature.
3. Never edit an already-applied migration. Create a new timestamped migration.

The account fields are `label`, `email`, `employeeName`, `host`, `port`,
`secure`, `user`, `pass`, `inbox` and `sent`. `email` is unique. Defaults are
993, TLS enabled, login user equal to email, `INBOX`, and `Sent`.

## Workflow

1. Read `api/src/accounts/entities/account.entity.ts`, the latest migrations,
   `api/src/imap/imap.service.ts`, and the target provider's folder names.
2. Confirm whether the requested change is a first-install seed or an existing
   database update.
3. For a migration, use the `db-migration` skill. Parameterise credentials in
   SQL; do not log them or put real passwords in repository files.
4. Verify the Inbox and Sent mailbox names exactly. Providers commonly use
   `Sent`, `Sent Mail`, or a nested namespace.
5. Run `yarn typecheck`, `yarn test:api`, and `yarn build:api`.
6. Start the API and confirm logs show both mailbox syncs. Query counts by
   `accountEmail` rather than exposing credentials through the API.

## Security boundary

`accounts.pass` is currently plaintext. Treat database dumps, logs and admin
tools as secret-bearing. Never add password fields to `AccountResponse` or UI
types. Prefer application-level encryption before adding self-service account
management.
