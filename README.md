# Skadra Ventures — Operator Mode

Operator Mode is Gabi's standalone executive operations and leadership simulator. Its command center is G-OPS: the Gabi Operations Command System.

The application teaches concepts in plain language before asking Gabi to practice, test, apply, and reflect. It combines a 16-level Year One curriculum with field missions, relationship building, customer and operations labs, a weekly journal, a vending-location pipeline, and independent Founders Mode assessments.

This repository is intentionally independent. It does not import, call, modify, or require Andrew's Owner Mode or ACMOS.

## Cloud persistence upgrade

Operator Mode now uses a layered persistence architecture:

```text
USER ACTION
  → React state updates immediately
  → per-account localStorage backup
  → debounced or immediate Supabase transaction
  → revision/idempotency confirmation
  → Saved status
```

If the cloud request fails, the local backup and pending idempotency key remain. The application retries when connectivity returns and reports **Offline** or **Sync issue** instead of silently discarding work.

Supabase is authoritative across devices. localStorage is a migration source, device backup, and unsynced-change queue—not the only copy.

## Architecture

- **Next.js 16 App Router** handles protected pages, authentication callbacks, and Vercel deployment.
- **Supabase Auth** provides signup, login, logout, cookie-backed session restoration, email confirmation, and password recovery.
- **Supabase Postgres** stores normalized user-owned records.
- **Row Level Security** restricts every table to `auth.uid() = user_id`.
- **`LocalOperatorStateRepository`** maintains immediate per-account backups and reads both legacy storage formats.
- **`SupabaseOperatorStateRepository`** is the only application repository that knows the Supabase RPC contract.
- **`OperatorStateSyncEngine`** handles debounce, immediate saves, retry, idempotency, optimistic revisions, cross-tab recovery, and merge conflicts.
- **Stable curriculum and record IDs** preserve progress across curriculum and application deployments.

The UI does not contain direct table calls. A future backend or ACMOS integration can implement the cloud repository contract without rewriting the lesson engine or operating tools.

The pre-upgrade inventory and migration rationale are in [docs/PERSISTENCE_INVENTORY.md](docs/PERSISTENCE_INVENTORY.md).

## Persisted data

Cloud persistence covers:

- profile, email-backed account identity, account creation, last login, and preferences
- campaign and active-level state
- lesson steps, practice/project drafts, knowledge answers, quiz scores, boss decisions, reflections, and completion timestamps
- deterministic XP, rank, and campaign completion evidence
- achievements and unlock dates
- field missions
- relationship records, edits, removals, and follow-up dates
- customer-experience audits
- operations process maps
- People Lab choices
- weekly journal entries
- location pipeline records and stage changes
- Gabi's independent Founders Mode assessments

XP remains derived from unique durable evidence rather than incremented imperatively. This prevents a retry, double-click, refresh, or second render from double-awarding XP.

## Database schema

The committed migration is:

```text
supabase/migrations/202608170001_operator_mode_cloud.sql
```

It creates:

- `profiles`
- `operator_preferences`
- `training_progress`
- `lesson_progress`
- `knowledge_check_answers`
- `user_achievements`
- `field_missions`
- `relationships`
- `customer_experience_reviews`
- `operations_processes`
- `people_lab_sessions`
- `journal_entries`
- `locations`
- `founders_assessments`
- `sync_operations`

All tables have stable primary keys, `user_id`, `created_at`, and `updated_at`. Foreign keys cascade when the Supabase Auth user is deliberately deleted. Useful user/date/stage indexes are included.

The `save_operator_state` database function converts one typed application snapshot into normalized records in a single Postgres transaction. It uses:

- an expected revision to detect stale writers
- a request UUID to make retries idempotent
- a transaction so partial cloud migration/saves cannot be confirmed
- unique constraints for lessons, quiz answers, achievements, scenarios, and user roots

The `load_operator_state` function reconstructs the typed application state from the normalized records.

## Row Level Security

