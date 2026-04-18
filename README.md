# Dove's ParaPro Practice

## Overview

Dove's ParaPro Practice is a polished study website for one learner preparing for ParaPro (1755). It offers original mixed tests, section quizzes, backend-synced history, cross-device resume, trend charts, and study insights in a calm light/dark experience that follows system settings by default.

This project is an unofficial study aid. It is not affiliated with ETS, does not use official paid test items, and does not predict or claim an official score.

## Why this project exists

The goal is to give one learner a steady, encouraging place to practice, review misses, and pick up right where she left off whether she opens the site on a phone, desktop, or another browser.

## Copyright and non-affiliation note

- This site uses original practice content created for study purposes.
- It does not copy, reproduce, or scrape official ETS paid or protected questions.
- It is not affiliated with, endorsed by, or sponsored by ETS.
- Results are study-readiness signals only, not official scores or pass guarantees.

## Features

- Full mixed practice tests with randomized question order
- Section quizzes for reading, writing, math, and classroom application
- Weak-area and missed-questions review modes
- Backend-synced pause and resume across browsers and devices
- Detailed results with explanations and recommended focus areas
- Account-backed history synced through Supabase
- Score trend and section trend charts
- Study insights for strongest sections, weakest sections, recurring errors, and momentum
- JSON export and import for backup and restore
- Responsive phone-friendly practice flow
- Light and dark themes with system sync and a manual override
- GitHub Pages deployment via GitHub Actions

## Architecture

### Stack

- Vite
- React
- TypeScript
- Supabase Auth + Postgres
- Recharts
- Vitest
- ESLint + Prettier

### App structure

- [`src/data/questions.ts`](/Users/jasonmeans/code/personal/para-practice/src/data/questions.ts): original question bank
- [`src/lib/quiz/engine.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/engine.ts): quiz generation and adaptive weighting
- [`src/lib/quiz/scoring.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/scoring.ts): scoring and result summaries
- [`src/lib/insights/analyze.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/insights/analyze.ts): long-term study insights
- [`src/lib/backend/historyService.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/backend/historyService.ts): synced attempt/session storage plus import/export
- [`src/lib/supabase/client.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/supabase/client.ts): backend client setup
- [`src/lib/theme.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/theme.ts): system-aware theme behavior
- [`supabase/migrations/20260418_backend_sync.sql`](/Users/jasonmeans/code/personal/para-practice/supabase/migrations/20260418_backend_sync.sql): database schema and RLS policies

### Data storage

- Attempt history and active sessions live in Supabase tables protected by row-level security.
- The browser keeps only the auth session and theme preference locally.
- JSON export/import remains available for backup and restore.

## Local development

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the env template:

   ```bash
   cp .env.example .env.local
   ```

3. Create a Supabase project and copy:
   - Project URL
   - Publishable key

4. Run the SQL in [`supabase/migrations/20260418_backend_sync.sql`](/Users/jasonmeans/code/personal/para-practice/supabase/migrations/20260418_backend_sync.sql) in the Supabase SQL editor.

5. Put the values into `.env.local`:

   ```bash
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   ```

6. In Supabase Auth settings:
   - add `http://127.0.0.1:4173`
   - add your GitHub Pages URL
   - keep email/password auth enabled
   - configure custom SMTP for production if you want reliable confirmation emails

7. Start the dev server:

   ```bash
   npm run dev
   ```

## Testing

Run the quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Deployment

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy-pages.yml`](/Users/jasonmeans/code/personal/para-practice/.github/workflows/deploy-pages.yml) that:

1. installs dependencies with `npm ci`
2. runs lint
3. runs tests
4. builds the static site
5. deploys the `dist` folder to GitHub Pages on push to `main`

### Manual GitHub setup

In the repository settings on GitHub:

1. Open **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**

In the repository **Secrets and variables** section, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The app is configured for GitHub Pages-safe base pathing and hash routing.

## Data storage and privacy

- Practice history and active sessions are stored in Supabase for the signed-in learner.
- The browser stores only the auth session and theme preference locally.
- Exporting history creates a JSON backup.
- Importing history upserts attempts into the signed-in learner's backend account.

## Import/export history

Use the History page to:

- export synced attempts and the current saved session as JSON
- import a previous JSON backup into the current account
- clear synced history after confirmation

## Extending the question bank

Add more records to [`src/data/questions.ts`](/Users/jasonmeans/code/personal/para-practice/src/data/questions.ts) using the existing `Question` model:

- `id`
- `section`
- `topic`
- `difficulty`
- `prompt`
- `options`
- `correctAnswer`
- `explanation`
- `tags`
- optional `scenario`

The quiz engine is already structured to use future additions for better variety and adaptive selection.

## Image credits

- Dove in flight: [Ahmed Nishaath on Unsplash](https://unsplash.com/photos/a-white-dove-flies-gracefully-through-a-clear-blue-sky-2EoMV_zj9gQ)
- Dove portrait: [Liam Shaw on Unsplash](https://unsplash.com/photos/white-dove-xxPXH7azBVs)

## Roadmap

- Expand the original question bank with more medium and stretch items
- Add richer score review filters
- Add more nuanced adaptive weighting over longer history windows
- Add optional account profile details for this single-learner setup

## Repository operating files

This repo also includes project control files for Codex-style execution:

- [`CLAUDE.md`](/Users/jasonmeans/code/personal/para-practice/CLAUDE.md)
- [`AGENTS.md`](/Users/jasonmeans/code/personal/para-practice/AGENTS.md)
- [`MASTER-EXECUTION.md`](/Users/jasonmeans/code/personal/para-practice/MASTER-EXECUTION.md)
- [`IMPLEMENTATION_PLAN.md`](/Users/jasonmeans/code/personal/para-practice/IMPLEMENTATION_PLAN.md)
- [`daily.md`](/Users/jasonmeans/code/personal/para-practice/daily.md)
- [`COMMS.md`](/Users/jasonmeans/code/personal/para-practice/COMMS.md)
