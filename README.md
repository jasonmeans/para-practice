# Dove's ParaPro Practice

## Overview

Dove's ParaPro Practice is a polished study website for one learner preparing for ParaPro (1755). It offers original mixed tests, section quizzes, saved history, resumable sessions, trend charts, and study insights in a calm light/dark experience that follows system settings by default.

This project is an unofficial study aid. It is not affiliated with ETS, does not use official paid test items, and does not predict or claim an official score.

## Why this project exists

The goal is to give one learner a steady, encouraging place to practice, review misses, and pick up right where she left off whenever she comes back.

## Copyright and non-affiliation note

- This site uses original practice content created for study purposes.
- It does not copy, reproduce, or scrape official ETS paid or protected questions.
- It is not affiliated with, endorsed by, or sponsored by ETS.
- Results are study-readiness signals only, not official scores or pass guarantees.

## Features

- Full mixed practice tests with randomized question order
- Section quizzes for reading, writing, math, and classroom application
- Weak-area and missed-questions review modes
- Account-backed pause and resume
- Detailed results with explanations and recommended focus areas
- Saved history through a ready-to-run local backend
- GitHub Pages deployment wired to a public local-backend bridge
- Score trend and section trend charts
- Study insights for strongest sections, weakest sections, recurring errors, and momentum
- JSON export and import for backup and restore
- Responsive phone-friendly practice flow
- Light and dark themes that follow the system setting automatically
- Optional Supabase-backed GitHub Pages deployment via GitHub Actions

## Architecture

### Stack

- Vite
- React
- TypeScript
- Node local backend for ready-to-run account storage
- Supabase Auth + Postgres for hosted deployments
- Recharts
- Vitest
- ESLint + Prettier

### App structure

- [`src/data/questions.ts`](/Users/jasonmeans/code/personal/para-practice/src/data/questions.ts): original question bank
- [`src/lib/quiz/engine.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/engine.ts): quiz generation and adaptive weighting
- [`src/lib/quiz/scoring.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/scoring.ts): scoring and result summaries
- [`src/lib/insights/analyze.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/insights/analyze.ts): long-term study insights
- [`src/lib/backend/authService.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/backend/authService.ts): auth routing between local backend and Supabase
- [`src/lib/backend/historyService.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/backend/historyService.ts): saved attempt/session storage plus import/export
- [`src/lib/supabase/client.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/supabase/client.ts): hosted backend client setup
- [`src/lib/theme.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/theme.ts): system-aware theme behavior
- [`server/index.mjs`](/Users/jasonmeans/code/personal/para-practice/server/index.mjs): local account and history API plus static app server
- [`supabase/migrations/20260418_backend_sync.sql`](/Users/jasonmeans/code/personal/para-practice/supabase/migrations/20260418_backend_sync.sql): database schema and RLS policies

### Data storage

- By default, attempt history and active sessions live in [`~/.para-practice-local/store.json`](/Users/jasonmeans/.para-practice-local/store.json) through the bundled local backend.
- When Supabase browser credentials are provided at build time, the app switches to Supabase Auth + Postgres instead.
- When `VITE_LOCAL_API_BASE_URL` is provided at build time, GitHub Pages points at the same bundled backend over HTTPS.
- The browser keeps only the auth session locally.
- JSON export/import remains available for backup and restore.

## Local development

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Build the app:

   ```bash
   npm run build
   ```

3. Start the bundled backend and static server:

   ```bash
   npm start
   ```

4. Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

The local backend listens on the same origin as the app and writes account data to [`~/.para-practice-local/store.json`](/Users/jasonmeans/.para-practice-local/store.json).

## Hosted internet mode

GitHub Pages can run in either of these hosted modes:

- `VITE_LOCAL_API_BASE_URL`: connect the static Pages build to the bundled local backend through a public HTTPS tunnel
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`: switch the app to Supabase Auth + Postgres

If you want to provide your own hosted configuration, copy the env template:

```bash
cp .env.example .env.local
```

Then either:

1. fill in `VITE_LOCAL_API_BASE_URL` with your HTTPS backend URL

or:

1. create a Supabase project
2. run the SQL in [`supabase/migrations/20260418_backend_sync.sql`](/Users/jasonmeans/code/personal/para-practice/supabase/migrations/20260418_backend_sync.sql)
3. fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
4. add the same values as GitHub repository secrets for the Pages workflow
5. add your local and Pages URLs to Supabase Auth allowed redirects

## Testing

Run the quality checks:

```bash
npm run lint
npm run test
npm run build
npm run verify:local-backend
npm run test:e2e
```

## Deployment

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy-pages.yml`](/Users/jasonmeans/code/personal/para-practice/.github/workflows/deploy-pages.yml) that:

1. installs dependencies with `npm ci`
2. runs lint
3. runs tests
4. runs browser e2e coverage
5. builds the static site
6. deploys the `dist` folder to GitHub Pages on push to `main`

The workflow automatically switches Vite into GitHub Pages base-path mode with `BUILD_TARGET=pages`.

For this machine, the published site is available at [https://jasonmeans.github.io/para-practice/](https://jasonmeans.github.io/para-practice/). The local backend bridge is maintained by [`scripts/public-backend-daemon.mjs`](/Users/jasonmeans/code/personal/para-practice/scripts/public-backend-daemon.mjs), which updates the `VITE_LOCAL_API_BASE_URL` repository secret and re-runs the Pages workflow whenever the public tunnel URL changes.

### Manual GitHub setup

In the repository settings on GitHub:

1. Open **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**

In the repository **Secrets and variables** section, add the hosted backend values you want the Pages build to use:

- `VITE_LOCAL_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The app is configured for GitHub Pages-safe base pathing and hash routing.

## Data storage and privacy

- In the default local mode, practice history and active sessions are stored in [`~/.para-practice-local/store.json`](/Users/jasonmeans/.para-practice-local/store.json) for the signed-in learner.
- In hosted mode, practice history and active sessions are stored in Supabase for the signed-in learner.
- The browser stores only the auth session locally.
- Exporting history creates a JSON backup.
- Importing history upserts attempts into the signed-in learner's backend account.

## Import/export history

Use the History page to:

- export saved attempts and the current saved session as JSON
- import a previous JSON backup into the current account
- clear saved history after confirmation

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

- [`AGENTS.md`](/Users/jasonmeans/code/personal/para-practice/AGENTS.md)
- [`MASTER-EXECUTION.md`](/Users/jasonmeans/code/personal/para-practice/MASTER-EXECUTION.md)
- [`IMPLEMENTATION_PLAN.md`](/Users/jasonmeans/code/personal/para-practice/IMPLEMENTATION_PLAN.md)
- [`daily.md`](/Users/jasonmeans/code/personal/para-practice/daily.md)
- [`COMMS.md`](/Users/jasonmeans/code/personal/para-practice/COMMS.md)
