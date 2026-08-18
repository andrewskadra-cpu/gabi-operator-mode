# G-OPS V2 cloud setup

This guide connects the unified CEO/COO G-OPS application to the existing Supabase and GitHub-to-Vercel deployment. It preserves the original Gabi Operator Mode data.

Operator Mode needs two browser-safe Supabase values. It does **not** need a service-role key, database password, OpenAI key, or any paid API.

## Before you begin

Have these available:

- access to the GitHub repository's Vercel project
- a Supabase account
- the current Vercel production URL
- about 20 minutes

The migrations are committed at:

```text
supabase/migrations/202608170001_operator_mode_cloud.sql
supabase/migrations/202608180001_dual_executive_tracks.sql
```

The first file is the unchanged production baseline. The second file is the additive G-OPS V2 upgrade.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Choose **New project**.
3. Select or create an organization.
4. Name the project something clear, such as `skadra-g-ops`.
5. Create and securely store the database password. Operator Mode does not put this password in source code or Vercel.
6. Choose a region near Gabi.
7. Create the project and wait until Supabase reports that it is ready.

The free Supabase plan is suitable for initial use. Review Supabase's current inactivity and backup policies before relying on a free project for years; periodic JSON exports provide an additional recovery copy.

## 2. Find the project URL and publishable key

1. Open the new Supabase project.
2. Click **Connect** near the top of the project dashboard.
3. Find the **Project URL**.
4. Find the **Publishable key**. New projects usually show a key beginning with `sb_publishable_`.

You will map them exactly like this:

```text
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

These two values are intentionally browser-safe when Row Level Security is enabled. Do not use or expose the `service_role` key. Do not add a service-role key to Vercel.

## 3. Apply the database migrations

### Existing Operator Mode Supabase project

Do not rerun or edit the original migration. Apply only the complete new file:

```text
supabase/migrations/202608180001_dual_executive_tracks.sql
```

Before applying it, understand exactly what it does:

- adds nullable `executive_role`, `role_selected_at`, and `role_onboarding_completed_at` columns to `profiles`
- sets existing profiles that already have `training_progress` to COO and retains all existing records
- creates `founder_mission_progress` with stable IDs and per-account CEO/COO evidence
- enables own-user and role-matching RLS on that new table
- adds authenticated `assign_executive_role`, `load_executive_state`, and `save_executive_state` functions
- leaves the original tables, data, IDs, revisions, functions, and migration file intact

Test this migration against a non-production Supabase project and take a current backup/export before applying it to the live project. It contains no reset, drop, truncate, or destructive data rewrite.

### Brand-new Supabase project

Apply both complete files in timestamp order: `202608170001_operator_mode_cloud.sql`, then `202608180001_dual_executive_tracks.sql`.

The simplest method is the Supabase SQL Editor:

1. In Supabase, choose **SQL Editor**.
2. Choose **New query**.
3. Open the migration file appropriate to the project state as explained above.
4. Copy the complete file into the SQL Editor.
5. Choose **Run** once.
6. Confirm the query finishes without errors.

Then open **Table Editor**. After both migrations, you should see these 16 tables:

```text
profiles
operator_preferences
training_progress
lesson_progress
knowledge_check_answers
user_achievements
field_missions
relationships
customer_experience_reviews
operations_processes
people_lab_sessions
journal_entries
locations
founders_assessments
sync_operations
founder_mission_progress
```

The migrations enable Row Level Security and create own-record policies on all 16 tables. Do not disable RLS.

If you already use the Supabase CLI, you may link the repository and run `supabase db push` instead. Use only one migration method for a given project.

## 4. Configure email authentication

1. In Supabase, choose **Authentication** and then **Providers**.
2. Confirm **Email** is enabled.
3. Keep email confirmation enabled for production unless you deliberately choose otherwise.
4. Under **Authentication → URL Configuration**, set **Site URL** to the Vercel production URL, for example `https://operator-mode.example.vercel.app`.
5. Add these redirect URLs:

```text
http://localhost:3000/**
https://YOUR_VERCEL_DOMAIN/**
```

If Vercel preview deployments will be used for authentication testing, add the appropriate Vercel preview wildcard using the format shown in Supabase's Redirect URLs documentation.

Password reset emails return through `/auth/callback` and then open `/update-password`, so the redirect URLs must be correct.

## 5. Configure local development

1. Copy `.env.example` to a new file named `.env.local`.
2. Replace the placeholders with the Project URL and Publishable key.
3. Do not commit `.env.local`; it is already ignored by Git.
4. Run:

```text
npm install
npm run dev
```

5. Open `http://localhost:3000`.

Without these environment variables, Operator Mode intentionally shows a setup-required screen instead of inventing credentials or failing the build.

## 6. Add the environment variables to Vercel

1. Open the Operator Mode project in Vercel.
2. Choose **Settings → Environment Variables**.
3. Add `NEXT_PUBLIC_SUPABASE_URL` with the Supabase Project URL.
4. Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the Supabase Publishable key.
5. Enable both for **Production**, **Preview**, and **Development** if those environments will be used.
6. Do not add `SUPABASE_SERVICE_ROLE_KEY`.
7. Save the variables.

