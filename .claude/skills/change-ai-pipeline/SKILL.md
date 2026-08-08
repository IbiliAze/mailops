---
name: change-ai-pipeline
description: Change MailOps classification or summary AI behaviour safely. Use for model swaps, structured-output schemas, system prompts, topic or priority taxonomies, batching and concurrency, retry behaviour, stored prompts, scheduled AI work, or matching UI/API types.
---

# Change AI Pipeline

Treat the model response schema, persistence fields, API DTOs and UI rendering
as one contract. Trace every consumer before changing a label or shape.

## Classification workflow

1. Read `ai/models.service.ts`, `ai/classification.service.ts`,
   `ai/schemas/classification.schma.ts`, the `Message` entity, response DTOs,
   and web message types/components.
2. Preserve the privacy/reliability boundary: the model sees array indexes,
   subjects and trimmed bodies, not database UUIDs.
3. Require exactly one unique, in-range result for every input. Validate before
   any classification is saved.
4. Preserve group isolation, bounded concurrency, the run time/message budgets,
   failed-id parking and the failed-batch limit.
5. A new persisted topic/priority value may require a migration, DTO/type
   changes, filter/badge changes and tests.

## Summary workflow

1. Read `ai/ai.service.ts`, `ai/schemas/summary.schema.ts`, all templates,
   `messages.service.ts#getClassificationStatistics`, `summaries`, prompt DTOs,
   and web summary/prompt types.
2. Keep structured output validation and the instruction to state only facts
   present in supplied statistics.
3. Verify the requested time range against ingestion's three-day IMAP window.
   A longer summary window cannot recover mail that was never synced.
4. Preserve the single-current-summary behaviour unless historical summaries
   are an explicit schema/product change.

## Verification

Add unit coverage for deterministic transformation and validation logic. Do not
make live model calls in routine unit tests. Run `yarn typecheck`, `yarn test`,
and `yarn build`, then manually exercise classify and summary actions with a
small non-sensitive dataset.
