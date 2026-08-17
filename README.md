# Skadra Ventures — Operator Mode

Operator Mode is Gabi's standalone executive operations and leadership simulator. Its command center is G-OPS: the Gabi Operations Command System.

The application teaches a concept in plain language before asking Gabi to practice, test, or apply it. It combines structured business education with scenario decisions, projects, real-world field missions, relationship building, operating tools, and a long-term VP/COO career path.

This repository is intentionally independent. It does not import, call, modify, or require Andrew's Owner Mode application or ACMOS.

## V1 capabilities

- G-OPS command center with current rank, level, XP, campaign progress, next action, field mission, network status, venture status, and achievements.
- Sixteen-level Year One campaign in the required order.
- Gated teach → practice → test → apply lesson flow.
- Plain-English concept cards with why it matters, Skadra examples, COO application, and common mistakes.
- Applied knowledge checks with immediate explanations.
- Level projects, field missions, boss battles, reflections, XP, ranks, and achievements.
- Field Ops mission log.
- Relationship Network with follow-up dates and relationship strength.
- Customer Experience, Operations, and People Labs.
- Weekly Operator Journal.
- Ten-stage vending location pipeline.
- Standalone Founders Mode operating assessments with no external integration.
- Device-local persistence with a replaceable repository boundary.
- Responsive desktop, tablet, and mobile layouts.
- Product-specific Open Graph and X preview metadata.

No paid services, API keys, external accounts, or cloud database are required for V1.

## Requirements

- Node.js 22 or newer.
- npm 10 or newer.

The included .nvmrc selects Node.js 24 for teams using nvm.

## Install and run

    npm install
    npm run dev

Open http://localhost:3000 in a browser.

## Production build

    npm run build
    npm run start

The application uses standard Next.js production scripts and does not hard-code a deployed host. Social metadata derives absolute URLs from the incoming request host.

## Quality checks

    npm run lint
    npm run typecheck
    npm run test
    npm run build

Run the complete validation sequence with:

    npm run check

Automated tests cover:

- XP calculation
- rank thresholds
- sequential level unlocking
- mission completion and campaign progress
- knowledge-check scoring
- boss-battle scoring
- customer and venture scoring
- achievement unlocking
- location-pipeline progression
- local persistence and invalid-data recovery

## Folder structure

    public/
      og.png                         Social preview card
    src/
      app/                           App Router entry, metadata, and global design system
      components/operator/           G-OPS product surfaces and lesson engine
      content/
        levels/                      Structured Year One curriculum
        future-campaigns.ts          Locked career-mode phases
        field-mission-templates.ts   Field, network, and journal prompts
        types.ts                     Curriculum content contracts
      hooks/
        use-operator-state.ts        Client state actions and persistence wiring
      lib/
        domain/                      XP, ranks, scoring, achievements, and pipeline rules
        persistence/                 Replaceable local repository implementation

Curriculum content is data. React components render and manage the learning experience without owning the lesson copy.

## Adding or editing a lesson

1. Open the matching file under src/content/levels.
2. Add or edit an OperatorLevel record with the helper functions in helpers.ts.
3. Keep the teaching order intact:
   - Mission brief
   - Why Gabi needs it
   - Concepts
   - Skadra example
   - Practice
   - Knowledge check
   - Project
   - Field mission
   - Boss battle
   - Reflection
4. Define every unfamiliar term in plain language before using it in a question.
5. Include why the term matters, a relatable example, Gabi's COO use, and a common mistake.
6. Add applied answer feedback for every knowledge-check option.
7. Run npm run check.

## Adding campaign content

Year One is assembled in src/content/levels/index.ts. New future phases belong in src/content/future-campaigns.ts until their playable curriculum is ready.

A campaign should remain a typed content collection. Do not embed a large curriculum directly into a component.

## Changing XP and ranks

- Per-level XP lives in each OperatorLevel record.
- Tool XP values live in src/lib/domain/progression.ts under XP_VALUES.
- Core rank thresholds live in RANKS.
- Prestige ranks require milestone logic and should not be unlocked by XP alone.

XP is derived from durable completed records. It is not incremented imperatively, which prevents duplicate awards after refreshes or rerenders.

## Adding achievements

1. Add the achievement definition to ACHIEVEMENTS in src/lib/domain/achievements.ts.
2. Add a deterministic evidence rule in getUnlockedAchievementIds.
3. Add or update an achievement test.
4. Avoid achievements based only on opening a screen; reward meaningful progress.

## Persistence

V1 uses localStorage through LocalOperatorStateRepository.

The UI talks to the repository boundary rather than directly reading browser storage. This makes it possible to add a future Supabase/Postgres implementation without rewriting the curriculum or product surfaces.

Important V1 limitation: localStorage belongs to one browser on one device. It survives refreshes and browser restarts, but it does not synchronize across devices and is not an authoritative cloud backup.

## Future cloud accounts and persistence

A future hosted version can add:

- user authentication
- one cloud record per Gabi account
- cross-device progress
- backups and migrations
- shared venture records with explicit access controls
- administrative curriculum publishing

Implement the future provider behind OperatorStateRepository. Keep Owner Mode and ACMOS integrations optional and separately authorized.

## Future Andrew/Gabi integration

Founders Mode already models two independent views:

- Andrew: financial attractiveness
- Gabi: operational attractiveness

V1 only stores Gabi's local assessment. It does not connect to Andrew's repository or assume access to it.

A future integration should use a documented API or shared cloud contract for a SharedVenture record. It should never couple the two source repositories or read another application directly.

## Deployment

This Next.js application can be hosted on a standard Node-compatible platform. A future deployment should:

1. Create a private or public project on the chosen host.
2. connect this repository
3. use npm run build as the build command
4. use the host-provided URL
5. add authentication before storing sensitive or multi-device data
6. replace local persistence when cross-device continuity is required

The finished experience is designed so Gabi can open a normal web link and continue independently without VS Code or Codex.