## 7. Redeploy Operator Mode

Environment changes do not modify an already-built deployment.

1. In Vercel, open **Deployments**.
2. Redeploy the latest successful GitHub deployment, or push the completed code to GitHub and let Vercel build it.
3. Wait for the production deployment to pass.
4. Open the normal Vercel URL.

## 8. Create and assign the two accounts

For Gabi's existing account, sign in normally. The migration assigns an account with existing training progress to COO automatically; no original lesson or operating record is recreated.

For a new account:

1. On the branded G-OPS sign-in screen, choose **Create account**.
2. Enter the correct person's display name and permanent email address.
3. Choose a strong password with at least eight characters.
4. If email confirmation is enabled, open the confirmation email and follow the link.
5. Sign in and choose the correct CEO or COO track.
6. Read the confirmation warning and confirm once.

Create Andrew and Gabi as separate Supabase Auth users. Never share one login. Role selection is stored in Supabase and is not casually switchable in Settings.

Supabase creates a stable user ID. All database policies compare that ID to each row's `user_id`.

## 9. Import existing device progress

If this browser contains V1 progress, Operator Mode displays:

> Existing progress was found on this device.

- If the cloud account is empty, choose **Import existing progress**.
- If cloud progress also exists, compare the timestamps and record counts. **Merge safely** is the normal choice.
- The old localStorage data is not deleted.
- If the cloud write fails, migration remains incomplete and the original device copy remains available.
- Imported original Operator Mode progress is retained on the COO track.

## 10. Test saving

1. Open a lesson and type at least ten characters in the practice area.
2. Watch the global indicator move through **Saving**, **Syncing**, and **Saved**.
3. Complete a discrete action such as a quiz submission or field mission; those queue an immediate cloud save.
4. Open **Settings & Data** and confirm **Safely saved** and a recent last-sync time.

## 11. Test logout and login restoration

1. In **Settings & Data**, choose **Log out**.
2. Sign in again.
3. Confirm the lesson draft, XP, and saved records return.

## 12. Test another device or browser

1. Open the same production URL on a different browser, phone, or computer.
2. Sign in with the same account used in the first browser.
3. Confirm progress, XP, achievements, journal entries, relationships, missions, and pipeline data match.
4. Make one change and confirm it appears after reopening the first device.

Repeat the test independently for one CEO account and one COO account. Confirm each account sees only its own role, progress, founder analysis, and export.

## 13. Verify data in Supabase

In Supabase **Table Editor**, inspect a few tables such as:

- `training_progress`
- `lesson_progress`
- `journal_entries`
- `relationships`
- `locations`
- `profiles` (`executive_role` and role timestamps)
- `founder_mission_progress`

Rows should contain the owning account's Supabase user ID in `user_id`. Do not edit roles or progress rows manually during normal use.

## 14. Test the portable backup

1. Open **Settings & Data**.
2. Choose **Export my data**.
3. Confirm a dated `.json` file downloads.
4. Store that file somewhere safe.

Import/restore is deliberately not automatic yet. A future restore tool should validate the backup, compare every record with cloud timestamps, preview conflicts, and require confirmation before replacing newer data.

## Troubleshooting

### The app says cloud setup is required

One or both Vercel environment variables are missing, misspelled, or were added after the last deployment. Check the names exactly and redeploy.

### Login works but data does not save

Confirm the migration ran successfully and RLS remains enabled. The Settings screen will retain the device backup and show a sync issue rather than silently discarding work.

### Confirmation or reset links open the wrong address

Correct **Authentication → URL Configuration** in Supabase. The Site URL must be the production Vercel URL and the Redirect URLs must include that domain.

### A change was made while offline

The save indicator should report that the change is safe on the device. Keep the browser data intact, reconnect, and choose **Retry cloud sync** if automatic retry has not completed.

### The free Supabase project was paused

Restore/unpause it in Supabase, then test login and sync. Keep periodic JSON exports as a separate recovery layer.

## Values required for final live validation

The code, migration, tests, and production build can be validated without credentials. A real end-to-end cloud test requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- the migration applied to that Supabase project
- the final Vercel URL configured in Supabase Auth

Do not send a database password or service-role key. If Codex is asked to perform live validation later, set the two browser-safe values in `.env.local` or the approved environment rather than committing them.

## V2 production checklist

1. Back up/export Gabi's current data.
2. Apply `202608180001_dual_executive_tracks.sql` to a non-production project and validate it.
3. Apply that same complete file to the existing production Supabase project once.
4. Verify Gabi's `profiles.executive_role` is `coo` and her existing row counts remain present.
5. Deploy the V2 code to Vercel after the migration succeeds.
6. Sign in as Gabi and confirm her prior level, drafts, XP evidence, records, and COO dashboard.
7. Create/sign in as Andrew, choose CEO once, and confirm Financial Statements is Level 1.
8. Test one lesson draft and one founder-mission draft on a second browser for each account.
9. Verify the accounts cannot read one another's records with authenticated client requests.
10. Export each account's JSON backup and retain it securely.

No Vercel environment-variable names or values change for G-OPS V2.
