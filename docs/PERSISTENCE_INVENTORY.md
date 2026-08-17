# Operator Mode persistence inventory

This inventory was completed before the Supabase implementation. It documents the actual application state rather than assuming a generic training model.

## State that survived refreshes before the upgrade

The active `skadra.operator-mode.state.v1` localStorage snapshot contained:

- profile display name and operating title
- last open application view and active level
- per-level maximum unlocked step
- knowledge-check answers and score
- practice and project drafts
- boss-battle answer and score
- reflections and level completion timestamps
- field mission logs
- relationship records and follow-up dates
- customer-experience audits and metric scores
- operations process maps
- weekly journal entries
- vending location pipeline records and stages
- Gabi's independent Founders Mode assessments
- aggregate creation and update timestamps

An older `skadra.operator-mode.progress.v1` key may also contain completed lesson IDs, the last lesson ID, and an update timestamp.

## State that was derived

XP, rank, campaign completion, and achievement eligibility were calculated from durable evidence. XP was not imperatively incremented, so rendering or retrying an action could not award it twice.

## State that did not persist before the upgrade

- account ID, email, account creation date, and last login
- cross-browser or cross-device state
- cloud save confirmation and pending-sync status
- achievement unlock dates
- People Lab scenario choices
- UI preferences
- unfinished form state before a record was submitted
- active visual tabs and temporary completion animations

The upgrade persists People Lab choices, achievement dates, and user preferences. Temporary navigation animation state and unsubmitted tool forms remain intentionally ephemeral. Lesson text work is saved while typing and cloud-debounced.

## Migration and durability strategy

1. Preserve both legacy keys without deleting them.
2. Use a new per-account local backup key after authentication.
3. Load cloud state through the persistence repository, not from UI components.
4. If cloud state is empty and legacy progress exists, require explicit import.
5. If both exist, show timestamps and record counts and offer safe merge, cloud retention, or an explicit device-copy replacement.
6. Confirm the Supabase transaction before marking migration complete.
7. Keep pending changes and their idempotency key locally after network failure.
8. Retry on reconnect and merge optimistic-revision conflicts by stable record ID and update timestamp.

## Persistence boundary

The UI continues to use `useOperatorState`. That hook coordinates:

- `LocalOperatorStateRepository` for immediate per-user device backup
- `SupabaseOperatorStateRepository` for the authoritative cross-device copy
- `OperatorStateSyncEngine` for debounce, retry, idempotency, conflict handling, migration, and visible sync status

Supabase access is not scattered through training or operating-tool components. A future ACMOS-compatible backend can replace the cloud repository without coupling this repository to another application.
