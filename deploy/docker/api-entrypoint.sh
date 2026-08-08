#!/bin/sh
# Apply pending TypeORM migrations before starting the API. Swarm does not wait
# for HAProxy/Postgres, so the migration itself is the database readiness test.
set -e

ATTEMPTS=30
DELAY=3

i=1
while [ "$i" -le "$ATTEMPTS" ]; do
  if yarn workspace mailops-api migration:run:prod; then
    echo "[entrypoint] migrations applied"
    exec yarn start:api
  fi

  echo "[entrypoint] migrate failed (attempt $i/$ATTEMPTS) — retrying in ${DELAY}s"
  i=$((i + 1))
  sleep "$DELAY"
done

echo "[entrypoint] database unreachable after $ATTEMPTS attempts — giving up" >&2
exit 1
