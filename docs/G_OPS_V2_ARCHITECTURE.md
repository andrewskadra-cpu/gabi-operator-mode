# G-OPS V2 architecture

## Purpose

G-OPS V2 extends the existing Gabi-only Operator Mode into one application with two durable account tracks:

- CEO / President: finance, accounting, investing, deals, systems, leadership, strategy, and capital allocation
- COO / Vice President: the preserved operations, people, customer, execution, and relationship curriculum

The application remains independent of any Owner Mode repository or ACMOS implementation.

## Role model

`ExecutiveRole` is the closed union `"ceo" | "coo"`. A new authenticated account selects one role. `assign_executive_role` locks the profile row, accepts an idempotent repeat of the same role, and rejects a different role. The selected role and timestamps live in `profiles`; localStorage is only a backup.

The React application waits for cloud hydration before deciding whether to show legacy import, role selection, onboarding, or the role-aware shell. This prevents a stale local default from choosing an account's track.

## Existing-data preservation

The original migration and the 16 COO level IDs are unchanged. The additive migration backfills a profile to `coo` only when that account already has a `training_progress` snapshot. The V3 codec also maps V1/V2 state to COO and preserves all drafts, answers, scores, completion timestamps, records, achievements, and stable IDs.

The old per-user local key remains `skadra.operator-mode.state.v2.{userId}` intentionally. Changing it would strand existing device backups. The JSON state version is independently upgraded to 3.

Old single-key browser progress is still imported through the confirmed migration flow. Legacy-only progress is presented for import before the new role selector and is materialized as COO.

## Curriculum and UI routing

Content remains outside components:

- `src/content/levels/ceo-levels.ts`: CEO Campaign I, 16 exact ordered levels
- `src/content/levels/levels-01-04.ts` through `levels-13-16.ts`: preserved COO campaign
- `src/content/executive-tracks.ts`: future roadmaps, lab lenses, and journal prompts
- `src/content/founder-missions.ts`: shared scenarios with independent role briefs

`getLevelsForRole` chooses the active campaign. Domain services derive role-specific XP, ranks, achievements, scorecards, and next actions from durable evidence. The command center, campaign, lesson player, field ops, labs, journal, ventures/founders, settings, and navigation receive the confirmed role explicitly.

## Founder missions

Founder missions are asynchronous. Each account creates only its own CEO or COO analysis; no client query combines two users. The current missions are First Vending Location and HVAC Business Acquisition.

`founder_mission_progress` stores status, analysis, recommendation, decision, reflection, and timestamps. RLS restricts every operation to `auth.uid() = user_id`; insert/update additionally require the row role to match the caller's profile role. A future shared investment-committee view requires an explicit company-membership model and new authorization policies—it must not infer access from matching mission IDs or email addresses.

## Persistence flow

The V3 state continues through the existing layered pipeline:

```text
UI update
  → immediate per-account local backup
  → debounce or urgent flush
  → save_executive_state transaction
  → optimistic revision + idempotency confirmation
  → retry/merge on reconnect or conflict
```

`save_executive_state` wraps the original normalized state transaction, validates the state role against the protected profile, persists onboarding, and upserts/deletes the caller's founder-mission rows in the same database transaction. `load_executive_state` wraps the original loader and injects authoritative role metadata plus founder missions.

## Deployment boundary

No environment variables were added. V2 continues to use only:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Apply `202608180001_dual_executive_tracks.sql` to a non-production project first, validate both roles and RLS, then apply it to production before deploying code that calls the new RPC functions. No service-role key belongs in Vercel or the browser.