RLS is enabled on all 15 user-data tables. Each table has separate authenticated `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies based on:

```sql
(select auth.uid()) = user_id
```

The publishable browser key is safe only because RLS is enforced. Operator Mode never uses a service-role key in the browser or application runtime.

## Authentication flow

1. An unauthenticated visitor is redirected to `/login`.
2. Gabi can create an email/password account or sign in.
3. Supabase stores the session in cookies using `@supabase/ssr`.
4. the Next.js request proxy refreshes and verifies session claims.
5. the protected home page validates claims and the current user.
6. Postgres RLS independently authorizes every data operation.
7. password reset email returns through `/auth/callback` to `/update-password`.

Authorization is not based on client-side hiding.

## Legacy localStorage migration

The application continues to detect:

```text
skadra.operator-mode.state.v1
skadra.operator-mode.progress.v1
```

Authenticated backups use a new user-specific key. Legacy data is never deleted automatically.

- Legacy-only progress prompts **Import existing progress**.
- Legacy plus cloud progress shows both timestamps and record counts.
- **Merge safely** unions stable records, retains the furthest pipeline stage, preserves milestone completion, and chooses newer drafts without discarding non-empty work.
- Migration is marked complete only after Supabase confirms the transaction.
- A failed import leaves the original browser data and migration prompt intact.

## Automatic saving

- Text-heavy lesson drafts use a 900 ms cloud debounce while backing up locally immediately.
- Discrete milestones—lesson steps/completion, scores, new records, relationship edits/removals, People Lab choices, and pipeline changes—queue immediate cloud saves.
- A global indicator reports **Loading cloud**, **Saving**, **Syncing**, **Saved**, **Offline backup**, or **Sync issue**.
- Reconnect and Settings-triggered retry reuse pending local work.
- Concurrent tabs/devices use optimistic revisions and a stable-ID merge instead of last-write-wins replacement.

## Export and recovery

**Settings & Data → Export my data** downloads a portable JSON backup containing account metadata and the complete typed Operator Mode state.

Automatic import is intentionally deferred. A safe future restore must validate the file, compare record timestamps with current cloud data, preview conflicts, and require confirmation before replacing anything newer.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- a Supabase project for authentication and cloud persistence

## Environment variables

Copy `.env.example` to `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Both are public/client-safe Supabase connection values. No server-only secret is required by Operator Mode. Never add a service-role key to the browser, GitHub, source code, or Vercel for this application.

Without these values, the app builds successfully and displays a setup-required screen. Live authentication and database tests require a configured project.

## Local development

```text
npm install
npm run dev
```

Open `http://localhost:3000`.

Follow [CLOUD_SETUP.md](CLOUD_SETUP.md) to create the Supabase project, apply the migration, configure Auth URLs, and add Vercel variables.

## Quality checks

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

Or run the full sequence:

```text
npm run check
```

Automated tests cover:

- XP and rank thresholds
- sequential level/campaign progression
- no duplicate XP from rerenders
- deterministic achievement unlocking
- knowledge and boss scoring
- local backup round-trips for lessons, journals, missions, relationships, and pipeline data
- relationship create/update/delete persistence
- malformed local state recovery
- version-one state and legacy progress-key migration
- new-account cloud initialization
- cloud restoration in a later session
- offline local fallback
- retry with the same idempotency key after a lost response
- optimistic conflict merge
- failed legacy migration remaining pending

Real Supabase authentication, RLS, email delivery, cross-device behavior, and Vercel environment wiring must also be tested against the configured project; unit tests do not pretend those external services succeeded.

## Adding or changing curriculum

Curriculum content is separate from UI code under `src/content/levels`.

Every campaign, level, knowledge question, boss option, scenario, achievement, and generated user record needs a stable semantic ID. Never use array position as the durable identity.

When changing an existing lesson:

1. keep its existing level ID if it represents the same durable lesson
2. keep existing question IDs when the question's identity is unchanged
3. add new content with new stable IDs
4. do not recycle a removed ID for unrelated content
5. add a data migration before intentionally renaming a durable ID
6. run `npm run check`

Future deployments update code and curriculum definitions; they do not recreate or erase Supabase data.

## Future database migrations

Create a new timestamped SQL file under `supabase/migrations` for every schema change. Never edit an already-applied production migration to represent a new change.

Before deployment:

1. back up/export important data
2. test the new migration against a non-production Supabase project
3. preserve stable IDs and existing columns unless a data migration is included
4. verify RLS on every new user-owned table
5. regenerate database types if the client begins querying new tables directly
6. deploy the database migration before code that depends on it

## Vercel deployment

The intended flow remains:

```text
CODEX → GITHUB → VERCEL → NORMAL WEB URL → LOGIN → CLOUD PROGRESS
```

Add both public Supabase environment variables to Vercel Production, Preview, and Development as appropriate, then redeploy. Set the Supabase Auth Site URL and Redirect URLs to the production Vercel domain.

Database data is independent of Vercel deployments. A code deployment does not recreate Postgres tables or erase progress.

## Troubleshooting

- **Setup-required screen:** one or both public environment variables are missing; add them and redeploy/restart.
- **Login works but sync fails:** confirm the migration ran and RLS remains enabled; device backup remains active.
- **Reset link opens the wrong host:** correct Supabase Auth Site URL and Redirect URLs.
- **Offline changes:** reconnect and use **Settings & Data → Retry cloud sync** if automatic retry has not completed.
- **Migration prompt returns:** the previous import was not confirmed or no migration decision was stored; the original local copy remains intact.
- **Unexpected conflict:** choose safe merge and export a JSON backup before any explicit replacement.

See [CLOUD_SETUP.md](CLOUD_SETUP.md) for the complete nontechnical setup and verification checklist.
