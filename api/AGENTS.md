# API contributor guide

Read `../AGENTS.md` and `README.md` first.

- Controllers return response DTOs; keep persistence entities out of web-facing
  contracts when they contain secrets such as `Account.pass`.
- Add `JwtAuthGuard` to every sensitive endpoint. Authentication is not global
  in this codebase.
- Keep TypeORM `synchronize: false`; use the `db-migration` skill for changes.
- Use repositories through feature modules and export services only when a
  downstream module actually needs them.
- Preserve IMAP resource cleanup, unique message identity and flag refresh.
- Preserve classifier index validation and partial-batch failure isolation.
- Scheduled work requires one replica until distributed locking exists.
- Run API typecheck/tests and the root build after changes.
