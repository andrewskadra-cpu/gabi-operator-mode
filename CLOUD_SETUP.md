# Operator Mode cloud setup

This guide is for setting up Gabi's Supabase account and connecting the existing GitHub-to-Vercel deployment. You do not need to be an experienced software engineer.

Operator Mode needs two browser-safe Supabase values. It does **not** need a service-role key, database password, OpenAI key, or any paid API.

## Before you begin

Have these available:

- access to the GitHub repository's Vercel project
- a Supabase account
- the current Vercel production URL
- about 20 minutes

The database migration is committed at `supabase/migrations/202608170001_operator_mode_cloud.sql`.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Choose **New project**.
3. Select or create an organization.
4. Name the project something clear, such as `skadra-gabi-operator-mode`.
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

## 3. Apply the database migration

The simplest method is the Supabase SQL Editor:

1. In Supabase, choose **SQL Editor**.
2. Choose **New query**.
3. Open `supabase/migrations/202608170001_operator_mode_cloud.sql` from this repository.
4. Copy the complete file into the SQL Editor.
5. Choose **Run** once.
6. Confirm the query finishes without errors.

Then open **Table Editor**. You should see these 15 tables:

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
```

The migration enables Row Level Security and creates own-record policies on all 15 tables. Do not disable RLS.

If you already use the Supabase CLI, you may link the repository and run `supabase db push` instead. Use only one method for this first migration.

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

## 8. Create Gabi's account

1. On the branded G-OPS sign-in screen, choose **Create account**.
2. Enter `Gabi` as the display name.
3. Enter the email address that should permanently own the training data.
4. Choose a strong password with at least eight characters.
5. If email confirmation is enabled, open the confirmation email and follow the link.
6. Sign in.

Supabase creates a stable user ID. All database policies compare that ID to each row's `user_id`.

## 9. Import existing device progress

If this browser contains V1 progress, Operator Mode displays:

> Existing progress was found on this device.

- If the cloud account is empty, choose **Import existing progress**.
- If cloud progress also exists, compare the timestamps and record counts. **Merge safely** is the normal choice.
- The old localStorage data is not deleted.
- If the cloud write fails, migration remains incomplete and the original device copy remains available.

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
2. Sign in with Gabi's same account.
3. Confirm progress, XP, achievements, journal entries, relationships, missions, and pipeline data match.
4. Make one change and confirm it appears after reopening the first device.

## 13. Verify data in Supabase

In Supabase **Table Editor**, inspect a few tables such as:

- `training_progress`
- `lesson_progress`
- `journal_entries`
- `relationships`
- `locations`

Rows should contain Gabi's Supabase user ID in `user_id`. Do not edit rows manually during normal use.

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
