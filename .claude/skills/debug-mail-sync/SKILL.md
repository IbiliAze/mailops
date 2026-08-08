---
name: debug-mail-sync
description: Diagnose missing, delayed, duplicated, or stale IMAP messages in MailOps. Use for connection failures, incorrect Inbox or Sent folders, unchanged Seen/Answered flags, polling issues, parse failures, or unexpected message counts.
---

# Debug Mail Sync

Trace one mailbox and one UID through connection, search, fetch, parse and
database persistence before changing code.

## Triage

1. Confirm the API is healthy and only one replica is running.
2. Identify the account email, mailbox name, expected message date and UID if
   available. Do not print or request the stored password in logs.
3. Inspect API logs for these stages:
   - `[imap] syncing` — scheduler/account discovery;
   - `INBOX failed` / `SENT failed` — folder-level failure;
   - `client error` or `sync failed` — connection/auth/search failure;
   - `parse failed` — malformed message source;
   - `db write failed` — persistence/constraint failure.
4. Verify the account row's `host`, `port`, `secure`, `user`, `inbox`, and
   `sent` values directly in the protected database environment.
5. Remember the search window is only the last three days. Older mail is
   absent by design unless `ImapService` is extended.

## Invariants to preserve

- Uniqueness is `(accountEmail, mailbox, uid)`; the same UID in Inbox and Sent
  is not a duplicate.
- When a row already exists, refresh `seen` and `answered` rather than skipping
  all work.
- Keep the IMAP `error` listener. Never throw from it.
- Always release mailbox locks and attempt logout in `finally` blocks.
- One failing account must not stop polling the others.

## Verify a fix

Run targeted service tests, `yarn workspace mailops-api typecheck`, and
`yarn build:api`. Exercise a mailbox with a new message plus a message whose
Seen/Answered flag changed. Confirm repeated polling creates no duplicate rows.
